<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestReply extends Model
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
        'reply1',
        'reply2',
        'reply3',
        'answer',
        'desc1',
        'desc2',
        'desc3',
    ];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }

    public function answers()
    {
        return $this->hasMany(AnswerTr::class);
    }

    /*public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }*/

}
