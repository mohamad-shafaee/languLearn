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
        Schema::create('answer_trs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade'); 
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade'); 
            $table->foreignId('test_reply_id')      // FK column
                  ->constrained('test_replies')      // references id on test_tfs table
                  ->onDelete('cascade');  
            $table->boolean('answer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answer_trs');
    }
};
