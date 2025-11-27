<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
//use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;

use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function login(Request $request){
        
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create token directly from the user instance
        $token = "";
        if($user){
        $token = $user->createToken('auth_token')->plainTextToken;    
        }
        
        return response()->json(['message' => 'Login', 'token' => $token, 'user' => $user]);


    }

    public function logout(Request $request){

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);


    }

    public function getUser(Request $request){
        return response()->json(['user' => Auth::user()]);


    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['email'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Sanctum creates a personal access token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        if($user->id){
            event(new Registered($user));
        }

        return response()->json([
            'message' => 'registered',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $broker = Password::broker('users');
        
        $repository = $broker->getRepository();
        
        $user = User::where('email', $request->email)->first();
        if(empty($user)){
            return response()->json(['status' => false, 'message'=> 'invalid-user']);
        }

        /*if ($repository->recentlyCreatedToken($user)) {
            $throttle_time = config('auth.passwords.users.throttle');
            return response()->json(['status' => false, 'message'=> 'recently-sent', 'time'=>$throttle_time]);
          }*/

        $token = $repository->create($user);

        $url = $this->resetUrl($user, $token);
        Mail::to($user)
        ->send(new PasswordResetMail($user->name, $url));

        return response()->json(['status' => true, 'message'=> 'email-sent']);
    }
    
    
    /**
     * Get the reset URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function resetUrl($user, $token)
    {
        $baseUrl = config('app.url'); // e.g., http://localhost:8000 or https://example.com
        $email = urlencode($user->getEmailForPasswordReset());

        // Manually construct the URL
        $url = $baseUrl . '/enter-new-pass?token=' . $token . '&email=' . $email;
        return $url;
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        if($status == Password::PASSWORD_RESET){
            event(new PasswordReset($user));
            return response()->json(['status' => true]);
        }
        return response()->json(['status' => false]);
        

    }
}
