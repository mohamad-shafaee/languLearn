<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'author_id',
        'description',
        'img_path',
    ];

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'field_lessons')
        ->using(FieldLesson::class)
        ->withPivot('order')
        ->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'field_users')
        ->using(FieldUser::class)
        ->withPivot('priority', 'last_lesson_id', 'last_lesson_stat')
        ->withTimestamps();
    }

    public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }
}
