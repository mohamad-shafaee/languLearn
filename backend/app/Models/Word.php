<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = ['lesson_id','word','phonetic'];

    public function means() {
    return $this->hasMany(WordMean::class);
    }

    public function uiWords()
     {
    return $this->hasMany(UIWord::class);
    }

    public function lesson()
    {
    return $this->belongsTo(Lesson::class);
    }
}
