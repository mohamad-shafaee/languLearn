<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTtw extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'lesson_id',
        'part',
        'word_id',
        'status',
        'learned',
    ];
}
