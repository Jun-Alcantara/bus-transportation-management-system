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
        Schema::create('srv_routes_and_runs_validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('upload_batch_id')->constrained('upload_batches');
            $table->string('rte_id');
            $table->string('run_idx');
            $table->string('ugeocode__');
            $table->string('run_freq');
            $table->integer('runs_count')->default(0);
            $table->boolean('is_new_route')->default(false);
            $table->boolean('has_inconsistent_frequency')->default(false);
            $table->boolean('has_stacked_runs')->default(false);
            $table->json('validation_details')->nullable();
            $table->timestamps();

            $table->unique(['upload_batch_id', 'rte_id', 'run_idx'], 'srv_routes_runs_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('srv_routes_and_runs_validations');
    }
};
