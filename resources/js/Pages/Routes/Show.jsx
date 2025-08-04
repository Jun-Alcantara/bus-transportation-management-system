import { usePage, Link, router } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import DashboardLayout from '../../components/DashboardLayout'

// Badge Component
const Badge = ({ children, className = '', variant = 'default' }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        outline: 'bg-white border border-gray-300 text-gray-700'
    }
    
    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    )
}

export default function ShowRoute({ route }) {
    const { flash } = usePage().props

    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800'
        }
        return (
            <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
                {status}
            </Badge>
        )
    }

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString() : 'N/A'
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">{route.name}</h2>
                        <p className="text-muted-foreground mt-2">
                            Route details and associated runs
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href="/routes">
                            <Button variant="outline">
                                Back to Routes
                            </Button>
                        </Link>
                        <Link href={`/routes/${route.id}/edit`}>
                            <Button 
                                style={{ backgroundColor: '#799EFF', color: 'white' }}
                                className="hover:opacity-90"
                            >
                                Edit Route
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Route Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Route Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Route Name</h4>
                                        <p className="text-lg font-medium">{route.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Route Code</h4>
                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                            {route.code}
                                        </code>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">District</h4>
                                        <p>{route.district?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                                        {getStatusBadge(route.status)}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Date Activated</h4>
                                        <p>{formatDate(route.date_activated)}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Date Deactivated</h4>
                                        <p>{formatDate(route.date_deactivated)}</p>
                                    </div>
                                </div>
                                {route.description && (
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Description</h4>
                                        <p className="text-sm bg-muted p-3 rounded">{route.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Runs Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Route Runs ({route.runs?.length || 0})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {route.runs?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Run Code</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Date Activated</TableHead>
                                                <TableHead>Date Deactivated</TableHead>
                                                <TableHead>Created</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {route.runs.map((run) => (
                                                <TableRow key={run.id}>
                                                    <TableCell className="font-medium">
                                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                                            {run.run_code}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(run.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(run.date_activated)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(run.date_deactivated)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(run.created_at)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No runs found for this route.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Information */}
                    <div className="space-y-6">
                        {/* School Period */}
                        <Card>
                            <CardHeader>
                                <CardTitle>School Period</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">School Year</h4>
                                    <p>{route.school_year?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">School Term</h4>
                                    <p>{route.school_term?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Period Range</h4>
                                    <p className="text-sm">
                                        {route.school_year?.start_date} to {route.school_year?.end_date}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Audit Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Audit Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Created By</h4>
                                    <p>{route.created_by?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Created At</h4>
                                    <p>{formatDate(route.created_at)}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Last Updated By</h4>
                                    <p>{route.updated_by?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
                                    <p>{formatDate(route.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Runs</span>
                                    <span className="font-medium">{route.runs?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Active Runs</span>
                                    <span className="font-medium">
                                        {route.runs?.filter(run => run.status === 'active').length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Inactive Runs</span>
                                    <span className="font-medium">
                                        {route.runs?.filter(run => run.status === 'inactive').length || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}