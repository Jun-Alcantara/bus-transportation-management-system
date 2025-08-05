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
        Schema::create('school_maps', function (Blueprint $table) {
            $table->id();
            $table->string('sts_school_code');
            $table->string('import_school_code');
            $table->timestamps();

            $table->foreign('sts_school_code')->references('school_code')->on('schools')->onDelete('cascade');
            $table->unique(['sts_school_code', 'import_school_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_maps');
    }
};
