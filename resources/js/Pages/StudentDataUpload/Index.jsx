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

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'waiting for upload':
                return {
                    backgroundColor: '#6B7280',
                    color: 'white',
                    text: 'Waiting for Upload'
                }
            case 'uploaded':
                return {
                    backgroundColor: '#799EFF',
                    color: 'white',
                    text: 'Processed'
                }
            case 'processing':
                return {
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    text: 'Processing'
                }
            case 'completed':
                return {
                    backgroundColor: '#10B981',
                    color: 'white',
                    text: 'Completed'
                }
            case 'failed':
                return {
                    backgroundColor: '#DC3C22',
                    color: 'white',
                    text: 'Failed'
                }
            default:
                return {
                    backgroundColor: '#6B7280',
                    color: 'white',
                    text: status || 'Unknown'
                }
        }
    }

    const style = getStatusStyle(status)
    
    return (
        <span 
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ 
                backgroundColor: style.backgroundColor, 
                color: style.color 
            }}
        >
            {style.text}
        </span>
    )
}

export default function StudentDataUploadIndex({ uploadBatches, filters }) {
    const { flash, errors } = usePage().props
    const [showForm, setShowForm] = useState(false)
    const [editingBatch, setEditingBatch] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [batchToDelete, setBatchToDelete] = useState(null)
    const [search, setSearch] = useState(filters.search || '')

    const form = useForm({
        name: '',
    })

    // Search functionality
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/upload-batches', { search }, {
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
        router.get('/upload-batches', { 
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
        
        if (editingBatch) {
            form.put(`/upload-batches/${editingBatch.id}`, {
                onSuccess: () => {
                    form.reset()
                    setShowForm(false)
                    setEditingBatch(null)
                }
            })
        } else {
            form.post('/upload-batches', {
                onSuccess: () => {
                    form.reset()
                    setShowForm(false)
                }
            })
        }
    }

    const editBatch = (batch) => {
        setEditingBatch(batch)
        form.setData({
            name: batch.name,
        })
        setShowForm(true)
    }

    const deleteBatch = (batch) => {
        setBatchToDelete(batch)
        setShowDeleteConfirm(true)
    }

    const confirmDelete = () => {
        if (batchToDelete) {
            router.delete(`/upload-batches/${batchToDelete.id}`)
        }
        setShowDeleteConfirm(false)
        setBatchToDelete(null)
    }

    const cancelDelete = () => {
        setShowDeleteConfirm(false)
        setBatchToDelete(null)
    }

    const cancelForm = () => {
        form.reset()
        setShowForm(false)
        setEditingBatch(null)
    }

    const viewBatch = (batch) => {
        router.visit(`/upload-batches/${batch.id}`)
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Student Data Upload</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage student route data upload batches
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
                            Create Upload Batch
                        </Button>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search upload batches..."
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
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                        {flash.error}
                    </div>
                )}

                {/* Upload Batch Form Modal */}
                <Modal isOpen={showForm} onClose={cancelForm} className="max-w-md">
                    <ModalHeader>
                        <div>
                            <ModalTitle>
                                {editingBatch ? 'Edit Upload Batch' : 'Create New Upload Batch'}
                            </ModalTitle>
                            <ModalDescription>
                                {editingBatch 
                                    ? 'Update the upload batch name' 
                                    : 'Create a new batch for uploading student route files'
                                }
                            </ModalDescription>
                        </div>
                        <ModalClose onClose={cancelForm} />
                    </ModalHeader>
                    
                    <ModalContent>
                        <form onSubmit={submitForm} className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="batch_name">Batch Name</Label>
                                    <Input
                                        id="batch_name"
                                        type="text"
                                        placeholder="e.g., Fall 2024 Student Routes"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        required
                                    />
                                    {form.errors.name && (
                                        <p className="text-sm text-destructive">{form.errors.name}</p>
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
                                        ? (editingBatch ? 'Updating...' : 'Creating...') 
                                        : (editingBatch ? 'Update Batch' : 'Create Batch')
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
                    title="Delete Upload Batch"
                    description={`Are you sure you want to delete "${batchToDelete?.name}"? This action cannot be undone and will delete all uploaded files in this batch.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                />

                {/* Upload Batches Table */}
                <Card>
                    <CardContent className="p-0">
                        {uploadBatches.data?.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('name')}
                                                sortDirection={filters.sort === 'name' ? filters.direction : null}
                                            >
                                                Batch Name
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('status')}
                                                sortDirection={filters.sort === 'status' ? filters.direction : null}
                                            >
                                                Status
                                            </TableHead>
                                            <TableHead>Files Count</TableHead>
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
                                        {uploadBatches.data.map((batch) => (
                                            <TableRow key={batch.id}>
                                                <TableCell className="font-medium">
                                                    {batch.name}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={batch.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm bg-muted px-2 py-1 rounded">
                                                        {batch.uploaded_files_count} files
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(batch.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {batch.creator?.name || 'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button 
                                                            onClick={() => viewBatch(batch)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Manage
                                                        </Button>
                                                        <Button 
                                                            onClick={() => editBatch(batch)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => deleteBatch(batch)}
                                                            size="sm"
                                                            disabled={batch.uploaded_files_count > 0}
                                                            style={{ 
                                                                backgroundColor: batch.uploaded_files_count > 0 ? '#ccc' : '#DC3C22', 
                                                                color: 'white' 
                                                            }}
                                                            className="hover:opacity-90"
                                                            title={batch.uploaded_files_count > 0 ? 'Cannot delete batch with files' : 'Delete batch'}
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
                                        from={uploadBatches.from}
                                        to={uploadBatches.to}
                                        total={uploadBatches.total}
                                    />
                                    <Pagination links={uploadBatches.links} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {search ? 'No upload batches found matching your search.' : 'No upload batches found. Create your first batch to get started.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}