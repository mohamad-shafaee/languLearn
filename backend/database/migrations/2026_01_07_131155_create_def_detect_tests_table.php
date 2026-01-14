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
        Schema::create('def_detect_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade');   
            $table->text('word')->nullable();
            $table->unsignedTinyInteger('part')->nullable(); //which part (paragraph) of the second page
            $table->text('text1')->nullable();
            $table->text('text2')->nullable();
            $table->text('text3')->nullable();
            $table->unsignedTinyInteger('answer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('def_detect_tests');
    }
};
