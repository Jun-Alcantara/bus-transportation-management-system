import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Progress } from '../../components/ui/progress'
import { getStatusIcon, formatFileSize } from '../../utils/fileUtils.jsx'

const UploadedFilesTable = ({ uploadBatch }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
            </CardContent>
        </Card>
    )
}

export default UploadedFilesTable