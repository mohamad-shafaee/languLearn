<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UIWord extends Model
{
    protected $table = 'u_i_words';

    protected $fillable = [
        'user_id',
        'field_id',
        'lesson_id',
        'word_id',
        'word',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function wordModel()
    {
        return $this->belongsTo(Word::class, 'word_id');
    }
}
