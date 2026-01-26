<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class FieldUser extends Pivot
{
    protected $table = 'field_users';
    
    protected $fillable = ['field_id', 'user_id', 'priority', 'last_lesson_id'];
}
