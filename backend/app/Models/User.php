<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;
use App\Mail\VerificationMail;
use Illuminate\Support\Facades\Mail;




class User extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'phone', 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function info()
     {
        return $this->hasOne(UserInfo::class, 'user_id');
      }

    public function writtenLessons()  // lessons written by user
     {
        return $this->hasMany(Lesson::class, 'author_id');
      }

    public function fields()  //fields that user is taken
    {
        return $this->belongsToMany(Field::class, 'field_users')
        ->using(FieldUser::class)
        ->withPivot('priority', 'last_lesson_id', 'last_lesson_stat')
        ->withTimestamps();
    }

    public function lessons()
    {
    return $this->belongsToMany(Lesson::class, 'user_ls')
                ->using(UserLs::class)
                ->withPivot('score')
                ->withTimestamps();
     }

    
    
    //After that password changed, send an email to notify the user from change.
   /* public function sendPasswordResetedEmail(){

    }*/

        /**
     * Get the verification URL for this notifiable.
     *
     * @return string
     */
    public function verificationUrl()
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $this->getKey(),
                'hash' => sha1($this->email),
            ]
        );
    } 

    public function sendVerificationEmail(){
        $url = $this->verificationUrl();
        Mail::to($this->email)
        ->send(new VerificationMail($this->name, $url));
        return 'sent';
        
    }




}
