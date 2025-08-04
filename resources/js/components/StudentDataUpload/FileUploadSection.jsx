import { useRef } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Upload, File, Trash2 } from 'lucide-react'
import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { formatFileSize } from '../../utils/fileUtils.jsx'

const FileUploadSection = ({ uploadBatch, onUploadComplete }) => {
    const fileInputRef = useRef(null)
    const form = useForm({
        files: [],
    })

    const handleFilesSelected = (newFiles) => {
        const existingFiles = form.data.files || []
        const combinedFiles = [...existingFiles, ...newFiles]
        form.setData('files', combinedFiles)
    }

    const { isDragActive, handleDrag, handleDrop } = useDragAndDrop(handleFilesSelected)

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        handleFilesSelected(files)
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
                onUploadComplete()
            } else {
                console.error('Upload failed')
            }
        } catch (error) {
            console.error('Upload error:', error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Student Routes Files</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                                disabled={form.processing}
                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                className="hover:opacity-90"
                            >
                                {form.processing ? 'Uploading...' : 'Upload Files'}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default FileUploadSection