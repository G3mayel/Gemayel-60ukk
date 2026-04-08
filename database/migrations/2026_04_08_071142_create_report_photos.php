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
        Schema::create('report_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained()->cascadeOnDelete();
            $table->enum('old_status', ['pending', 'on_progress', 'completed', 'rejected'])->nullable();
            $table->enum('new_status', ['pending', 'on_progress', 'completed', 'rejected']);
            $table->string('admin_notes', 255)->nullable();
            $table->timestamp('changed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_status_histories');
    }
};