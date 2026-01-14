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
        Schema::create('tech_words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade');
            $table->unsignedTinyInteger('part')->nullable();
            $table->string('word');
            $table->string('phonetic')->nullable();
            $table->text('mean')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tech_words');
    }
};
