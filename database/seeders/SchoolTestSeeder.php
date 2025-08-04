<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get a test district
        $district = \App\Models\District::firstOrCreate(
            ['code' => 'TEST001'],
            [
                'name' => 'Test District',
                'created_by' => 1,
                'updated_by' => 1
            ]
        );

        // Create a test school
        $school = \App\Models\School::create([
            'school_code' => 'SCH001',
            'name' => 'Test Elementary School',
            'district_id' => $district->id,
            'street' => 'Main Street',
            'street_number' => '123',
            'zip_code' => '12345',
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        // Create contact persons for the school
        $school->contactPersons()->create([
            'name' => 'John Doe',
            'title' => 'Principal',
            'mobile_number' => '555-0123',
            'telephone_number' => '555-0124',
            'email' => 'principal@testschool.edu'
        ]);

        $school->contactPersons()->create([
            'name' => 'Jane Smith',
            'title' => 'Vice Principal',
            'mobile_number' => '555-0125',
            'email' => 'vp@testschool.edu'
        ]);

        echo "Test school created successfully!\n";
    }
}
