<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'color',
        'fields',
        'author_id',
        'price',
        'currency',
        'interval',
        'description',
        'provider_plan_id',
        'provider',
        'inactivated_at',
        'status',
    ];

    /**
     * Subscriptions that belong to this plan
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }

}
