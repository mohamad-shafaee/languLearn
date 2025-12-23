<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnswerTa extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'lesson_id',
        'test_ass_id',
        'answer',
    ];

}
