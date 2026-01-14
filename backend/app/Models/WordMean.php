<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WordMean extends Model
{
    protected $fillable = [
        'lesson_id',
        'word_id',
        'language_id',
        'mean',
    ];

    public function language() {
    return $this->belongsTo(Language::class);
}

public function word() {
    return $this->belongsTo(Word::class);
}
public function lesson() {
    return $this->belongsTo(Lesson::class);
}
}

