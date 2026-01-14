<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WdmTest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lesson_id',
        'part',
        'body',
        'answer',
    ];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }
}
