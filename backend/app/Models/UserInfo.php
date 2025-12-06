<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    protected $fillable = [
        'user_id',
        'education',
        'education_level',
        'profession',
        'native_language',
        'birth_date',
        'gender',
        'country',
        'city',
        'public_profile',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

