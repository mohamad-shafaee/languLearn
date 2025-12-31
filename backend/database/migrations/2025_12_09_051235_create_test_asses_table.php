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
        Schema::create('test_asses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')      // FK column
                  ->constrained('lessons')      // references id on lessons table
                  ->onDelete('cascade');     
            $table->string('body')->nullable();
            $table->string('opt1')->nullable();
            $table->string('opt2')->nullable();
            $table->string('opt3')->nullable();
            $table->string('opt4')->nullable();
            $table->unsignedTinyInteger('answer')->nullable();
            $table->unsignedTinyInteger('type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_asses');
    }
};
