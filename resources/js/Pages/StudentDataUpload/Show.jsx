import { useState } from 'react'
import { usePage, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import DashboardLayout from '../../components/DashboardLayout'
import { ArrowLeft } from 'lucide-react'
import { useSearch } from '../../hooks/useSearch'
import WizardNavigation from '../../components/StudentDataUpload/WizardNavigation'
import Step1UploadedFilesSummary from '../../components/StudentDataUpload/WizardSteps/Step1UploadedFilesSummary'
import Step2RawData from '../../components/StudentDataUpload/WizardSteps/Step2RawData'
import Step3StudentsInformation from '../../components/StudentDataUpload/WizardSteps/Step3StudentsInformation'
import Step4Schools from '../../components/StudentDataUpload/WizardSteps/Step4Schools'
import Step5RoutesRuns from '../../components/StudentDataUpload/WizardSteps/Step5RoutesRuns'
import FileUploadSection from '../../components/StudentDataUpload/FileUploadSection'
import UploadedFilesTable from '../../components/StudentDataUpload/UploadedFilesTable'

export default function StudentDataUploadShow({ uploadBatch, studentValidations, studentInformation, schoolValidations, filters = {} }) {
    const { flash } = usePage().props
    const [currentStep, setCurrentStep] = useState(1)
    
    const filesSearch = useSearch('files', uploadBatch.id, filters, filters.students_search)
    const studentsSearch = useSearch('students', uploadBatch.id, filters, filters.files_search)
    const studentInfoSearch = useSearch('student_info', uploadBatch.id, filters, filters.student_info_search)
    const schoolValidationSearch = useSearch('school_validation', uploadBatch.id, filters, filters.school_validation_search)

    const handleUploadComplete = () => {
        router.reload({ only: ['uploadBatch'] })
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1UploadedFilesSummary 
                        uploadBatch={uploadBatch}
                        filters={filters}
                        onSearch={filesSearch.handleSearch}
                    />
                )
            case 2:
                return (
                    <Step2RawData 
                        studentValidations={studentValidations}
                        filters={filters}
                        onSearch={studentsSearch.handleSearch}
                    />
                )
            case 3:
                return (
                    <Step3StudentsInformation 
                        studentInformation={studentInformation}
                        filters={filters}
                        onSearch={studentInfoSearch.handleSearch}
                    />
                )
            case 4:
                return (
                    <Step4Schools 
                        schoolValidations={schoolValidations}
                        filters={filters}
                        onSearch={schoolValidationSearch.handleSearch}
                    />
                )
            case 5:
                return <Step5RoutesRuns />
            default:
                return (
                    <Step1UploadedFilesSummary 
                        uploadBatch={uploadBatch}
                        filters={filters}
                        onSearch={filesSearch.handleSearch}
                    />
                )
        }
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

                {/* Conditional Content: Upload Form or Wizard */}
                {uploadBatch.status === 'processing' || uploadBatch.status === 'uploaded' ? (
                    /* Wizard for Processing and Processed states */
                    <div className="space-y-8">
                        <WizardNavigation 
                            currentStep={currentStep}
                            onStepChange={setCurrentStep}
                            uploadBatchStatus={uploadBatch.status}
                        />
                        {renderCurrentStep()}
                    </div>
                ) : (
                    /* File Upload Section */
                    <FileUploadSection 
                        uploadBatch={uploadBatch}
                        onUploadComplete={handleUploadComplete}
                    />
                )}

                {/* Uploaded Files Table */}
                {uploadBatch.uploaded_files && uploadBatch.uploaded_files.length > 0 && uploadBatch.status !== 'processing' && uploadBatch.status !== 'uploaded' && (
                    <UploadedFilesTable uploadBatch={uploadBatch} />
                )}
            </div>
        </DashboardLayout>
    )
}