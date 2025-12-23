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
        Schema::create('word_means', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade');
            $table->foreignId('word_id')      // FK column
                  ->constrained('words')      // references id on words table
                  ->onDelete('cascade');
            $table->foreignId('language_id')      // FK column
                  ->constrained('languages')      // references id on languages table
                  ->onDelete('cascade');
            $table->string('mean')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('word_means');
    }
};
