import { useState, useEffect } from 'react'
import { useForm, usePage, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import DashboardLayout from '../../components/DashboardLayout'

export default function ClientForm({ client, districts }) {
    const { flash, errors } = usePage().props
    const isEdit = Boolean(client)
    
    const { data, setData, post, put, processing } = useForm({
        name: client?.name || '',
        category: client?.category || '',
        district_id: client?.district_id || '',
        suffolk_company: client?.suffolk_company || '',
        address: client?.address || '',
        address_line_2: client?.address_line_2 || '',
        city: client?.city || '',
        state: client?.state || '',
        zip: client?.zip || '',
        number_of_decimals: client?.number_of_decimals || 2,
        attention: client?.attention || '',
        contact_persons: client?.contact_persons || [{ name: '', title: '', mobile_number: '', telephone_number: '', email: '' }],
    })

    const categories = [
        { value: 'ADA', label: 'ADA' },
        { value: 'ADULT', label: 'Adult' },
        { value: 'CAMPS', label: 'Camps' },
        { value: 'DISTRICT', label: 'District' },
        { value: 'FIXED', label: 'Fixed' },
        { value: 'MISCELLANEOUS', label: 'Miscellaneous' },
        { value: 'PRIVATE', label: 'Private' },
        { value: 'SHUTTLES', label: 'Shuttles' },
    ]

    const suffolkCompanies = [
        { value: 'SBC', label: 'SBC' },
        { value: 'STC', label: 'STC' },
        { value: 'STR', label: 'STR' },
        { value: 'STS', label: 'STS' },
        { value: 'SYS', label: 'SYS' },
    ]

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
            put(`/clients/${client.id}`)
        } else {
            post('/clients')
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">
                        {isEdit ? 'Edit Client' : 'Create Client'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isEdit ? 'Update client information and contact details' : 'Add a new client to the system'}
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
                                        <Label htmlFor="name">Client Name *</Label>
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
                                        <Label htmlFor="category">Category *</Label>
                                        <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-sm text-red-600">{errors.category}</p>
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
                                        <Label htmlFor="suffolk_company">Suffolk Company *</Label>
                                        <Select value={data.suffolk_company} onValueChange={(value) => setData('suffolk_company', value)}>
                                            <SelectTrigger className={errors.suffolk_company ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suffolkCompanies.map((company) => (
                                                    <SelectItem key={company.value} value={company.value}>
                                                        {company.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.suffolk_company && (
                                            <p className="text-sm text-red-600">{errors.suffolk_company}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="number_of_decimals">Number of Decimals *</Label>
                                        <Input
                                            id="number_of_decimals"
                                            type="number"
                                            min="0"
                                            max="9"
                                            value={data.number_of_decimals}
                                            onChange={(e) => setData('number_of_decimals', parseInt(e.target.value))}
                                            className={errors.number_of_decimals ? 'border-red-500' : ''}
                                        />
                                        {errors.number_of_decimals && (
                                            <p className="text-sm text-red-600">{errors.number_of_decimals}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="attention">Attention</Label>
                                        <Input
                                            id="attention"
                                            type="text"
                                            value={data.attention}
                                            onChange={(e) => setData('attention', e.target.value)}
                                            className={errors.attention ? 'border-red-500' : ''}
                                        />
                                        {errors.attention && (
                                            <p className="text-sm text-red-600">{errors.attention}</p>
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
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address *</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className={errors.address ? 'border-red-500' : ''}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-600">{errors.address}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address_line_2">Address Line 2</Label>
                                    <Input
                                        id="address_line_2"
                                        type="text"
                                        value={data.address_line_2}
                                        onChange={(e) => setData('address_line_2', e.target.value)}
                                        className={errors.address_line_2 ? 'border-red-500' : ''}
                                    />
                                    {errors.address_line_2 && (
                                        <p className="text-sm text-red-600">{errors.address_line_2}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className={errors.city ? 'border-red-500' : ''}
                                        />
                                        {errors.city && (
                                            <p className="text-sm text-red-600">{errors.city}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            type="text"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            className={errors.state ? 'border-red-500' : ''}
                                        />
                                        {errors.state && (
                                            <p className="text-sm text-red-600">{errors.state}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code *</Label>
                                        <Input
                                            id="zip"
                                            type="text"
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            className={errors.zip ? 'border-red-500' : ''}
                                        />
                                        {errors.zip && (
                                            <p className="text-sm text-red-600">{errors.zip}</p>
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
                                <Link href="/clients">
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
                                    {processing ? 'Saving...' : (isEdit ? 'Update Client' : 'Create Client')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}