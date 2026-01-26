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
        Schema::create('field_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('field_id')      // FK column
                  ->constrained('fields')      // references id on fields table
                  ->onDelete('cascade');      
            $table->foreignId('user_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade');
            $table->unsignedTinyInteger('priority')->nullable();
            $table->unsignedBigInteger('last_lesson_id')->nullable(); 
            $table->unique(['field_id', 'user_id']);   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_users');
    }
};
