import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table'
import { Pagination, PaginationInfo } from '../../../components/ui/pagination'
import { Database } from 'lucide-react'

const Step2RawData = ({ studentValidations, filters, onSearch }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Raw Data</span>
                    </CardTitle>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search students..."
                            defaultValue={filters.students_search || ''}
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
                {studentValidations && studentValidations.data?.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Auto ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>School Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>District</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentValidations.data.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            {student.stu_autoid}
                                        </TableCell>
                                        <TableCell>
                                            {student.stu_firstname} {student.stu_lastname}
                                        </TableCell>
                                        <TableCell>
                                            {student.sch_name}
                                        </TableCell>
                                        <TableCell>
                                            {student.loc_loc}
                                        </TableCell>
                                        <TableCell>
                                            {student.ugeocode__}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        <div className="flex items-center justify-between p-4 border-t">
                            <PaginationInfo
                                from={studentValidations.from}
                                to={studentValidations.to}
                                total={studentValidations.total}
                            />
                            <Pagination links={studentValidations.links} />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {filters.students_search ? 'No students found matching your search.' : 'No student route data found for this batch.'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Step2RawData