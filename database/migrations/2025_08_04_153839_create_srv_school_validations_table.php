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
        Schema::create('srv_school_validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('upload_batch_id')->constrained()->onDelete('cascade');
            $table->string('school_code');
            $table->enum('school_type', ['tripasgn_scho_code', 'stu_sch_code']);
            $table->boolean('is_unknown_school')->default(true);
            $table->integer('record_count')->default(0);
            $table->json('validation_data')->nullable();
            $table->timestamps();

            $table->unique(['upload_batch_id', 'school_code', 'school_type'], 'srv_school_validations_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srv_school_validations');
    }
};
