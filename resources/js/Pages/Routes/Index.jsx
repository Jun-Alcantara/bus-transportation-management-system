import { useState, useEffect } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { ConfirmationModal } from '../../components/ui/confirmation-modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Pagination, PaginationInfo } from '../../components/ui/pagination'
import DashboardLayout from '../../components/DashboardLayout'

// Badge Component
const Badge = ({ children, className = '', variant = 'default' }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        outline: 'bg-white border border-gray-300 text-gray-700'
    }
    
    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    )
}

export default function Routes({ routes, filters }) {
    const { flash, errors } = usePage().props
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [routeToDelete, setRouteToDelete] = useState(null)
    const [search, setSearch] = useState(filters.search || '')

    // Search functionality
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/routes', { search }, {
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
        router.get('/routes', { 
            ...router.page.props.filters, 
            sort: field, 
            direction 
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const deleteRoute = (route) => {
        setRouteToDelete(route)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (routeToDelete) {
            router.delete(`/routes/${routeToDelete.id}`)
        }
        setShowDeleteConfirm(false)
        setRouteToDelete(null)
    }

    const cancelDelete = () => {
        setShowDeleteConfirm(false)
        setRouteToDelete(null)
    }

    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800'
        }
        return (
            <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
                {status}
            </Badge>
        )
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Routes & Runs</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage transportation routes and their associated runs
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button 
                            onClick={() => router.get('/routes/create')}
                            style={{ backgroundColor: '#799EFF', color: 'white' }}
                            className="hover:opacity-90"
                        >
                            Add Route
                        </Button>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search routes..."
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

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteConfirm}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Delete Route"
                    description={`Are you sure you want to delete "${routeToDelete?.name}"? This will also delete all associated runs. This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                />

                {/* Routes Table */}
                <Card>
                    <CardContent className="p-0">
                        {routes.data?.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('name')}
                                                sortDirection={filters.sort === 'name' ? filters.direction : null}
                                            >
                                                Route Name
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('code')}
                                                sortDirection={filters.sort === 'code' ? filters.direction : null}
                                            >
                                                Code
                                            </TableHead>
                                            <TableHead>District</TableHead>
                                            <TableHead>School Term</TableHead>
                                            <TableHead>Runs</TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('status')}
                                                sortDirection={filters.sort === 'status' ? filters.direction : null}
                                            >
                                                Status
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('created_at')}
                                                sortDirection={filters.sort === 'created_at' ? filters.direction : null}
                                            >
                                                Created
                                            </TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {routes.data.map((route) => (
                                            <TableRow key={route.id}>
                                                <TableCell className="font-medium">
                                                    {route.name}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                                        {route.code}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {route.district?.name || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>{route.school_year?.name || 'N/A'}</div>
                                                        <div className="text-muted-foreground">{route.school_term?.name || 'N/A'}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {route.runs?.length || 0} runs
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(route.status)}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(route.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button 
                                                            onClick={() => router.get(`/routes/${route.id}`)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            View
                                                        </Button>
                                                        <Button 
                                                            onClick={() => router.get(`/routes/${route.id}/edit`)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => deleteRoute(route)}
                                                            size="sm"
                                                            style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                            className="hover:opacity-90"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                
                                {/* Pagination */}
                                <div className="flex items-center justify-between p-4 border-t">
                                    <PaginationInfo
                                        from={routes.from}
                                        to={routes.to}
                                        total={routes.total}
                                    />
                                    <Pagination links={routes.links} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {search ? 'No routes found matching your search.' : 'No routes found. Create your first route to get started.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}