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
        Schema::table('srv_school_validations', function (Blueprint $table) {
            // Drop the school_type column (MySQL will automatically handle the unique constraint)
            $table->dropColumn('school_type');
        });
        
        // Add new unique constraint in a separate statement
        Schema::table('srv_school_validations', function (Blueprint $table) {
            $table->unique(['upload_batch_id', 'school_code'], 'srv_school_validations_batch_code_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('srv_school_validations', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('srv_school_validations_batch_code_unique');
            // Add back the school_type column
            $table->enum('school_type', ['tripasgn_scho_code', 'stu_sch_code'])->after('school_code');
            // Add back the original unique constraint
            $table->unique(['upload_batch_id', 'school_code', 'school_type'], 'srv_school_validations_unique');
        });
    }
};
