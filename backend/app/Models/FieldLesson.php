<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Relations\Pivot;

class FieldLesson extends Pivot
{
    protected $table = 'field_lessons'; 
    protected $fillable = ['field_id', 'lesson_id', 'is_open'];
}
