import { useState, useEffect } from 'react'
import { useForm, usePage, router, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { ConfirmationModal } from '../../components/ui/confirmation-modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Pagination, PaginationInfo } from '../../components/ui/pagination'
import DashboardLayout from '../../components/DashboardLayout'

export default function Schools({ schools, filters }) {
    const { flash, errors } = usePage().props
    const [showDisableConfirm, setShowDisableConfirm] = useState(false)
    const [showEnableConfirm, setShowEnableConfirm] = useState(false)
    const [schoolToToggle, setSchoolToToggle] = useState(null)
    const [search, setSearch] = useState(filters.search || '')

    // Search functionality
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/schools', { search }, {
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
        router.get('/schools', { 
            ...router.page.props.filters, 
            sort: field, 
            direction 
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const disableSchool = (school) => {
        setSchoolToToggle(school)
        setShowDisableConfirm(true)
    }

    const enableSchool = (school) => {
        setSchoolToToggle(school)
        setShowEnableConfirm(true)
    }

    const confirmDisable = () => {
        if (schoolToToggle) {
            router.patch(`/schools/${schoolToToggle.id}/disable`)
        }
        setShowDisableConfirm(false)
        setSchoolToToggle(null)
    }

    const confirmEnable = () => {
        if (schoolToToggle) {
            router.patch(`/schools/${schoolToToggle.id}/enable`)
        }
        setShowEnableConfirm(false)
        setSchoolToToggle(null)
    }

    const cancelToggle = () => {
        setShowDisableConfirm(false)
        setShowEnableConfirm(false)
        setSchoolToToggle(null)
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Schools</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage school information and contact details
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/schools/create">
                            <Button 
                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                className="hover:opacity-90"
                            >
                                Add School
                            </Button>
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search schools..."
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
                    onClose={cancelToggle}
                    onConfirm={confirmDisable}
                    title="Disable School"
                    description={`Are you sure you want to disable "${schoolToToggle?.name}"? The school will be marked as inactive.`}
                    confirmText="Disable"
                    cancelText="Cancel"
                    variant="destructive"
                />

                {/* Enable Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showEnableConfirm}
                    onClose={cancelToggle}
                    onConfirm={confirmEnable}
                    title="Enable School"
                    description={`Are you sure you want to enable "${schoolToToggle?.name}"? The school will be marked as active.`}
                    confirmText="Enable"
                    cancelText="Cancel"
                    variant="default"
                />

                {/* Schools Table */}
                <Card>
                    <CardContent className="p-0">
                        {schools.data?.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('name')}
                                                sortDirection={filters.sort === 'name' ? filters.direction : null}
                                            >
                                                School Name
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('school_code')}
                                                sortDirection={filters.sort === 'school_code' ? filters.direction : null}
                                            >
                                                School Code
                                            </TableHead>
                                            <TableHead>District</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Contact Persons</TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('is_active')}
                                                sortDirection={filters.sort === 'is_active' ? filters.direction : null}
                                            >
                                                Status
                                            </TableHead>
                                            <TableHead className="text-right" style={{ textAlign: 'right' }}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {schools.data.map((school) => (
                                            <TableRow key={school.id}>
                                                <TableCell className="font-medium">
                                                    {school.name}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                                        {school.school_code}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {school.district?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {school.street_number} {school.street}
                                                        <br />
                                                        {school.zip_code}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {school.contact_persons?.length || 0} contact{school.contact_persons?.length !== 1 ? 's' : ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        school.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {school.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={`/schools/${school.id}/edit`}>
                                                            <Button 
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        {school.is_active ? (
                                                            <Button 
                                                                onClick={() => disableSchool(school)}
                                                                size="sm"
                                                                style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                                className="hover:opacity-90"
                                                            >
                                                                Disable
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => enableSchool(school)}
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
                                        from={schools.from}
                                        to={schools.to}
                                        total={schools.total}
                                    />
                                    <Pagination links={schools.links} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {search ? 'No schools found matching your search.' : 'No schools found. Create your first school to get started.'}
                                </p>
                                <Link href="/schools/create" className="mt-4 inline-block">
                                    <Button 
                                        style={{ backgroundColor: '#799EFF', color: 'white' }}
                                        className="hover:opacity-90"
                                    >
                                        Add School
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}