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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('img_path')->nullable();
            $table->string('slug');/*->nullable();*/
            $table->foreignId('author_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade');      
            $table->string('abstract')->nullable();
            $table->string('video1')->nullable();
            $table->string('video1_text')->nullable();
            $table->string('tech_term_body')->nullable();
            $table->string('text_p21')->nullable();
            $table->string('text_p22')->nullable();
            $table->string('text_p23')->nullable();
            $table->string('text_p24')->nullable();
            $table->string('text_p25')->nullable();
            $table->string('status')->nullable();
            $table->date('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
