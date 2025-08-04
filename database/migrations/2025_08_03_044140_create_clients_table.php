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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['ADA', 'ADULT', 'CAMPS', 'DISTRICT', 'FIXED', 'MISCELLANEOUS', 'PRIVATE', 'SHUTTLES']);
            $table->foreignId('district_id')->constrained('districts');
            $table->enum('suffolk_company', ['SBC', 'STC', 'STR', 'STS', 'SYS']);
            $table->string('address');
            $table->string('address_line_2')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->integer('number_of_decimals')->default(2);
            $table->text('attention')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
