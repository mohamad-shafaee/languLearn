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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('author_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade');
            $table->string('color')->default("#2c82f5");
            $table->unsignedTinyInteger('fields')->default(3);
            $table->unsignedInteger('price')->default(0);
            $table->char('currency', 3);
            $table->unsignedInteger('interval')->nullable();  // number of months
            $table->text('description')->nullable();
            // Optional metadata for Stripe / PayPal plan IDs
            $table->string('provider_plan_id')->nullable();
            $table->string('provider')->nullable(); // stripe, paypal, etc.
            $table->dateTime('inactivated_at')->nullable();  //last time inactivated
            $table->string('status')->default('usual'); // archived == removed.
            $table->timestamps();
            // Indexes for common queries
            $table->index(['price']);
            $table->index(['interval']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
