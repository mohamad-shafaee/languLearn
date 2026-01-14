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
        'has_order',
        'category',
    ];

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'field_lessons')
        ->withPivot('lesson_order')
        ->orderBy('field_lessons.lesson_order')
        ->using(FieldLesson::class) 
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

    public function uiWords()
     {
       return $this->hasMany(UIWord::class);
    }


}
