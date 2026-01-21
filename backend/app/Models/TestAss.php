<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestAss extends Model
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
        'opt1',
        'opt2',
        'opt3',
        'opt4',
        'answer',
        'type',
    ];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }

    public function answers()
    {
        return $this->hasMany(AnswerTa::class);
    }

    /*public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }*/

}
