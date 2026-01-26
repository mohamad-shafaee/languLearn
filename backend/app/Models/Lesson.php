<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'img_path',
        'slug',
        'author_id',
        'abstract',
        'video1',
        'video1_text',
        'tech_term_body',
        'text_p21',
        'text_p22',
        'text_p23',
        'text_p24',
        'text_p25',
        'status', 
        'published_at',
    ];

    public function author()
    {
    return $this->belongsTo(User::class, 'author_id');
    }

    public function fields()
    {
        return $this->belongsToMany(Field::class, 'field_lessons')
        ->withPivot('is_open')
        ->using(FieldLesson::class) 
        ->withTimestamps();
    }

    public function testWrites()
    {
        return $this->hasMany(TestWrite::class);
    }

    public function testFills()
    {
        return $this->hasMany(TestFill::class);
    }

    public function testTFs()
    {
        return $this->hasMany(TestTf::class);
    }

    public function testReplies()
    {
        return $this->hasMany(TestReply::class);
    }

    public function testAsses()
    {
        return $this->hasMany(TestAss::class);
    }

    public function defDetectTests()
    {
        return $this->hasMany(DefDetectTest::class);
    }

    public function wdmTests()
    {
        return $this->hasMany(WdmTest::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_ls')
        ->using(UserLs::class)
        ->withPivot('score')
        ->withTimestamps();
    }

    public function words()
    {
        return $this->hasMany(Word::class);
    }

    public function uiWords()
{
    return $this->hasMany(UIWord::class);
}

}
