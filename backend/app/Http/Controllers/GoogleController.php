<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;
use Illuminate\Support\Facades\Log;
use Google\Client;

class GoogleController extends Controller
{
    /*public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }*/

   /* public function callback()
    {
        $token = '';
        Log::debug('aaa::::Token for Auth. ' . $token);
        try {
            // Get the user information from Google
            $user = Socialite::driver('google')->stateless()->user();
        } catch (Throwable $e) {
            Log::debug('0::::Token for Auth. ' . $token);
            //Log::debug('Google authentication failed.' . $e->__toString());
        }
        if($user->email){
            $existingUser = User::where('email', $user->email)->first();
                    if ($existingUser) {
                         if(!$existingUser->google_id){
                              $existingUser->update(['google_id'=>$user->id]);
                          }
                         if(!$existingUser->email_verified_at){
                              $existingUser->update(['email_verified_at' => now()]);
                          }
                          //Auth::login($existingUser);
                          $token = $existingUser->createToken('auth_token')->plainTextToken;
                     } else {
                               $newUser = User::updateOrInsert([
                               'email' => $user->email
                                 ], [
                               'name' => $user->name,
                               'google_id' => $user->id,
                               'password' => bcrypt(Str::random(16)), // Set a random password
                               'email_verified_at' => now()
                                ]);
                                $user_n = User::where('email', $user->email)->first();
                                //Auth::login($user_n);
                                $token = $user_n->createToken('auth_token')->plainTextToken;
                         }
        } else {
            Log::debug('1::::Token for Auth. ' . $token);
            // Redirect to React without token
            return redirect(env('FRONTEND_URL') . '/auth/callback');
        }

        Log::debug('2::::Token for Auth. ' . $token);
        // Redirect to React with token
        return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $token);

    }*/

    public function authCallback(Request $request){
        $request->validate([
            'id_token' => 'required|string'
        ]);
        
        $googleId = null;
        $email = null;
        $name = null; 
        $token = null;
        $user_res = null;

        try {
            // Get the user information from Google
            $user = Socialite::driver('google')->stateless()->user();
            $googleId = $user->id;
            $email = $user->email;
            $name = $user->name;

        } catch (Throwable $e) {
            Log::debug('0::::Token for Auth. ' . $token);
            //Log::debug('Google authentication failed.' . $e->__toString());
        }


        if($email){
            $existingUser = User::where('email', $email)->first();
                    if ($existingUser) {
                         if(!$existingUser->google_id){
                              $existingUser->update(['google_id'=>$googleId]);
                          }
                         if(!$existingUser->email_verified_at){
                              $existingUser->update(['email_verified_at' => now()]);
                          }
                          $token = $existingUser->createToken('auth_token')->plainTextToken;
                          $user_res = $existingUser;
                     } else {
                               $newUser = User::updateOrInsert([
                               'email' => $email
                                 ], [
                               'name' => $name,
                               'google_id' => $googleId,
                               'password' => bcrypt(Str::random(16)), // Set a random password
                               'email_verified_at' => now()
                                ]);
                                $user_n = User::where('email', $email)->first();
                                
                                $token = $user_n->createToken('auth_token')->plainTextToken;
                                $user_res = $user_n;
                         }
        } else {
            Log::debug('1::::Token for Auth. ' . $token);
            
        }

        Log::debug('2::::Token for Auth. ' . $token);
        return response()->json([
            'token' => $token,
            'user'  => $user_res
        ]);

    }
    
}
