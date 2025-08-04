import { useState, useEffect } from 'react'
import { useForm, usePage, router, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { ConfirmationModal } from '../../components/ui/confirmation-modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Pagination, PaginationInfo } from '../../components/ui/pagination'
import DashboardLayout from '../../components/DashboardLayout'

export default function Students({ students, filters }) {
    const { flash, errors } = usePage().props
    const [showDisableConfirm, setShowDisableConfirm] = useState(false)
    const [showEnableConfirm, setShowEnableConfirm] = useState(false)
    const [studentToToggle, setStudentToToggle] = useState(null)
    const [search, setSearch] = useState(filters.search || '')

    // Search functionality
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get('/students', { search }, {
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
        router.get('/students', { 
            ...router.page.props.filters, 
            sort: field, 
            direction 
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const disableStudent = (student) => {
        setStudentToToggle(student)
        setShowDisableConfirm(true)
    }

    const enableStudent = (student) => {
        setStudentToToggle(student)
        setShowEnableConfirm(true)
    }

    const confirmDisable = () => {
        if (studentToToggle) {
            router.patch(`/students/${studentToToggle.id}/disable`)
        }
        setShowDisableConfirm(false)
        setStudentToToggle(null)
    }

    const confirmEnable = () => {
        if (studentToToggle) {
            router.patch(`/students/${studentToToggle.id}/enable`)
        }
        setShowEnableConfirm(false)
        setStudentToToggle(null)
    }

    const cancelToggle = () => {
        setShowDisableConfirm(false)
        setShowEnableConfirm(false)
        setStudentToToggle(null)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
    }

    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        
        return age
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Students</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage student information, addresses, emergency contacts, and special needs
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/students/create">
                            <Button 
                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                className="hover:opacity-90"
                            >
                                Add Student
                            </Button>
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search students..."
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
                    title="Disable Student"
                    description={`Are you sure you want to disable "${studentToToggle?.first_name} ${studentToToggle?.last_name}"? The student will be marked as inactive.`}
                    confirmText="Disable"
                    cancelText="Cancel"
                    variant="destructive"
                />

                {/* Enable Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showEnableConfirm}
                    onClose={cancelToggle}
                    onConfirm={confirmEnable}
                    title="Enable Student"
                    description={`Are you sure you want to enable "${studentToToggle?.first_name} ${studentToToggle?.last_name}"? The student will be marked as active.`}
                    confirmText="Enable"
                    cancelText="Cancel"
                    variant="default"
                />

                {/* Students Table */}
                <Card>
                    <CardContent className="p-0">
                        {students.data?.length > 0 ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('student_code')}
                                                sortDirection={filters.sort === 'student_code' ? filters.direction : null}
                                            >
                                                Student Code
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('last_name')}
                                                sortDirection={filters.sort === 'last_name' ? filters.direction : null}
                                            >
                                                Name
                                            </TableHead>
                                            <TableHead 
                                                sortable
                                                onSort={() => handleSort('birthday')}
                                                sortDirection={filters.sort === 'birthday' ? filters.direction : null}
                                            >
                                                Age
                                            </TableHead>
                                            <TableHead>School</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Special Needs</TableHead>
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
                                        {students.data.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                                        {student.student_code}
                                                    </code>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        {student.first_name} {student.middle_name ? `${student.middle_name} ` : ''}{student.last_name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Born: {formatDate(student.birthday)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {calculateAge(student.birthday)} years
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {student.school?.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {student.boces && <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs mr-1">BOCES</span>}
                                                        {student.displaced && <span className="bg-orange-100 text-orange-800 px-1 py-0.5 rounded text-xs">Displaced</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {student.primary_contact_number}
                                                    </div>
                                                    {student.secondary_contact_number && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {student.secondary_contact_number}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {student.special_needs?.length || 0} need{student.special_needs?.length !== 1 ? 's' : ''}
                                                    </div>
                                                    {student.special_needs?.length > 0 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {student.special_needs.slice(0, 2).map(need => need.spn_name).join(', ')}
                                                            {student.special_needs.length > 2 && '...'}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        student.is_active 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {student.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={`/students/${student.id}/edit`}>
                                                            <Button 
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        {student.is_active ? (
                                                            <Button 
                                                                onClick={() => disableStudent(student)}
                                                                size="sm"
                                                                style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                                className="hover:opacity-90"
                                                            >
                                                                Disable
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => enableStudent(student)}
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
                                        from={students.from}
                                        to={students.to}
                                        total={students.total}
                                    />
                                    <Pagination links={students.links} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    {search ? 'No students found matching your search.' : 'No students found. Create your first student to get started.'}
                                </p>
                                <Link href="/students/create" className="mt-4 inline-block">
                                    <Button 
                                        style={{ backgroundColor: '#799EFF', color: 'white' }}
                                        className="hover:opacity-90"
                                    >
                                        Add Student
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