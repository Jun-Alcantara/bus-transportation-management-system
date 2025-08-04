import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Route } from 'lucide-react'

const Step5RoutesRuns = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>Routes & Runs</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <Route className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                        Routes and runs management will be available once processing is complete.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default Step5RoutesRuns