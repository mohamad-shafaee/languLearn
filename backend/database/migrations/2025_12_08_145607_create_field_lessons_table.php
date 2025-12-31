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
        Schema::create('field_lessons', function (Blueprint $table) {
            //$table->id();
            $table->foreignId('field_id')      // FK column
                  ->constrained('fields')      // references id on fields table
                  ->onDelete('cascade');   

            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade'); 
            $table->unsignedInteger('lesson_order')->nullable();
            $table->primary(['field_id', 'lesson_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_lessons');
    }
};
