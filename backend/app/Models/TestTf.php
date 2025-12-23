<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestTf extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lesson_id',
        //'author_id',
        'body',
        'answer',
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
