<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestFill extends Model
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
        'fill1',
        'fill2',
    ];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }

    /*public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }*/
}
