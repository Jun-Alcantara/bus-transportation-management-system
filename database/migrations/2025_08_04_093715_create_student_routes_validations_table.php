<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_routes_validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('uploaded_file_id')->constrained('uploaded_files');
            $table->string('stu_autoid')->nullable();
            $table->string('stu_lastname')->nullable();
            $table->string('stu_firstname')->nullable();
            $table->string('stu_loc_number')->nullable();
            $table->string('stu_loc_streetname')->nullable();
            $table->string('stu_loc_type')->nullable();
            $table->string('stu_zcity_desc')->nullable();
            $table->string('stu_zstatecountry_statecode')->nullable();
            $table->string('stu_loc_mapzone')->nullable();
            $table->string('stu_sch_code')->nullable();
            $table->string('tripasgn_sch_code')->nullable();
            $table->string('sch_name')->nullable();
            $table->string('run_idx')->nullable();
            $table->string('run_desc')->nullable();
            $table->string('run_freq')->nullable();
            $table->string('rte_id')->nullable();
            $table->string('rte_desc')->nullable();
            $table->string('stutrip_ztriptype_id')->nullable();
            $table->string('stutrip_freqdisplay')->nullable();
            $table->string('stop_idx')->nullable();
            $table->string('loc_loc')->nullable();
            $table->string('stopsrv_belltime')->nullable();
            $table->string('stu_zgrades_descriptor')->nullable();
            $table->string('ulivw_____')->nullable();
            $table->string('ugeocode__')->nullable();
            $table->string('billing___')->nullable();
            $table->string('run_page__')->nullable();
            $table->string('ustartdate')->nullable();
            $table->boolean('stuneeds_need1')->default(false);
            $table->boolean('stuneeds_need2')->default(false);
            $table->boolean('stuneeds_need3')->default(false);
            $table->boolean('stuneeds_need4')->default(false);
            $table->boolean('stuneeds_need5')->default(false);
            $table->boolean('stuneeds_need6')->default(false);
            $table->boolean('stuneeds_need7')->default(false);
            $table->boolean('stuneeds_need8')->default(false);
            $table->boolean('stuneeds_need9')->default(false);
            $table->boolean('stuneeds_need10')->default(false);
            $table->boolean('stuothneeds_need5')->default(false);
            $table->boolean('stuothneeds_need4')->default(false);
            $table->string('stu_dateofbirth')->nullable();
            $table->string('boces_____')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_routes_validations');
    }
};
