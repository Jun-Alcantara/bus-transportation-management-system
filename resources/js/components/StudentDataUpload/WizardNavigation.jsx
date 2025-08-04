import { FileText, Database, Users, School, Route, Check } from 'lucide-react'

const WizardNavigation = ({ currentStep, onStepChange, uploadBatchStatus }) => {
    const wizardSteps = [
        { id: 1, title: 'Uploaded Files Summary', icon: FileText, description: 'Review uploaded files status' },
        { id: 2, title: 'Raw Data', icon: Database, description: 'View parsed student data' },
        { id: 3, title: "Student's Information", icon: Users, description: 'Student details management', disabled: uploadBatchStatus !== 'uploaded' },
        { id: 4, title: 'Schools', icon: School, description: 'School information', disabled: uploadBatchStatus !== 'uploaded' },
        { id: 5, title: 'Routes & Runs', icon: Route, description: 'Route management', disabled: uploadBatchStatus !== 'uploaded' }
    ]

    const canGoToStep = (stepId) => {
        const step = wizardSteps.find(s => s.id === stepId)
        return !step.disabled
    }

    const goToStep = (stepId) => {
        if (canGoToStep(stepId)) {
            onStepChange(stepId)
        }
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {wizardSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep === step.id
                    const isCompleted = currentStep > step.id && !step.disabled
                    const isDisabled = step.disabled
                    
                    return (
                        <div key={step.id} className="flex items-center">
                            <div 
                                className={`
                                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer
                                    ${isActive 
                                        ? 'bg-blue-500 border-blue-500 text-white' 
                                        : isCompleted 
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : isDisabled
                                                ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                                    }
                                `}
                                onClick={() => !isDisabled && goToStep(step.id)}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Icon className="h-5 w-5" />
                                )}
                            </div>
                            
                            <div className="ml-3 mr-8">
                                <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {step.title}
                                </div>
                                <div className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {step.description}
                                </div>
                            </div>
                            
                            {index < wizardSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'} mr-8`} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WizardNavigation