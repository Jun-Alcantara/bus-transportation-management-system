import { useState } from 'react'
import { useForm, usePage, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import DashboardLayout from '../../components/DashboardLayout'

export default function CreateRoute({ districts, activeSchoolYear, activeSchoolTerm }) {
    const { flash, errors } = usePage().props
    
    const { data, setData, post, processing } = useForm({
        name: '',
        code: '',
        district_id: '',
        description: '',
        status: 'active',
        date_activated: '',
        date_deactivated: '',
        runs: [{ 
            run_code: '', 
            status: 'active', 
            date_activated: '',
            date_deactivated: ''
        }],
    })

    const addRun = () => {
        setData('runs', [
            ...data.runs,
            { run_code: '', status: 'active', date_activated: '', date_deactivated: '' }
        ])
    }

    const removeRun = (index) => {
        if (data.runs.length > 1) {
            const updated = data.runs.filter((_, i) => i !== index)
            setData('runs', updated)
        }
    }

    const updateRun = (index, field, value) => {
        const updated = [...data.runs]
        updated[index][field] = value
        setData('runs', updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/routes')
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">Create Route</h2>
                    <p className="text-muted-foreground mt-2">
                        Create a new transportation route with associated runs
                    </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                {/* Active Period Info */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-blue-900">Current School Period</h3>
                                <p className="text-blue-700 text-sm">
                                    {activeSchoolYear?.name} - {activeSchoolTerm?.name}
                                </p>
                            </div>
                            <div className="text-xs text-blue-600">
                                Routes will be created for this period
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* Route Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Route Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Route Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="e.g., Downtown Route A"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="code">Route Code *</Label>
                                        <Input
                                            id="code"
                                            type="text"
                                            placeholder="e.g., RT001"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            className={errors.code ? 'border-red-500' : ''}
                                        />
                                        {errors.code && (
                                            <p className="text-sm text-red-600">{errors.code}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="district_id">District *</Label>
                                        <Select value={data.district_id.toString()} onValueChange={(value) => setData('district_id', parseInt(value))}>
                                            <SelectTrigger className={errors.district_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select district">
                                                    {data.district_id ? districts.find(d => d.id === data.district_id)?.name : 'Select district'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((district) => (
                                                    <SelectItem key={district.id} value={district.id.toString()}>
                                                        {district.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.district_id && (
                                            <p className="text-sm text-red-600">{errors.district_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status *</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-sm text-red-600">{errors.status}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_activated">Date Activated</Label>
                                        <Input
                                            id="date_activated"
                                            type="date"
                                            value={data.date_activated}
                                            onChange={(e) => setData('date_activated', e.target.value)}
                                            className={errors.date_activated ? 'border-red-500' : ''}
                                        />
                                        {errors.date_activated && (
                                            <p className="text-sm text-red-600">{errors.date_activated}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_deactivated">Date Deactivated</Label>
                                        <Input
                                            id="date_deactivated"
                                            type="date"
                                            value={data.date_deactivated}
                                            onChange={(e) => setData('date_deactivated', e.target.value)}
                                            className={errors.date_deactivated ? 'border-red-500' : ''}
                                        />
                                        {errors.date_deactivated && (
                                            <p className="text-sm text-red-600">{errors.date_deactivated}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Optional route description..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Runs */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Route Runs</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addRun}
                                    >
                                        Add Run
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.runs.map((run, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Run {index + 1}</h4>
                                            {data.runs.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeRun(index)}
                                                    style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                    className="hover:opacity-90"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`run_code_${index}`}>Run Code *</Label>
                                                <Input
                                                    id={`run_code_${index}`}
                                                    type="text"
                                                    placeholder="e.g., RT001-A"
                                                    value={run.run_code}
                                                    onChange={(e) => updateRun(index, 'run_code', e.target.value)}
                                                    className={errors[`runs.${index}.run_code`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`runs.${index}.run_code`] && (
                                                    <p className="text-sm text-red-600">{errors[`runs.${index}.run_code`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`run_status_${index}`}>Status *</Label>
                                                <Select value={run.status} onValueChange={(value) => updateRun(index, 'status', value)}>
                                                    <SelectTrigger className={errors[`runs.${index}.status`] ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors[`runs.${index}.status`] && (
                                                    <p className="text-sm text-red-600">{errors[`runs.${index}.status`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`run_date_activated_${index}`}>Date Activated</Label>
                                                <Input
                                                    id={`run_date_activated_${index}`}
                                                    type="date"
                                                    value={run.date_activated}
                                                    onChange={(e) => updateRun(index, 'date_activated', e.target.value)}
                                                    className={errors[`runs.${index}.date_activated`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`runs.${index}.date_activated`] && (
                                                    <p className="text-sm text-red-600">{errors[`runs.${index}.date_activated`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`run_date_deactivated_${index}`}>Date Deactivated</Label>
                                                <Input
                                                    id={`run_date_deactivated_${index}`}
                                                    type="date"
                                                    value={run.date_deactivated}
                                                    onChange={(e) => updateRun(index, 'date_deactivated', e.target.value)}
                                                    className={errors[`runs.${index}.date_deactivated`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`runs.${index}.date_deactivated`] && (
                                                    <p className="text-sm text-red-600">{errors[`runs.${index}.date_deactivated`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <Card>
                            <CardContent className="flex justify-end space-x-2 p-6">
                                <Link href="/routes">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    style={{ backgroundColor: '#799EFF', color: 'white' }}
                                    className="hover:opacity-90"
                                >
                                    {processing ? 'Creating...' : 'Create Route'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}