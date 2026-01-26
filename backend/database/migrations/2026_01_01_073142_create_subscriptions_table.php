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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')      // FK column
                  ->constrained('users')      // references id on users table
                  ->onDelete('cascade');  
            $table->foreignId('plan_id')      // FK column
                  ->constrained('plans')      // references id on users table
                  ->onDelete('cascade');  
            $table->string('status')->default('active'); //active, canceled, expired, trial, past_due
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();  
            // Payment provider info (optional)
            //$table->string('provider')->nullable(); //These two colomns are just for stripe or paypal
            //$table->string('provider_subscription_id')->nullable(); // ID from Stripe/PayPal
            $table->timestamps();
            // Indexes for faster queries
            $table->index(['user_id', 'status']);
            $table->index(['plan_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
