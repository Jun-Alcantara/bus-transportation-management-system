import { useState } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalClose } from '../../components/ui/modal'
import { ConfirmationModal } from '../../components/ui/confirmation-modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import DashboardLayout from '../../components/DashboardLayout'

export default function YearAndTerms({ schoolYears }) {
    const { flash, errors } = usePage().props
    const [showYearForm, setShowYearForm] = useState(false)
    const [showTermForm, setShowTermForm] = useState(false)
    const [editingYear, setEditingYear] = useState(null)
    const [editingTerm, setEditingTerm] = useState(null)
    const [showDeleteYearConfirm, setShowDeleteYearConfirm] = useState(false)
    const [showDeleteTermConfirm, setShowDeleteTermConfirm] = useState(false)
    const [showSetActiveYearConfirm, setShowSetActiveYearConfirm] = useState(false)
    const [showSetActiveTermConfirm, setShowSetActiveTermConfirm] = useState(false)
    const [yearToDelete, setYearToDelete] = useState(null)
    const [termToDelete, setTermToDelete] = useState(null)
    const [yearToSetActive, setYearToSetActive] = useState(null)
    const [termToSetActive, setTermToSetActive] = useState(null)
    const [selectedYear, setSelectedYear] = useState(null)
    const [expandedYears, setExpandedYears] = useState(new Set())

    // School Year Form
    const yearForm = useForm({
        name: '',
        start_date: '',
        end_date: '',
        description: ''
    })

    // School Term Form
    const termForm = useForm({
        school_year_id: '',
        name: '',
        start_date: '',
        end_date: '',
        description: ''
    })

    const submitYearForm = (e) => {
        e.preventDefault()
        
        if (editingYear) {
            yearForm.put(`/settings/school-years/${editingYear.id}`, {
                onSuccess: () => {
                    yearForm.reset()
                    setShowYearForm(false)
                    setEditingYear(null)
                }
            })
        } else {
            yearForm.post('/settings/school-years', {
                onSuccess: () => {
                    yearForm.reset()
                    setShowYearForm(false)
                }
            })
        }
    }

    const submitTermForm = (e) => {
        e.preventDefault()
        
        if (editingTerm) {
            termForm.put(`/settings/school-terms/${editingTerm.id}`, {
                onSuccess: () => {
                    termForm.reset()
                    setShowTermForm(false)
                    setEditingTerm(null)
                    setSelectedYear(null)
                }
            })
        } else {
            termForm.post('/settings/school-terms', {
                onSuccess: () => {
                    termForm.reset()
                    setShowTermForm(false)
                    setSelectedYear(null)
                }
            })
        }
    }

    const editYear = (year) => {
        setEditingYear(year)
        yearForm.setData({
            name: year.name,
            start_date: year.start_date,
            end_date: year.end_date,
            description: year.description || ''
        })
        setShowYearForm(true)
    }

    const editTerm = (term) => {
        setEditingTerm(term)
        setSelectedYear(schoolYears.find(y => y.id === term.school_year_id))
        termForm.setData({
            school_year_id: term.school_year_id,
            name: term.name,
            start_date: term.start_date,
            end_date: term.end_date,
            description: term.description || ''
        })
        setShowTermForm(true)
    }

    const deleteYear = (year) => {
        setYearToDelete(year)
        setShowDeleteYearConfirm(true)
    }

    const deleteTerm = (term) => {
        setTermToDelete(term)
        setShowDeleteTermConfirm(true)
    }

    const confirmDeleteYear = () => {
        if (yearToDelete) {
            router.delete(`/settings/school-years/${yearToDelete.id}`)
        }
        setShowDeleteYearConfirm(false)
        setYearToDelete(null)
    }

    const confirmDeleteTerm = () => {
        if (termToDelete) {
            router.delete(`/settings/school-terms/${termToDelete.id}`)
        }
        setShowDeleteTermConfirm(false)
        setTermToDelete(null)
    }

    const setActiveYear = (year) => {
        setYearToSetActive(year)
        setShowSetActiveYearConfirm(true)
    }

    const setActiveTerm = (term) => {
        setTermToSetActive(term)
        setShowSetActiveTermConfirm(true)
    }

    const confirmSetActiveYear = () => {
        if (yearToSetActive) {
            router.patch(`/settings/school-years/${yearToSetActive.id}/set-active`)
        }
        setShowSetActiveYearConfirm(false)
        setYearToSetActive(null)
    }

    const confirmSetActiveTerm = () => {
        if (termToSetActive) {
            router.patch(`/settings/school-terms/${termToSetActive.id}/set-active`)
        }
        setShowSetActiveTermConfirm(false)
        setTermToSetActive(null)
    }

    const addTermToYear = (year) => {
        setSelectedYear(year)
        termForm.setData('school_year_id', year.id)
        setShowTermForm(true)
    }

    const cancelYearForm = () => {
        yearForm.reset()
        setShowYearForm(false)
        setEditingYear(null)
    }

    const cancelTermForm = () => {
        termForm.reset()
        setShowTermForm(false)
        setEditingTerm(null)
        setSelectedYear(null)
    }

    const toggleExpandYear = (yearId) => {
        const newExpanded = new Set(expandedYears)
        if (newExpanded.has(yearId)) {
            newExpanded.delete(yearId)
        } else {
            newExpanded.add(yearId)
        }
        setExpandedYears(newExpanded)
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">School Years & Terms</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage academic years and their terms for the bus service system
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button 
                            onClick={() => setShowYearForm(true)}
                            style={{ backgroundColor: '#799EFF', color: 'white' }}
                            className="hover:opacity-90"
                        >
                            Add School Year
                        </Button>
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

                {/* School Year Form Modal */}
                <Modal isOpen={showYearForm} onClose={cancelYearForm} className="max-w-2xl">
                    <ModalHeader>
                        <div>
                            <ModalTitle>
                                {editingYear ? 'Edit School Year' : 'Add New School Year'}
                            </ModalTitle>
                            <ModalDescription>
                                {editingYear 
                                    ? 'Update the academic year information' 
                                    : 'Create a new academic year for the school bus service'
                                }
                            </ModalDescription>
                        </div>
                        <ModalClose onClose={cancelYearForm} />
                    </ModalHeader>
                    
                    <ModalContent>
                        <form onSubmit={submitYearForm} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="year_name">Year Name *</Label>
                                    <Input
                                        id="year_name"
                                        type="text"
                                        placeholder="e.g., 2024-2025"
                                        value={yearForm.data.name}
                                        onChange={(e) => yearForm.setData('name', e.target.value)}
                                        className={yearForm.errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {yearForm.errors.name && (
                                        <p className="text-sm text-red-600">{yearForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year_description">Description</Label>
                                    <Input
                                        id="year_description"
                                        type="text"
                                        placeholder="Optional description"
                                        value={yearForm.data.description}
                                        onChange={(e) => yearForm.setData('description', e.target.value)}
                                        className={yearForm.errors.description ? 'border-red-500' : ''}
                                    />
                                    {yearForm.errors.description && (
                                        <p className="text-sm text-red-600">{yearForm.errors.description}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year_start_date">Start Date *</Label>
                                    <Input
                                        id="year_start_date"
                                        type="date"
                                        value={yearForm.data.start_date}
                                        onChange={(e) => yearForm.setData('start_date', e.target.value)}
                                        className={yearForm.errors.start_date ? 'border-red-500' : ''}
                                        required
                                    />
                                    {yearForm.errors.start_date && (
                                        <p className="text-sm text-red-600">{yearForm.errors.start_date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year_end_date">End Date *</Label>
                                    <Input
                                        id="year_end_date"
                                        type="date"
                                        value={yearForm.data.end_date}
                                        onChange={(e) => yearForm.setData('end_date', e.target.value)}
                                        className={yearForm.errors.end_date ? 'border-red-500' : ''}
                                        required
                                    />
                                    {yearForm.errors.end_date && (
                                        <p className="text-sm text-red-600">{yearForm.errors.end_date}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={cancelYearForm}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={yearForm.processing}
                                    style={{ backgroundColor: '#799EFF', color: 'white' }}
                                    className="hover:opacity-90"
                                >
                                    {yearForm.processing 
                                        ? (editingYear ? 'Updating...' : 'Creating...') 
                                        : (editingYear ? 'Update Year' : 'Create Year')
                                    }
                                </Button>
                            </div>
                        </form>
                    </ModalContent>
                </Modal>

                {/* School Term Form Modal */}
                <Modal isOpen={showTermForm} onClose={cancelTermForm} className="max-w-2xl">
                    <ModalHeader>
                        <div>
                            <ModalTitle>
                                {editingTerm ? 'Edit School Term' : 'Add New School Term'}
                            </ModalTitle>
                            <ModalDescription>
                                {editingTerm 
                                    ? 'Update the term information' 
                                    : `Create a new term for ${selectedYear?.name || 'the selected school year'}`
                                }
                            </ModalDescription>
                        </div>
                        <ModalClose onClose={cancelTermForm} />
                    </ModalHeader>
                    
                    <ModalContent>
                        <form onSubmit={submitTermForm} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="term_name">Term Name *</Label>
                                    <Input
                                        id="term_name"
                                        type="text"
                                        placeholder="e.g., Term 1, Fall Semester"
                                        value={termForm.data.name}
                                        onChange={(e) => termForm.setData('name', e.target.value)}
                                        className={termForm.errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {termForm.errors.name && (
                                        <p className="text-sm text-red-600">{termForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="term_description">Description</Label>
                                    <Input
                                        id="term_description"
                                        type="text"
                                        placeholder="Optional description"
                                        value={termForm.data.description}
                                        onChange={(e) => termForm.setData('description', e.target.value)}
                                        className={termForm.errors.description ? 'border-red-500' : ''}
                                    />
                                    {termForm.errors.description && (
                                        <p className="text-sm text-red-600">{termForm.errors.description}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="term_start_date">Start Date *</Label>
                                    <Input
                                        id="term_start_date"
                                        type="date"
                                        value={termForm.data.start_date}
                                        onChange={(e) => termForm.setData('start_date', e.target.value)}
                                        className={termForm.errors.start_date ? 'border-red-500' : ''}
                                        required
                                    />
                                    {termForm.errors.start_date && (
                                        <p className="text-sm text-red-600">{termForm.errors.start_date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="term_end_date">End Date *</Label>
                                    <Input
                                        id="term_end_date"
                                        type="date"
                                        value={termForm.data.end_date}
                                        onChange={(e) => termForm.setData('end_date', e.target.value)}
                                        className={termForm.errors.end_date ? 'border-red-500' : ''}
                                        required
                                    />
                                    {termForm.errors.end_date && (
                                        <p className="text-sm text-red-600">{termForm.errors.end_date}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={cancelTermForm}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={termForm.processing}
                                    style={{ backgroundColor: '#799EFF', color: 'white' }}
                                    className="hover:opacity-90"
                                >
                                    {termForm.processing 
                                        ? (editingTerm ? 'Updating...' : 'Creating...') 
                                        : (editingTerm ? 'Update Term' : 'Create Term')
                                    }
                                </Button>
                            </div>
                        </form>
                    </ModalContent>
                </Modal>

                {/* Confirmation Modals */}
                <ConfirmationModal
                    isOpen={showDeleteYearConfirm}
                    onClose={() => setShowDeleteYearConfirm(false)}
                    onConfirm={confirmDeleteYear}
                    title="Delete School Year"
                    description={`Are you sure you want to delete "${yearToDelete?.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                />

                <ConfirmationModal
                    isOpen={showDeleteTermConfirm}
                    onClose={() => setShowDeleteTermConfirm(false)}
                    onConfirm={confirmDeleteTerm}
                    title="Delete School Term"
                    description={`Are you sure you want to delete "${termToDelete?.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="destructive"
                />

                <ConfirmationModal
                    isOpen={showSetActiveYearConfirm}
                    onClose={() => setShowSetActiveYearConfirm(false)}
                    onConfirm={confirmSetActiveYear}
                    title="Set Active School Year"
                    description={`Are you sure you want to set "${yearToSetActive?.name}" as the active school year? This will deactivate the current active year.`}
                    confirmText="Set Active"
                    cancelText="Cancel"
                    variant="default"
                />

                <ConfirmationModal
                    isOpen={showSetActiveTermConfirm}
                    onClose={() => setShowSetActiveTermConfirm(false)}
                    onConfirm={confirmSetActiveTerm}
                    title="Set Active School Term"
                    description={`Are you sure you want to set "${termToSetActive?.name}" as the active school term? This will deactivate the current active term.`}
                    confirmText="Set Active"
                    cancelText="Cancel"
                    variant="default"
                />

                {/* School Years Table */}
                <Card>
                    <CardContent className="p-0">
                        {schoolYears?.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>School Year</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Terms</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right" style={{ textAlign: 'right' }}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schoolYears.map((year) => (
                                        <>
                                            <TableRow key={year.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => toggleExpandYear(year.id)}
                                                            className="flex items-center space-x-1"
                                                        >
                                                            {year.terms?.length > 0 && (
                                                                <svg
                                                                    className={`w-4 h-4 transition-transform ${
                                                                        expandedYears.has(year.id) ? 'rotate-90' : ''
                                                                    }`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            )}
                                                            <span>{year.name}</span>
                                                        </button>
                                                    </div>
                                                    {year.description && (
                                                        <p className="text-sm text-muted-foreground">{year.description}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {year.terms?.length || 0} term{year.terms?.length !== 1 ? 's' : ''}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        year.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {year.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button 
                                                            onClick={() => editYear(year)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => addTermToYear(year)}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Add Term
                                                        </Button>
                                                        {!year.is_active && (
                                                            <Button 
                                                                onClick={() => setActiveYear(year)}
                                                                size="sm"
                                                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                                                className="hover:opacity-90"
                                                            >
                                                                Set Active
                                                            </Button>
                                                        )}
                                                        {!year.is_active && (
                                                            <Button 
                                                                onClick={() => deleteYear(year)}
                                                                size="sm"
                                                                style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                                className="hover:opacity-90"
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {/* Terms sub-rows */}
                                            {expandedYears.has(year.id) && year.terms?.map((term) => (
                                                <TableRow key={`term-${term.id}`} className="bg-muted/30">
                                                    <TableCell className="pl-8">
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l10 10M7 17L17 7" />
                                                            </svg>
                                                            <span className="font-medium">{term.name}</span>
                                                        </div>
                                                        {term.description && (
                                                            <p className="text-sm text-muted-foreground pl-6">{term.description}</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {new Date(term.start_date).toLocaleDateString()} - {new Date(term.end_date).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>-</TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            term.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {term.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button 
                                                                onClick={() => editTerm(term)}
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                            {!term.is_active && (
                                                                <Button 
                                                                    onClick={() => setActiveTerm(term)}
                                                                    size="sm"
                                                                    style={{ backgroundColor: '#799EFF', color: 'white' }}
                                                                    className="hover:opacity-90"
                                                                >
                                                                    Set Active
                                                                </Button>
                                                            )}
                                                            <Button 
                                                                onClick={() => deleteTerm(term)}
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
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No school years found. Create your first school year to get started.</p>
                                <Button 
                                    onClick={() => setShowYearForm(true)}
                                    className="mt-4"
                                    style={{ backgroundColor: '#799EFF', color: 'white' }}
                                >
                                    Add School Year
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}