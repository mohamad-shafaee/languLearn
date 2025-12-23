<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestWrite extends Model
{
    protected $fillable = [
        'lesson_id',
        //'author_id',
        'body',
    ];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }

   /* public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }*/
}
