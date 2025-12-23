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
        Schema::create('answer_tfs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade'); 
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade'); 
            $table->foreignId('test_fill_id')      // FK column
                  ->constrained('test_fills')      // references id on test_fills table
                  ->onDelete('cascade');  
            $table->string('answer1')->nullable();
            $table->string('answer2')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answer_tfs');
    }
};
