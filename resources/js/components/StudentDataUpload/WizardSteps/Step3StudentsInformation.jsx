import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table'
import { Pagination, PaginationInfo } from '../../../components/ui/pagination'
import { Users } from 'lucide-react'

const Step3StudentsInformation = ({ studentInformation, filters, onSearch }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Student's Information</span>
                    </CardTitle>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search by Student ID..."
                            defaultValue={filters.student_info_search || ''}
                            onChange={(e) => onSearch(e.target.value)}
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
            </CardHeader>
            <CardContent className="p-0">
                {studentInformation && studentInformation.data?.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Special Needs</TableHead>
                                    <TableHead>Inconsistencies</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentInformation.data.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            {student.stu_autoid}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                student.is_new_student 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {student.is_new_student ? "New Student" : "Existing"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {student.has_special_needs_changes ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                    Changes Detected
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">No Changes</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {student.has_inconsistent_special_needs ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Inconsistent
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">Consistent</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(student.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        <div className="flex items-center justify-between p-4 border-t">
                            <PaginationInfo
                                from={studentInformation.from}
                                to={studentInformation.to}
                                total={studentInformation.total}
                            />
                            <Pagination links={studentInformation.links} />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-muted-foreground">
                            {filters.student_info_search ? 'No student information found matching your search.' : 'No student information available for this batch.'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Step3StudentsInformation