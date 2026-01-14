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
        Schema::create('user_ttws', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade'); 
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade');
            $table->foreignId('word_id')      // FK column
                  ->constrained('words')      // references id on users table
                  ->onDelete('cascade');
            $table->unsignedTinyInteger('part');
            //$table->unsignedInteger('word_id');
            $table->integer('status')->default('1');
            $table->boolean('learned')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_ttws');
    }
};
