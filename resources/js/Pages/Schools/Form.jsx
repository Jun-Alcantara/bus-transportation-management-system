import { useState, useEffect } from 'react'
import { useForm, usePage, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import DashboardLayout from '../../components/DashboardLayout'

export default function SchoolForm({ school, districts }) {
    const { flash, errors } = usePage().props
    const isEdit = Boolean(school)
    
    const { data, setData, post, put, processing } = useForm({
        school_code: school?.school_code || '',
        name: school?.name || '',
        district_id: school?.district_id || '',
        street: school?.street || '',
        street_number: school?.street_number || '',
        zip_code: school?.zip_code || '',
        contact_persons: school?.contact_persons || [{ name: '', title: '', mobile_number: '', telephone_number: '', email: '' }],
    })

    const addContactPerson = () => {
        setData('contact_persons', [
            ...data.contact_persons,
            { name: '', title: '', mobile_number: '', telephone_number: '', email: '' }
        ])
    }

    const removeContactPerson = (index) => {
        if (data.contact_persons.length > 1) {
            const updated = data.contact_persons.filter((_, i) => i !== index)
            setData('contact_persons', updated)
        }
    }

    const updateContactPerson = (index, field, value) => {
        const updated = [...data.contact_persons]
        updated[index][field] = value
        setData('contact_persons', updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (isEdit) {
            put(`/schools/${school.id}`)
        } else {
            post('/schools')
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">
                        {isEdit ? 'Edit School' : 'Create School'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isEdit ? 'Update school information and contact details' : 'Add a new school to the system'}
                    </p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">School Name *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="school_code">School Code *</Label>
                                        <Input
                                            id="school_code"
                                            type="text"
                                            value={data.school_code}
                                            onChange={(e) => setData('school_code', e.target.value)}
                                            className={errors.school_code ? 'border-red-500' : ''}
                                        />
                                        {errors.school_code && (
                                            <p className="text-sm text-red-600">{errors.school_code}</p>
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Address Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="street_number">Street Number *</Label>
                                        <Input
                                            id="street_number"
                                            type="text"
                                            value={data.street_number}
                                            onChange={(e) => setData('street_number', e.target.value)}
                                            className={errors.street_number ? 'border-red-500' : ''}
                                        />
                                        {errors.street_number && (
                                            <p className="text-sm text-red-600">{errors.street_number}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="street">Street *</Label>
                                        <Input
                                            id="street"
                                            type="text"
                                            value={data.street}
                                            onChange={(e) => setData('street', e.target.value)}
                                            className={errors.street ? 'border-red-500' : ''}
                                        />
                                        {errors.street && (
                                            <p className="text-sm text-red-600">{errors.street}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zip_code">ZIP Code *</Label>
                                        <Input
                                            id="zip_code"
                                            type="text"
                                            value={data.zip_code}
                                            onChange={(e) => setData('zip_code', e.target.value)}
                                            className={errors.zip_code ? 'border-red-500' : ''}
                                        />
                                        {errors.zip_code && (
                                            <p className="text-sm text-red-600">{errors.zip_code}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Persons */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Contact Persons</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addContactPerson}
                                    >
                                        Add Contact Person
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.contact_persons.map((contact, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Contact Person {index + 1}</h4>
                                            {data.contact_persons.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeContactPerson(index)}
                                                    style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                    className="hover:opacity-90"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`contact_name_${index}`}>Name *</Label>
                                                <Input
                                                    id={`contact_name_${index}`}
                                                    type="text"
                                                    value={contact.name}
                                                    onChange={(e) => updateContactPerson(index, 'name', e.target.value)}
                                                    className={errors[`contact_persons.${index}.name`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`contact_persons.${index}.name`] && (
                                                    <p className="text-sm text-red-600">{errors[`contact_persons.${index}.name`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact_title_${index}`}>Title *</Label>
                                                <Input
                                                    id={`contact_title_${index}`}
                                                    type="text"
                                                    value={contact.title}
                                                    onChange={(e) => updateContactPerson(index, 'title', e.target.value)}
                                                    className={errors[`contact_persons.${index}.title`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`contact_persons.${index}.title`] && (
                                                    <p className="text-sm text-red-600">{errors[`contact_persons.${index}.title`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact_mobile_${index}`}>Mobile Number *</Label>
                                                <Input
                                                    id={`contact_mobile_${index}`}
                                                    type="text"
                                                    value={contact.mobile_number}
                                                    onChange={(e) => updateContactPerson(index, 'mobile_number', e.target.value)}
                                                    className={errors[`contact_persons.${index}.mobile_number`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`contact_persons.${index}.mobile_number`] && (
                                                    <p className="text-sm text-red-600">{errors[`contact_persons.${index}.mobile_number`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact_telephone_${index}`}>Telephone Number</Label>
                                                <Input
                                                    id={`contact_telephone_${index}`}
                                                    type="text"
                                                    value={contact.telephone_number}
                                                    onChange={(e) => updateContactPerson(index, 'telephone_number', e.target.value)}
                                                    className={errors[`contact_persons.${index}.telephone_number`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`contact_persons.${index}.telephone_number`] && (
                                                    <p className="text-sm text-red-600">{errors[`contact_persons.${index}.telephone_number`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor={`contact_email_${index}`}>Email *</Label>
                                                <Input
                                                    id={`contact_email_${index}`}
                                                    type="email"
                                                    value={contact.email}
                                                    onChange={(e) => updateContactPerson(index, 'email', e.target.value)}
                                                    className={errors[`contact_persons.${index}.email`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`contact_persons.${index}.email`] && (
                                                    <p className="text-sm text-red-600">{errors[`contact_persons.${index}.email`]}</p>
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
                                <Link href="/schools">
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
                                    {processing ? 'Saving...' : (isEdit ? 'Update School' : 'Create School')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}