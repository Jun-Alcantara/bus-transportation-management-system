import { useState, useEffect } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalClose } from '../../components/ui/modal'
import { ConfirmationModal } from '../../components/ui/confirmation-modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Pagination, PaginationInfo } from '../../components/ui/pagination'
import DashboardLayout from '../../components/DashboardLayout'

export default function Districts({ districts, filters }) {
    const { flash, errors } = usePage().props
    const [showForm, setShowForm] = useState(false)
    const [editingDistrict, setEditingDistrict] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [districtToDelete, setDistrictToDelete] = useState(null)
    const [search, setSearch] = useState(filters.search || '')

    const form = useForm({
        name: '',
        code: '',
    })

    // Search functionality
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/districts', { search }, {
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
        router.get('/districts', { 
            ...router.page.props.filters, 
            sort: field, 
            direction 
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const submitForm = (e) => {
        e.preventDefault()
        
        if (editingDistrict) {
            form.put(`/districts/${editingDistrict.id}`, {
                onSuccess: () => {
                    form.reset()
                    setShowForm(false)
                    setEditingDistrict(null)
                }
            })
        } else {
            form.post('/districts', {
                onSuccess: () => {
                    form.reset()
                    setShowForm(false)
                }
            })
        }
    }

    const editDistrict = (district) => {
        setEditingDistrict(district)
        form.setData({
            name: district.name,
            code: district.code,
        })
        setShowForm(true)
    }

    const deleteDistrict = (district) => {
        setDistrictToDelete(district)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (districtToDelete) {
            router.delete(`/districts/${districtToDelete.id}`)
        }
        setShowDeleteConfirm(false)
        setDistrictToDelete(null)
    }

    const cancelDelete = () => {
        setShowDeleteConfirm(false)
        setDistrictToDelete(null)
    }

    const cancelForm = () => {
        form.reset()
        setShowForm(false)
        setEditingDistrict(null)
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Districts</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage school districts information
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button 
                            onClick={() => setShowForm(true)}
                            style={{ backgroundColor: '#799EFF', color: 'white' }}
                            className="hover:opacity-90"
                        >
                            Add District
                        </Button>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search districts..."
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

                {/* District Form Modal */}
                <Modal isOpen={showForm} onClose={cancelForm} className="max-w-md">
                    <ModalHeader>
                        <div>
                            <ModalTitle>
                                {editingDistrict ? 'Edit District' : 'Add New District'}
                            </ModalTitle>
                            <ModalDescription>
                                {editingDistrict 
                                    ? 'Update the district information' 
                                    : 'Create a new district for the school bus service'
                                }
                            </ModalDescription>
                        </div>
                        <ModalClose onClose={cancelForm} />
                    </ModalHeader>
                    
                    <ModalContent>
                        <form onSubmit={submitForm} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="district_name">District Name</Label>
                                    <Input
                                        id="district_name"
                                        type="text"
                                        placeholder="e.g., Central School District"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                    />
                                    {form.errors.name && (
                                        <p className="text-sm text-destructive">{form.errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="district_code">District Code</Label>
                                    <Input
                                        id="district_code"
                                        type="text"
                                        placeholder="e.g., CSD001"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value)}
                                        required
                                    />
                                    {form.errors.code && (
                                        <p className="text-sm text-destructive">{form.errors.code}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={cancelForm}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={form.processing} 
                                    style={{ backgroundColor: '#799EFF', color: 'white' }}
                                    className="hover:opacity-90"
                                >
                                    {form.processing 
                                        ? (editingDistrict ? 'Updating...' : 'Creating...') 
                                        : (editingDistrict ? 'Update District' : 'Create District')
                                    }
                                </Button>
                            </div>
                        </form>
                    </ModalContent>
                </Modal>

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteConfirm}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Delete District"
                    description={`Are you sure you want to delete "${districtToDelete?.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                />

                {/* Districts Table */}
                <Card>
                    <CardContent className="p-0">
                        {districts.data?.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('name')}
                                                sortDirection={filters.sort === 'name' ? filters.direction : null}
                                            >
                                                District Name
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('code')}
                                                sortDirection={filters.sort === 'code' ? filters.direction : null}
                                            >
                                                Code
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('created_at')}
                                                sortDirection={filters.sort === 'created_at' ? filters.direction : null}
                                            >
                                                Created
                                            </TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead className="text-right" style={{ textAlign: 'right' }}>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {districts.data.map((district) => (
                                            <TableRow key={district.id}>
                                                <TableCell className="font-medium">
                                                    {district.name}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                                        {district.code}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(district.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {district.created_by?.name || 'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button 
                                                            onClick={() => editDistrict(district)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => deleteDistrict(district)}
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
                                        from={districts.from}
                                        to={districts.to}
                                        total={districts.total}
                                    />
                                    <Pagination links={districts.links} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {search ? 'No districts found matching your search.' : 'No districts found. Create your first district to get started.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}