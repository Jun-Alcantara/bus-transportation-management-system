import { useState, useEffect } from 'react'
import { Link, useForm, usePage, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { ConfirmationModal } from '../../components/ui/confirmation-modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Pagination, PaginationInfo } from '../../components/ui/pagination'
import DashboardLayout from '../../components/DashboardLayout'

export default function Clients({ clients, filters }) {
    const { flash, errors } = usePage().props
    const [showDisableConfirm, setShowDisableConfirm] = useState(false)
    const [clientToDisable, setClientToDisable] = useState(null)
    const [search, setSearch] = useState(filters.search || '')

    // Search functionality
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/clients', { search }, {
                    preserveState: true,
                    replace: true,
                })
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [search])

    // Sorting functionality
    const handleSort = (field) => {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc'
        router.get('/clients', { 
            ...router.page.props.filters, 
            sort: field, 
            direction 
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const disableClient = (client) => {
        setClientToDisable(client)
        setShowDisableConfirm(true)
    }

    const confirmDisable = () => {
        if (clientToDisable) {
            router.patch(`/clients/${clientToDisable.id}/disable`)
        }
        setShowDisableConfirm(false)
        setClientToDisable(null)
    }

    const enableClient = (client) => {
        router.patch(`/clients/${client.id}/enable`)
    }

    const cancelDisable = () => {
        setShowDisableConfirm(false)
        setClientToDisable(null)
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Clients</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage client information and contact details
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/clients/create">
                            <Button 
                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                className="hover:opacity-90"
                            >
                                Add Client
                            </Button>
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-64"
                        />
                        <svg
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}
                {errors?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                        {errors.error}
                    </div>
                )}

                {/* Disable Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDisableConfirm}
                    onClose={cancelDisable}
                    onConfirm={confirmDisable}
                    title="Disable Client"
                    description={`Are you sure you want to disable "${clientToDisable?.name}"? This will make the client inactive.`}
                    confirmText="Disable"
                    cancelText="Cancel"
                    variant="destructive"
                />

                {/* Clients Table */}
                <Card>
                    <CardContent className="p-0">
                        {clients.data?.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('name')}
                                                sortDirection={filters.sort === 'name' ? filters.direction : null}
                                            >
                                                Client Name
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('category')}
                                                sortDirection={filters.sort === 'category' ? filters.direction : null}
                                            >
                                                Category
                                            </TableHead>
                                            <TableHead>District</TableHead>
                                            <TableHead>Suffolk Company</TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('city')}
                                                sortDirection={filters.sort === 'city' ? filters.direction : null}
                                            >
                                                Location
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('is_active')}
                                                sortDirection={filters.sort === 'is_active' ? filters.direction : null}
                                            >
                                                Status
                                            </TableHead>
                                            <TableHead>Contact Persons</TableHead>
                                            <TableHead className="text-right" style={{ textAlign: 'right' }}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {clients.data.map((client) => (
                                            <TableRow key={client.id}>
                                                <TableCell className="font-medium">
                                                    {client.name}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {client.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {client.district?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                                        {client.suffolk_company}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {client.city}, {client.state}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        client.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {client.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {client.contact_persons?.length || 0} contact(s)
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={`/clients/${client.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        {client.is_active ? (
                                                            <Button 
                                                                onClick={() => disableClient(client)}
                                                                size="sm"
                                                                style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                                className="hover:opacity-90"
                                                            >
                                                                Disable
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => enableClient(client)}
                                                                size="sm"
                                                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                                                className="hover:opacity-90"
                                                            >
                                                                Enable
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                
                                {/* Pagination */}
                                <div className="flex items-center justify-between p-4 border-t">
                                    <PaginationInfo
                                        from={clients.from}
                                        to={clients.to}
                                        total={clients.total}
                                    />
                                    <Pagination links={clients.links} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {search ? 'No clients found matching your search.' : 'No clients found. Create your first client to get started.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}