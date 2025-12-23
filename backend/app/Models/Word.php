<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = ['lesson_id','word','phonetic',
    // 'parts'
];

    public function means() {
    return $this->hasMany(WordMean::class);
}
}
