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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Amount in smallest unit (cents)
            $table->unsignedBigInteger('amount');

            // ISO 4217 currency code, e.g. USD, EUR
            $table->char('currency', 3);

            // Status of payment
            $table->string('status')->default('pending'); 

            // Payment provider info
            $table->string('provider');              // stripe, paypal, crypto
            $table->string('provider_payment_id');   // transaction ID / payment intent

            // Polymorphic relation to what the payment is for
            // e.g., subscription, course, wallet top-up
            $table->morphs('payable'); 
            $table->timestamps();

            // Indexes for common queries
            $table->index(['user_id', 'status']);
            //$table->index(['payable_type', 'payable_id']);  //$table->morphs('payable'); creates these indexes.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
