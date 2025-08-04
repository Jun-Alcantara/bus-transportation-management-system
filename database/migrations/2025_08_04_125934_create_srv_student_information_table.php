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
        Schema::create('srv_student_information', function (Blueprint $table) {
            $table->id();
            $table->string('stu_autoid')->index();
            $table->foreignId('upload_batch_id')->constrained('upload_batches');
            $table->boolean('is_new_student')->default(false);
            $table->boolean('has_inconsistent_special_needs')->default(false);
            $table->boolean('has_special_needs_changes')->default(false);
            $table->json('special_needs_data')->nullable();
            $table->json('inconsistencies_data')->nullable();
            $table->timestamps();
            
            $table->unique(['stu_autoid', 'upload_batch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srv_student_information');
    }
};
