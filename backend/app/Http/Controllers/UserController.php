<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function login(Request $request){
        Log::debug("Here inside login");
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();
        Log::debug("1: user is not null: " . $user->name);

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            Log::debug("2: user is not null: " . $user->name);
        return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create token directly from the user instance
        $token = "";
        if($user){
            Log::debug("3: user is not null: " . $user->name);
        $token = $user->createToken('auth_token')->plainTextToken;
        Log::debug("Token is not null: " . $token);
    
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

        return response()->json([
            'message' => 'registered',
            'token' => $token,
            'user' => $user,
        ]);
    }
}
