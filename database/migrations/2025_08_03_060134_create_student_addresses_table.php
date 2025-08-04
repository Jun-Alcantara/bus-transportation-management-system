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
        Schema::create('student_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('address_code');
            $table->string('zip_code');
            $table->string('street_number');
            $table->string('apt_number')->nullable();
            $table->string('street_name');
            $table->string('corner_street')->nullable();
            $table->string('city');
            $table->string('address_district');
            $table->string('state');
            $table->text('google_maps_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_addresses');
    }
};
