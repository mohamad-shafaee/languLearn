<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'amount',
        'currency',
        'status',
        'provider',
        'provider_payment_id',
        'provider_payload',
        'payable_type',
        'payable_id',
    ];

    /**
     * The user who made the payment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

     /**
     * Polymorphic relation to what the payment is for
     * Can be Subscription, Wallet top-up, Course purchase, etc.
     */
    public function payable()
    {
        return $this->morphTo();
    }

}
