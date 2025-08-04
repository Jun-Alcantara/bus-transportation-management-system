<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecialNeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specialNeeds = [
            [
                'id' => 1,
                'spn_code' => 'SP-1',
                'spn_name' => 'Other',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 2,
                'spn_code' => 'SP-2',
                'spn_name' => 'Wheelchair',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 3,
                'spn_code' => 'SP-3',
                'spn_name' => 'Individual D/A',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 4,
                'spn_code' => 'SP-4',
                'spn_name' => 'D/A',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 5,
                'spn_code' => 'SP-5',
                'spn_name' => 'D2D',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 6,
                'spn_code' => 'SP-6',
                'spn_name' => 'Carseat',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 7,
                'spn_code' => 'SP-7',
                'spn_name' => 'Nurse',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 8,
                'spn_code' => 'SP-8',
                'spn_name' => 'Harness',
                'created_by' => 1,
                'created_at' => '2017-05-30 20:00:00',
            ],
            [
                'id' => 9,
                'spn_code' => 'SP-9',
                'spn_name' => 'Last on/First off',
                'created_by' => 1,
                'created_at' => '2018-03-08 07:19:59',
            ],
            [
                'id' => 10,
                'spn_code' => 'SP-10',
                'spn_name' => 'Must ride alone',
                'created_by' => 1,
                'created_at' => '2018-03-08 07:20:19',
            ],
            [
                'id' => 11,
                'spn_code' => 'SP-11',
                'spn_name' => 'Oxygen',
                'created_by' => 1,
                'created_at' => '2018-03-08 07:21:11',
            ],
            [
                'id' => 12,
                'spn_code' => 'STUOTHNEEDS4',
                'spn_name' => 'Displaced',
                'created_by' => 1,
                'created_at' => '2018-07-01 05:37:49',
            ],
        ];

        foreach ($specialNeeds as $specialNeed) {
            \App\Models\SpecialNeed::create([
                'spn_code' => $specialNeed['spn_code'],
                'spn_name' => $specialNeed['spn_name'],
                'created_by' => $specialNeed['created_by'],
                'created_at' => $specialNeed['created_at'],
                'updated_at' => $specialNeed['created_at'],
            ]);
        }

        echo "Special needs seeded successfully!\n";
    }
}
