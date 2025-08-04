import { useState, useEffect } from 'react'
import { useForm, usePage, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Checkbox } from '../../components/ui/checkbox'
import { Textarea } from '../../components/ui/textarea'
import DashboardLayout from '../../components/DashboardLayout'

export default function StudentForm({ student, schools, specialNeeds }) {
    const { flash, errors } = usePage().props
    const isEdit = Boolean(student)
    
    const { data, setData, post, put, processing } = useForm({
        student_code: student?.student_code || '',
        first_name: student?.first_name || '',
        middle_name: student?.middle_name || '',
        last_name: student?.last_name || '',
        birthday: student?.birthday || '',
        primary_contact_number: student?.primary_contact_number || '',
        secondary_contact_number: student?.secondary_contact_number || '',
        boces: student?.boces || false,
        displaced: student?.displaced || false,
        school_id: student?.school_id || '',
        address: {
            address_code: student?.address?.address_code || '',
            zip_code: student?.address?.zip_code || '',
            street_number: student?.address?.street_number || '',
            apt_number: student?.address?.apt_number || '',
            street_name: student?.address?.street_name || '',
            corner_street: student?.address?.corner_street || '',
            city: student?.address?.city || '',
            address_district: student?.address?.address_district || '',
            state: student?.address?.state || '',
            google_maps_link: student?.address?.google_maps_link || '',
        },
        emergency_contacts: student?.emergency_contacts || [{ 
            person_to_notify: '', 
            relationship: '', 
            contact_number: '', 
            drop_off_location: '' 
        }],
        special_needs: student?.special_needs?.map(need => need.id) || [],
    })

    const addEmergencyContact = () => {
        setData('emergency_contacts', [
            ...data.emergency_contacts,
            { person_to_notify: '', relationship: '', contact_number: '', drop_off_location: '' }
        ])
    }

    const removeEmergencyContact = (index) => {
        if (data.emergency_contacts.length > 1) {
            const updated = data.emergency_contacts.filter((_, i) => i !== index)
            setData('emergency_contacts', updated)
        }
    }

    const updateEmergencyContact = (index, field, value) => {
        const updated = [...data.emergency_contacts]
        updated[index][field] = value
        setData('emergency_contacts', updated)
    }

    const updateAddress = (field, value) => {
        setData('address', {
            ...data.address,
            [field]: value
        })
    }

    const handleSpecialNeedChange = (needId, checked) => {
        if (checked) {
            setData('special_needs', [...data.special_needs, needId])
        } else {
            setData('special_needs', data.special_needs.filter(id => id !== needId))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (isEdit) {
            put(`/students/${student.id}`)
        } else {
            post('/students')
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-bold">
                        {isEdit ? 'Edit Student' : 'Create Student'}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {isEdit ? 'Update student information, address, and emergency contacts' : 'Add a new student to the system'}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="student_code">Student Code *</Label>
                                        <Input
                                            id="student_code"
                                            type="text"
                                            value={data.student_code}
                                            onChange={(e) => setData('student_code', e.target.value)}
                                            className={errors.student_code ? 'border-red-500' : ''}
                                            disabled={isEdit}
                                        />
                                        {errors.student_code && (
                                            <p className="text-sm text-red-600">{errors.student_code}</p>
                                        )}
                                        {isEdit && (
                                            <p className="text-sm text-muted-foreground">Student code cannot be edited</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name *</Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className={errors.first_name ? 'border-red-500' : ''}
                                        />
                                        {errors.first_name && (
                                            <p className="text-sm text-red-600">{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="middle_name">Middle Name</Label>
                                        <Input
                                            id="middle_name"
                                            type="text"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                            className={errors.middle_name ? 'border-red-500' : ''}
                                        />
                                        {errors.middle_name && (
                                            <p className="text-sm text-red-600">{errors.middle_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name *</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className={errors.last_name ? 'border-red-500' : ''}
                                        />
                                        {errors.last_name && (
                                            <p className="text-sm text-red-600">{errors.last_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birthday">Birthday *</Label>
                                        <Input
                                            id="birthday"
                                            type="date"
                                            value={data.birthday}
                                            onChange={(e) => setData('birthday', e.target.value)}
                                            className={errors.birthday ? 'border-red-500' : ''}
                                        />
                                        {errors.birthday && (
                                            <p className="text-sm text-red-600">{errors.birthday}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="school_id">School *</Label>
                                        <Select value={data.school_id.toString()} onValueChange={(value) => setData('school_id', parseInt(value))}>
                                            <SelectTrigger className={errors.school_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select school">
                                                    {data.school_id ? schools.find(s => s.id === data.school_id)?.name : 'Select school'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {schools.map((school) => (
                                                    <SelectItem key={school.id} value={school.id.toString()}>
                                                        {school.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.school_id && (
                                            <p className="text-sm text-red-600">{errors.school_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="primary_contact_number">Primary Contact Number *</Label>
                                        <Input
                                            id="primary_contact_number"
                                            type="text"
                                            value={data.primary_contact_number}
                                            onChange={(e) => setData('primary_contact_number', e.target.value)}
                                            className={errors.primary_contact_number ? 'border-red-500' : ''}
                                        />
                                        {errors.primary_contact_number && (
                                            <p className="text-sm text-red-600">{errors.primary_contact_number}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="secondary_contact_number">Secondary Contact Number</Label>
                                        <Input
                                            id="secondary_contact_number"
                                            type="text"
                                            value={data.secondary_contact_number}
                                            onChange={(e) => setData('secondary_contact_number', e.target.value)}
                                            className={errors.secondary_contact_number ? 'border-red-500' : ''}
                                        />
                                        {errors.secondary_contact_number && (
                                            <p className="text-sm text-red-600">{errors.secondary_contact_number}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="boces"
                                            checked={data.boces}
                                            onCheckedChange={(checked) => setData('boces', checked)}
                                        />
                                        <Label htmlFor="boces">BOCES</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="displaced"
                                            checked={data.displaced}
                                            onCheckedChange={(checked) => setData('displaced', checked)}
                                        />
                                        <Label htmlFor="displaced">Displaced</Label>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="address_code">Address Code *</Label>
                                        <Input
                                            id="address_code"
                                            type="text"
                                            value={data.address.address_code}
                                            onChange={(e) => updateAddress('address_code', e.target.value)}
                                            className={errors['address.address_code'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.address_code'] && (
                                            <p className="text-sm text-red-600">{errors['address.address_code']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zip_code">ZIP Code *</Label>
                                        <Input
                                            id="zip_code"
                                            type="text"
                                            value={data.address.zip_code}
                                            onChange={(e) => updateAddress('zip_code', e.target.value)}
                                            className={errors['address.zip_code'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.zip_code'] && (
                                            <p className="text-sm text-red-600">{errors['address.zip_code']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="street_number">Street Number *</Label>
                                        <Input
                                            id="street_number"
                                            type="text"
                                            value={data.address.street_number}
                                            onChange={(e) => updateAddress('street_number', e.target.value)}
                                            className={errors['address.street_number'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.street_number'] && (
                                            <p className="text-sm text-red-600">{errors['address.street_number']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="apt_number">Apartment Number</Label>
                                        <Input
                                            id="apt_number"
                                            type="text"
                                            value={data.address.apt_number}
                                            onChange={(e) => updateAddress('apt_number', e.target.value)}
                                            className={errors['address.apt_number'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.apt_number'] && (
                                            <p className="text-sm text-red-600">{errors['address.apt_number']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="street_name">Street Name *</Label>
                                        <Input
                                            id="street_name"
                                            type="text"
                                            value={data.address.street_name}
                                            onChange={(e) => updateAddress('street_name', e.target.value)}
                                            className={errors['address.street_name'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.street_name'] && (
                                            <p className="text-sm text-red-600">{errors['address.street_name']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="corner_street">Corner Street</Label>
                                        <Input
                                            id="corner_street"
                                            type="text"
                                            value={data.address.corner_street}
                                            onChange={(e) => updateAddress('corner_street', e.target.value)}
                                            className={errors['address.corner_street'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.corner_street'] && (
                                            <p className="text-sm text-red-600">{errors['address.corner_street']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={data.address.city}
                                            onChange={(e) => updateAddress('city', e.target.value)}
                                            className={errors['address.city'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.city'] && (
                                            <p className="text-sm text-red-600">{errors['address.city']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address_district">Address District *</Label>
                                        <Input
                                            id="address_district"
                                            type="text"
                                            value={data.address.address_district}
                                            onChange={(e) => updateAddress('address_district', e.target.value)}
                                            className={errors['address.address_district'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.address_district'] && (
                                            <p className="text-sm text-red-600">{errors['address.address_district']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            type="text"
                                            value={data.address.state}
                                            onChange={(e) => updateAddress('state', e.target.value)}
                                            className={errors['address.state'] ? 'border-red-500' : ''}
                                        />
                                        {errors['address.state'] && (
                                            <p className="text-sm text-red-600">{errors['address.state']}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="google_maps_link">Google Maps Link</Label>
                                    <Input
                                        id="google_maps_link"
                                        type="url"
                                        value={data.address.google_maps_link}
                                        onChange={(e) => updateAddress('google_maps_link', e.target.value)}
                                        className={errors['address.google_maps_link'] ? 'border-red-500' : ''}
                                        placeholder="https://maps.google.com/..."
                                    />
                                    {errors['address.google_maps_link'] && (
                                        <p className="text-sm text-red-600">{errors['address.google_maps_link']}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contacts */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Emergency Contacts</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addEmergencyContact}
                                    >
                                        Add Emergency Contact
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.emergency_contacts.map((contact, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Emergency Contact {index + 1}</h4>
                                            {data.emergency_contacts.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeEmergencyContact(index)}
                                                    style={{ backgroundColor: '#DC3C22', color: 'white' }}
                                                    className="hover:opacity-90"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`person_to_notify_${index}`}>Person to Notify *</Label>
                                                <Input
                                                    id={`person_to_notify_${index}`}
                                                    type="text"
                                                    value={contact.person_to_notify}
                                                    onChange={(e) => updateEmergencyContact(index, 'person_to_notify', e.target.value)}
                                                    className={errors[`emergency_contacts.${index}.person_to_notify`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`emergency_contacts.${index}.person_to_notify`] && (
                                                    <p className="text-sm text-red-600">{errors[`emergency_contacts.${index}.person_to_notify`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`relationship_${index}`}>Relationship *</Label>
                                                <Input
                                                    id={`relationship_${index}`}
                                                    type="text"
                                                    value={contact.relationship}
                                                    onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                                                    className={errors[`emergency_contacts.${index}.relationship`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`emergency_contacts.${index}.relationship`] && (
                                                    <p className="text-sm text-red-600">{errors[`emergency_contacts.${index}.relationship`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`contact_number_${index}`}>Contact Number *</Label>
                                                <Input
                                                    id={`contact_number_${index}`}
                                                    type="text"
                                                    value={contact.contact_number}
                                                    onChange={(e) => updateEmergencyContact(index, 'contact_number', e.target.value)}
                                                    className={errors[`emergency_contacts.${index}.contact_number`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`emergency_contacts.${index}.contact_number`] && (
                                                    <p className="text-sm text-red-600">{errors[`emergency_contacts.${index}.contact_number`]}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`drop_off_location_${index}`}>Drop Off Location *</Label>
                                                <Input
                                                    id={`drop_off_location_${index}`}
                                                    type="text"
                                                    value={contact.drop_off_location}
                                                    onChange={(e) => updateEmergencyContact(index, 'drop_off_location', e.target.value)}
                                                    className={errors[`emergency_contacts.${index}.drop_off_location`] ? 'border-red-500' : ''}
                                                />
                                                {errors[`emergency_contacts.${index}.drop_off_location`] && (
                                                    <p className="text-sm text-red-600">{errors[`emergency_contacts.${index}.drop_off_location`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Special Needs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Special Needs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {specialNeeds.map((need) => (
                                        <div key={need.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`special_need_${need.id}`}
                                                checked={data.special_needs.includes(need.id)}
                                                onCheckedChange={(checked) => handleSpecialNeedChange(need.id, checked)}
                                            />
                                            <Label htmlFor={`special_need_${need.id}`} className="text-sm">
                                                {need.spn_name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.special_needs && (
                                    <p className="text-sm text-red-600 mt-2">{errors.special_needs}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <Card>
                            <CardContent className="flex justify-end space-x-2 p-6">
                                <Link href="/students">
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
                                    {processing ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    )
}