<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TechWord extends Model
{
    protected $fillable = ['lesson_id', 'part','word','phonetic', 'mean'];

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }

}
