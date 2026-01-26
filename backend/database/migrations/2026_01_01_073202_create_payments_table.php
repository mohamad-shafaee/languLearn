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
            $table->string('order_id')->unique();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();  
            $table->unsignedBigInteger('amount');  // Amount in smallest unit (cents) 
            $table->char('currency', 3); // ISO 4217 currency code, e.g. USD, EUR
            $table->string('status')->default('pending'); 

            $table->string('provider');              // IDPay, stripe, paypal, crypto, zarinpal
            $table->string('provider_payment_id')->nullable();// IDPay unique key, transaction ID / payment intent
            $table->json('provider_payload')->nullable();

            // Polymorphic relation to what the payment is for
            // e.g., subscription, course, wallet top-up
            $table->morphs('payable');
            $table-> ???('paid_at')->nullable(); 
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
