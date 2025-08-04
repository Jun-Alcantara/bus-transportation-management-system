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
        Schema::create('school_terms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_year_id')->constrained()->onDelete('cascade');
            $table->string('name'); // e.g., "Term 1", "Fall Semester"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();

            // Ensure only one active term per school year
            $table->index(['school_year_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_terms');
    }
};