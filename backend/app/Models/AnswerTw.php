<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnswerTw extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'lesson_id',
        'test_write_id',
        'answer',
    ];
}
