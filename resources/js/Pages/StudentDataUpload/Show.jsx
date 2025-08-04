import { useState, useCallback, useRef } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { Progress } from '../../components/ui/progress'
import { Pagination, PaginationInfo } from '../../components/ui/pagination'
import DashboardLayout from '../../components/DashboardLayout'
import { ArrowLeft, Upload, File, Check, X, Clock, AlertCircle, Trash2 } from 'lucide-react'

export default function StudentDataUploadShow({ uploadBatch, studentValidations }) {
    const { flash } = usePage().props
    const [isDragActive, setIsDragActive] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const form = useForm({
        files: [],
    })

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true)
        } else if (e.type === 'dragleave') {
            setIsDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)

        const files = Array.from(e.dataTransfer.files)
        const excelFiles = files.filter(file => 
            file.type === 'application/vnd.ms-excel' || 
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        if (excelFiles.length > 0) {
            // Add new files to existing files instead of replacing them
            const existingFiles = form.data.files || []
            const combinedFiles = [...existingFiles, ...excelFiles]
            form.setData('files', combinedFiles)
        }
    }, [form])

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        // Add new files to existing files instead of replacing them
        const existingFiles = form.data.files || []
        const combinedFiles = [...existingFiles, ...files]
        form.setData('files', combinedFiles)
    }

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        form.setData('files', [])
    }

    const handleDragAreaClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const removeFile = (indexToRemove) => {
        const updatedFiles = form.data.files.filter((_, index) => index !== indexToRemove)
        form.setData('files', updatedFiles)
    }

    const uploadFiles = async () => {
        if (form.data.files.length === 0) return

        setIsUploading(true)
        const formData = new FormData()
        
        form.data.files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
        })

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            if (!csrfToken) {
                console.error('CSRF token not found')
                return
            }
            
            const response = await fetch(`/upload-batches/${uploadBatch.id}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            })

            if (response.ok) {
                resetFileInput()
                router.reload({ only: ['uploadBatch'] })
            } else {
                console.error('Upload failed')
            }
        } catch (error) {
            console.error('Upload error:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <Check className="h-4 w-4 text-green-500" />
            case 'failed':
                return <X className="h-4 w-4 text-red-500" />
            case 'processing':
                return <Clock className="h-4 w-4 text-blue-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-500" />
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="outline" 
                        onClick={() => router.visit('/upload-batches')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Upload Batches</span>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold">{uploadBatch.name}</h2>
                        <p className="text-muted-foreground mt-2">
                            Upload and manage student route files for this batch
                        </p>
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

                {/* Conditional Content: Upload Form or Student Data */}
                {uploadBatch.status === 'uploaded' ? (
                    /* Student Validation Data Section */
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>Student Route Data</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {studentValidations && studentValidations.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>School</TableHead>
                                                <TableHead>Route</TableHead>
                                                <TableHead>Stop</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Address</TableHead>
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
                                                        {student.rte_desc} ({student.rte_id})
                                                    </TableCell>
                                                    <TableCell>
                                                        {student.loc_loc}
                                                    </TableCell>
                                                    <TableCell>
                                                        {student.stu_zgrades_descriptor}
                                                    </TableCell>
                                                    <TableCell>
                                                        {student.stu_loc_number} {student.stu_loc_streetname} {student.stu_loc_type}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    
                                    {/* Pagination */}
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
                                        No student route data found for this batch.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    /* File Upload Section */
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Upload className="h-5 w-5" />
                                <span>Upload Student Routes Files</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Drag and Drop Area */}
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                                    isDragActive 
                                        ? 'border-blue-400 bg-blue-50' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={handleDragAreaClick}
                            >
                                <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-lg font-medium mb-2">
                                    Drop your Excel files here, or click to browse
                                </p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Supports .xls and .xlsx files (max 10MB each)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".xls,.xlsx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload">
                                    <Button variant="outline" className="cursor-pointer" type="button">
                                        Browse Files
                                    </Button>
                                </label>
                            </div>

                            {/* Selected Files */}
                            {form.data.files.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-medium">Selected Files:</h4>
                                    <div className="space-y-2">
                                        {form.data.files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <File className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm font-medium">{file.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({formatFileSize(file.size)})
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button 
                                            onClick={uploadFiles}
                                            disabled={isUploading}
                                            style={{ backgroundColor: '#799EFF', color: 'white' }}
                                            className="hover:opacity-90"
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Files'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Uploaded Files Table */}
                {uploadBatch.uploaded_files && uploadBatch.uploaded_files.length > 0 && (
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
                )}
            </div>
        </DashboardLayout>
    )
}