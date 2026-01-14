<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'price',
        'currency',
        'interval',
        'description',
        'provider_plan_id',
        'provider',

    ];

    /**
     * Subscriptions that belong to this plan
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

}
