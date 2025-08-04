import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { School } from 'lucide-react'

const Step4Schools = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <School className="h-5 w-5" />
                    <span>Schools</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                        Schools information will be displayed here.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Step4Schools