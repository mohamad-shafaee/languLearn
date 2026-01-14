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
        Schema::create('u_i_words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('field_id')
                ->constrained('fields')
                ->cascadeOnDelete();

            $table->foreignId('lesson_id')
                ->constrained('lessons')
                ->cascadeOnDelete();
            $table->foreignId('word_id')
                ->constrained('words')
                ->cascadeOnDelete();

            $table->string('word');
            $table->timestamps();
            $table->unique([
                'user_id',
                'field_id',
                'lesson_id',
                'word_id',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('u_i_words');
    }
};
