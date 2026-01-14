<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DefDetectTest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lesson_id',
        'word',
        'part',
        'text1',
        'text2',
        'text3',
        'answer',
    ];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }

    public function answers()
    {
        return $this->hasMany(AnswerDdt::class);
    }
}
