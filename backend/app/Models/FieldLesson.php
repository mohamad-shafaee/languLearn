<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Relations\Pivot;

class FieldLesson extends Pivot
{
    protected $table = 'field_lessons';
    // Add extra fields if needed
    protected $fillable = ['field_id', 'lesson_id', 'lesson_order'];
}
