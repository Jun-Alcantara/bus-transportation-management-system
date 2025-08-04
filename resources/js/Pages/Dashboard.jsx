import { usePage } from '@inertiajs/react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import DashboardLayout from '../components/DashboardLayout'

export default function Dashboard() {
    const { auth } = usePage().props

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                    {/* Welcome Card */}
                    <Card className="border-0 shadow-lg bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                        <CardHeader className="pb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-3xl font-bold">
                                        Welcome back, {auth?.user?.name || 'User'}!
                                    </CardTitle>
                                    <CardDescription className="text-lg">
                                        You have successfully logged into your dashboard
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-2">Account Status</h3>
                                    <p className="text-sm text-muted-foreground">Active</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                                    <p className="text-sm text-muted-foreground">{auth?.user?.email}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-2">Member Since</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {auth?.user?.created_at ? new Date(auth.user.created_at).toLocaleDateString() : 'Today'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-lg bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                        <CardHeader>
                            <CardTitle className="text-xl">Quick Actions</CardTitle>
                            <CardDescription>
                                Get started with these common tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button className="h-16 text-left justify-start" variant="outline">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">View Profile</p>
                                            <p className="text-sm text-muted-foreground">Manage your account</p>
                                        </div>
                                    </div>
                                </Button>
                                <Button className="h-16 text-left justify-start" variant="outline">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">Settings</p>
                                            <p className="text-sm text-muted-foreground">Configure preferences</p>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
            </div>
        </DashboardLayout>
    )
}