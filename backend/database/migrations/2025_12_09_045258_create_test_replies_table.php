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
        Schema::create('test_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade');
           // $table->foreignId('author_id')      // FK column
             //     ->constrained('users')      // references id on users table
             //     ->onDelete('cascade');      
            $table->string('body')->nullable();
            $table->string('reply1')->nullable();
            $table->string('reply2')->nullable();
            $table->string('reply3')->nullable();
            $table->unsignedTinyInteger('answer')->nullable();
            $table->string('desc1')->nullable();
            $table->string('desc2')->nullable();
            $table->string('desc3')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_replies');
    }
};
