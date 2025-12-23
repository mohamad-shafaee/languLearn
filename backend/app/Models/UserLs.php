<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserLs extends Pivot
{
    protected $table = 'user_ls';
    protected $fillable = ['user_id','lesson_id','score'];

}
