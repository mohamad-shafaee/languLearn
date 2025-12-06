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
        Schema::create('user_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade');      // delete user_info if user deleted
            $table->string('education')->nullable();
            $table->string('education_level')->nullable();
            $table->string('profession')->nullable();
            $table->string('native_language')->nullable();
            $table->string('gender')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->boolean('public_profile')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_infos');
    }
};
