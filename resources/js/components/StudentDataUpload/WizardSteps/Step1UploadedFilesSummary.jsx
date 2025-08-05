import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table'
import { Progress } from '../../../components/ui/progress'
import { Pagination, PaginationInfo } from '../../../components/ui/pagination'
import { FileText, Database } from 'lucide-react'
import { getStatusIcon, formatFileSize } from '../../../utils/fileUtils.jsx'

const Step1UploadedFilesSummary = ({ uploadBatch, filters, onSearch, studentValidations, onStudentsSearch }) => {
    return (
        <div className="space-y-8">
            {/* Uploaded Files Summary Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Uploaded Files Summary</span>
                        </CardTitle>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search files..."
                                defaultValue={filters.files_search || ''}
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
                    {uploadBatch.uploaded_files && uploadBatch.uploaded_files.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Records</TableHead>
                                    <TableHead>Uploaded By</TableHead>
                                    <TableHead>Upload Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {uploadBatch.uploaded_files.map((file) => (
                                    <TableRow key={file.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(file.status)}
                                                <span className="text-sm capitalize">{file.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {file.original_filename}
                                        </TableCell>
                                        <TableCell>
                                            {formatFileSize(file.file_size)}
                                        </TableCell>
                                        <TableCell>
                                            {file.status === 'completed' ? (
                                                <span className="text-sm">
                                                    {file.processed_records} / {file.total_records}
                                                </span>
                                            ) : file.status === 'processing' ? (
                                                <div className="space-y-1">
                                                    <div className="text-sm">
                                                        {file.processed_records} / {file.total_records}
                                                    </div>
                                                    <Progress 
                                                        value={(file.processed_records / file.total_records) * 100} 
                                                        className="w-20 h-2"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {file.uploader?.name || 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(file.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {filters.files_search ? 'No files found matching your search.' : 'No uploaded files found for this batch.'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Raw Data Card */}
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
                                onChange={(e) => onStudentsSearch(e.target.value)}
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
        </div>
    )
}

export default Step1UploadedFilesSummary