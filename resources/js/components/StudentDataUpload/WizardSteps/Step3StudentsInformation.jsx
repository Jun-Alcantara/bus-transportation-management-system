import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Users } from 'lucide-react'

const Step3StudentsInformation = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Student's Information</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                        Student information management will be available once processing is complete.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Step3StudentsInformation