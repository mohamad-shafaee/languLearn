<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserInfo;
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
use Illuminate\Support\Facades\Storage;

use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\ImageManager;

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

    public function getUserData($id){
        $user = Auth::user();
        //$user_info = $user->info();
        $user_info = UserInfo::where('user_id', $user->id)->first();

        // Load User + user_info relationship
        //$user = User::with('info')->find($id);
        if (!$user) {
          return response()->json([
            'message' => 'User not found'
          ], 404);
         }
         $result = ['img' => $user->img_path,
                   'name' => $user->name,
                   'email' => '',
                   'phone' => '',
                   'education' => '',
                   'education_level' => '',
                   'profession' => '',
                   'native_language' => '',
                   'gender' => '',
                   'birth_date' => '',
                   'country' => '',
                   'city' => '',
                   'public_profile' => null,
                   'type' => '',
                   'user_tier' => '',
                   ];
         if(Auth::user()->id == $id){

            $result = ['img' => $user->img_path,
                   'name' => $user->name,
                   'email' => $user->email,
                   'phone' => $user->phone,
                   'education' => $user_info->education,
                   'education_level' => $user_info->education_level,
                   'profession' => $user_info->profession,
                   'native_language' => $user_info->native_language,
                   'gender' => $user_info->gender,
                   'birth_date' => $user_info->birth_date, //? $user_info->birth_date->format('Y-m-d') : '',
                   'country' => $user_info->country,
                   'city' => $user_info->city,
                   'public_profile' => $user_info->public_profile,
                   'type' => $user->type,
                   'user_tier' => '',
                   ];
         }

        return response()->json($result);
    }

    public function editUserData(Request $request){
        $validated = $request->validate([
            'editorId' => 'required|integer',
            'key' => 'required|string',
            'value' => 'nullable|string', 
        ]);
        $editor_id = $validated['editorId'];
        $key = $validated['key'];
        $value = $validated['value'];

        $user = auth()->user();

        if($user->id != $editor_id){
            return response()->json(['success'=>false, 'message'=>'You could not edit the field!']);
        }

        $user_info = ['education' ,'education_level', 'profession', 'native_language',
         'gender', 'birth_date', 'country', 'city', 'public_profile'];

        if(in_array($key, $user_info)){
            //$user_i = UserInfo::where('user_id', $user->id)->first();
            $user_i = $user->info();
            $user_i->update([$key => $value]);
            return response()->json(['success'=>true]);
        } 

        $user->update([$key => $value]);
        return response()->json(['success'=>true]);


    }


    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            //'name' => $validated['email'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        //UserInfo::create(['user_id'=>$user->id]);
        $user->info()->create(); // user_id is filled automatically

        // Sanctum creates a personal access token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        if($user->id){
            //event(new Registered($user));
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

    public function changePasswordLogedin(Request $request){
        $validated = $request->validate([
            'email' => 'required|email',
            'oldPassword' => 'required|string',
            'password' => 'required|min:8|confirmed'
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['oldPassword'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['status'=>true]);
    }

    // I should have a simlink from real public folder (e.g., in cpanel: public_html)
    // to storage/app/public folder in the backend.
    // php artisan storage:link Now any file saved in storage/app/public/... can be accessed via
    // http://yourdomain.com/storage/...
    // You should modify APP_URL after production to the correct domain to url() helper work properly. 
    public function saveProfileImage(Request $request){

            $id = request()->input('id');
            if($id != auth()->user()->id){
                return response()->json(['success'=> false, 'message'=>'You could not edit the image.']);
            }
            $file = $request->file('file');
            //$filename = pathinfo($file->hashName(), PATHINFO_FILENAME);
            $extension = 'jpg'; // fixed format
            // Define save paths
            $originalPath = storage_path("app/public/userImages/user-" . $id . "/original." . $extension);
            $mediumPath   = storage_path("app/public/userImages/user-" . $id . "/medium." . $extension);
            $thumbPath    = storage_path("app/public/userImages/user-" . $id . "/thumbnail." . $extension);
            // Make sure the directory exist
            $dirPath = storage_path("app/public/userImages/user-" . $id);
            if (!file_exists($dirPath)) {
            mkdir($dirPath, 0755, true);
            }

            // Create a new image manager with Imagick driver
            $manager = new ImageManager(new Driver());
        
            // Save Original
            $manager->read($file)->toJpeg(90)->save($originalPath);
        
            // Medium version (resize, keep aspect ratio)
            $manager->read($file)->scaleDown(800) // width = 800px
             ->toJpeg(85)->save($mediumPath);
            
            // Thumbnail version (square crop)
            $manager->read($file)->scaleDown(300)         // Crop to 300x300
            ->toJpeg(75)              // Slightly more compression
            ->save($thumbPath);

            $thumbnailUrl = url("storage/userImages/user-". $id . "/thumbnail.jpg");
            User::where('id', $id)->update(['img_path' => $thumbnailUrl]);
            return response()->json(['success'=> true, 'imageUrl' => $thumbnailUrl, 'message'=>'Image saved.']);
    }

}
