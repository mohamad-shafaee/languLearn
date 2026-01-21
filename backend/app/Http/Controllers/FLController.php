<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Field;
use App\Models\Lesson;
use App\Models\Language;
use App\Models\Word;
use App\Models\WordMean;
use App\Models\FieldLesson;
//use App\Models\FieldUser;
use App\Models\TestWrite;
use App\Models\TestAss;
use App\Models\TestFill;
use App\Models\TestReply;
use App\Models\TestTf;
use App\Models\UIWord;
use App\Models\DefDetectTest;
use App\Models\WdmTest;
use App\Models\TechWord;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\ImageManager;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


class FLController extends Controller
{
    public function getLanguages(Request $request){

        $langs = Language::select('id', 'code', 'name', 'direction')->get();
        return response()->json(['languages' => $langs]);
    }

    

    public function getFields(Request $request){

        $fields = Field::whereNotIn('name', ['', ' '])
    ->select('id', 'name', 'img_path', 'description')->get();
        return response()->json(['fields' => $fields]);
    }

    public function getField(Request $request){
        
        $field = Field::where('id', $request->fieldId)
        ->select('id', 'name', 'author_id', 'img_path', 'description')->first();
        return response()->json(['field' => $field]);
    }

    public function removeField(Request $request){

        $field_lessons = FieldLesson::where('field_id', $request->fieldId)->count();
        if($field_lessons > 0){
            return response()->json(['success' => false, 'message' => 'Some lessons are dependent to this field, so it can not be removed!']);
        }

        $images_del = Storage::disk('public')->deleteDirectory('fieldImages/field-' . $request->fieldId);
        if($images_del){
            Field::where('id', $request->fieldId)->delete();
            return response()->json(['success' => true, 'message' => 'Field removed.']);
        }
        return response()->json(['success' => false, 'message' => 'Field images could not removed.']);

        
    }

    public function updateField(Request $request){

        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'fieldId' => ['nullable', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $field = Field::find($validated['fieldId']);
            if ($field) {
              $field->update([
                  'name' => $validated['name'],
                  'description' => $validated['description'],
           ]);
            return response()->json(['success' => true, 'id'=>$field->id]);
        }
        return response()->json(['success' => false]);
    }

    /*public function updateField(Request $request){

        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'fieldId' => ['nullable', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $field_id = $validated['fieldId'];

        if(!$field_id){
            $field = Field::create([
            'name' => $validated['name'],
            'author_id' => $validated['authorId'],
            'description' => $validated['description'],
           ]);
        $field_id = $field->id;
        return response()->json(['success' => true, 'id'=>$field_id]);
        } else {
            //update the existing field.
            $field = Field::find($field_id);
            if ($field) {
              $field->update([
                  'name' => $validated['name'],
                  'description' => $validated['description'],
           ]);
            return response()->json(['success' => true, 'id'=>$field->id]);
        }
        }  
        return response()->json(['success' => false]);
    }*/

    public function getLessonSlug($title, $author_id){
        $slug = Str::slug($title . '-' . $author_id . '-' . time());
        return $slug;
    }


    /*public function addLesson(Request $request){

        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['nullable', 'string'],
            'video1' => ['nullable', 'string'],
            'video1_text' => ['nullable', 'string'],
            'tech_term_body' => ['nullable', 'string'],
            'text_p21' => ['nullable', 'string'],
            'text_p22' => ['nullable', 'string'],
            'text_p23' => ['nullable', 'string'],
            'text_p24' => ['nullable', 'string'],
            'text_p25' => ['nullable', 'string'], 
            'field_id' => ['required', 'integer'],         
        ]);

        $lesson_id = $validated['lessonId'];

        if(!$lesson_id){
            $lesson = Lesson::create([
            'title' => $validated['title'],
            'author_id' => $validated['authorId'],
            'slug' => $this->getLessonSlug($validated['title'], $validated['authorId']),
            'abstract' => $validated['abstract'],
            'video1' => $validated['video1'],
            'video1_text' => $validated['video1_text'],
            'tech_term_body' => $validated['tech_term_body'],
            'text_p21' => $validated['text_p21'],
            'text_p22' => $validated['text_p22'],
            'text_p23' => $validated['text_p23'],
            'text_p24' => $validated['text_p24'],
            'text_p25' => $validated['text_p25'],
            'status' => 'raw',
           ]);
        $lesson_id = $lesson->id;

        // insert into field_lessons
        FieldLesson::where('lesson_id', $lesson_id)->delete();
        //$exists = FieldLesson::where('lesson_id', $lesson_id)->where('field_id', $validated['field_id'])->exists();
        //if(!$exists){
        FieldLesson::create(['field_id'=> $validated['field_id'], 'lesson_id' => $lesson_id]);
        //} 
        return response()->json(['success' => true, 'id'=>$lesson_id]);
        } else {
            //update the existing field.
            $lesson = Lesson::find($lesson_id);
            if ($lesson) {
              $lesson->update([
                  'title' => $validated['title'],
                  'slug' => $this->getLessonSlug($validated['title'], $validated['authorId']),
                  'abstract' => $validated['abstract'],
                  'video1' => $validated['video1'],
                  'video1_text' => $validated['video1_text'],
                  'tech_term_body' => $validated['tech_term_body'],
                  'text_p21' => $validated['text_p21'],
                  'text_p22' => $validated['text_p22'],
                  'text_p23' => $validated['text_p23'],
                  'text_p24' => $validated['text_p24'],
                  'text_p25' => $validated['text_p25'],
           ]);

              FieldLesson::where('lesson_id', $lesson_id)->delete();
              //$exists = FieldLesson::where('lesson_id', $lesson_id)->where('field_id', $validated['field_id'])->exists();
        //if(!$exists){
        FieldLesson::create(['field_id'=> $validated['field_id'], 'lesson_id' => $lesson_id]);
        //}
            return response()->json(['success' => true, 'id'=>$lesson_id]);
        }
        }  
        return response()->json(['success' => false]);
    }*/ 

    public function updateLesson(Request $request){

        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['nullable', 'string'],
            'video1' => ['nullable', 'string'],
            'video1_text' => ['nullable', 'string'],
            'tech_term_body' => ['nullable', 'string'],
            'text_p21' => ['nullable', 'string'],
            'text_p22' => ['nullable', 'string'],
            'text_p23' => ['nullable', 'string'],
            'text_p24' => ['nullable', 'string'],
            'text_p25' => ['nullable', 'string'], 
            'fields' => ['required', 'array', 'min:1'],    
            'removed_fields' => ['nullable', 'array'],    
        ]);

            $lesson = Lesson::find($validated['lessonId']);
            if ($lesson) {
              $lesson->update([
                  'title' => $validated['title'],
                  'slug' => $this->getLessonSlug($validated['title'], $validated['authorId']),
                  'abstract' => $validated['abstract'],
                  'video1' => $validated['video1'],
                  'video1_text' => $validated['video1_text'],
                  'tech_term_body' => $validated['tech_term_body'],
                  'text_p21' => $validated['text_p21'],
                  'text_p22' => $validated['text_p22'],
                  'text_p23' => $validated['text_p23'],
                  'text_p24' => $validated['text_p24'],
                  'text_p25' => $validated['text_p25'],
           ]); 

            //FieldLesson::where('lesson_id', $validated['lessonId'])->delete();

            $fields = $request->input('fields'); // this will be an array
             foreach ($fields as $field) {
                FieldLesson::updateOrCreate(['field_id'=> $field['id'],
                 'lesson_id' => $validated['lessonId']], []);
            }

            $rm_fields = $request->input('removed_fields');
            if(count($rm_fields)>0){
                foreach ($rm_fields as $field) {
                FieldLesson::where('lesson_id', $validated['lessonId'])
                ->where('field_id', $field['id'])
                ->delete();
            }

            }
            
 
            return response()->json(['success' => true]); 
    }
}

  public function takeFieldId(Request $request){

    $author_id = request()->input('authorId');
    $field = Field::where('author_id', $author_id)->where('name', '')->first();
    if($field){
        return response()->json(['success'=> true, 'id'=>$field->id]);
    }
        $field = Field::create([
            'name' => '',
            'author_id' => $author_id,
            'description' => '',
            'img_path' => '',
            ]); 
        return response()->json(['success'=> true, 'id'=>$field->id]); 
  }

        // I should have a simlink from real public folder (e.g., in cpanel: public_html)
    // to storage/app/public folder in the backend.
    // php artisan storage:link Now any file saved in storage/app/public/... can be accessed via
    // http://yourdomain.com/storage/...
    // You should modify APP_URL after production to the correct domain to url() helper work properly. 
    public function saveFieldImage(Request $request){

            /*$id = request()->input('authorId');
            if($id != auth()->user()->id || auth()->user()->type != "admin"){
                return response()->json(['success'=> false, 'message'=>'You could not edit the image.']);
            }
            $field_id = request()->input('fieldId');
            if(!$field_id){
                //First I should create a raw field to be able to create its images folder
              $field = Field::create([
                'name' => "RAW FIELD",
                'author_id' => $id,
                'description' => "",
                'img_path' => "",
            ]);
            $field_id = $field->id;
            }*/

            $id = request()->input('authorId');
            $field_id = request()->input('fieldId');
            $file = $request->file('file');
            $extension = 'jpg'; // fixed format
            // Define save paths
            $originalPath = storage_path("app/public/fieldImages/field-" . $field_id . "/original." . $extension);
            $mediumPath   = storage_path("app/public/fieldImages/field-" . $field_id . "/medium." . $extension);
            $thumbPath    = storage_path("app/public/fieldImages/field-" . $field_id . "/thumbnail." . $extension);
            // Make sure the directory exist
            $dirPath = storage_path("app/public/fieldImages/field-" . $field_id);
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

            $med_url = url("storage/fieldImages/field-". $field_id . "/medium.jpg");
            Field::where('id', $field_id)->update(['img_path' => $med_url]);
            return response()->json(['success'=> true, 'imageUrl' => $med_url]);
    }

    public function takeLessonId(Request $request){
        $id = request()->input('authorId');
        $lesson = Lesson::where('author_id', $id)->where('title', 'RAW LESSON')->first();
        if($lesson){
            return response()->json(['success'=> true, 'id'=>$lesson->id]);
        }
        $lesson = Lesson::create([
            'title' => 'RAW LESSON',
            'slug' => 'raw-lesson-'. rand(1000, 10000),
            'author_id' => $id,
            'status' => 'raw',
            ]); 
        return response()->json(['success'=> true, 'id'=>$lesson->id]);  
    }


        // I should have a simlink from real public folder (e.g., in cpanel: public_html)
    // to storage/app/public folder in the backend.
    // php artisan storage:link Now any file saved in storage/app/public/... can be accessed via
    // http://yourdomain.com/storage/...
    // You should modify APP_URL after production to the correct domain to url() helper work properly. 
    public function saveLessonImage(Request $request){

            /*$id = request()->input('userId');
            if($id != auth()->user()->id || auth()->user()->type != "admin"){
                return response()->json(['success'=> false, 'message'=>'You could not edit the image.']);
            }
            $lesson_id = request()->input('lessonId');
            if(!$lesson_id){
                //First I should create a raw lesson to be able to create its images folder
              $lesson = Lesson::create([
                'title' => "RAW LESSON",
                'author_id' => $id,
                'slug' => "raw-lesson-". rand(1000, 10000),
                'img_path' => "",
                'status' => '1',
            ]);
            $lesson_id = $lesson->id;
            }*/

            $id = request()->input('userId');
            $lesson_id = request()->input('lessonId');
            $file = $request->file('file');
            $extension = 'jpg'; // fixed format
            // Define save paths
            $originalPath = storage_path("app/public/lessonImages/lesson-" . $lesson_id . "/original." . $extension);
            $mediumPath   = storage_path("app/public/lessonImages/lesson-" . $lesson_id . "/medium." . $extension);
            $thumbPath    = storage_path("app/public/lessonImages/lesson-" . $lesson_id . "/thumbnail." . $extension);
            // Make sure the directory exist
            $dirPath = storage_path("app/public/lessonImages/lesson-" . $lesson_id);
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

            $med_url = url("storage/lessonImages/lesson-". $lesson_id . "/medium.jpg");
            Lesson::where('id', $lesson_id)->update(['img_path' => $med_url]);
            return response()->json(['success'=> true, 'imageUrl' => $med_url]);
    }

    /*public function saveLessonWords(Request $request){
        $lessonId = $request->input('lesson_id');
        $words = $request->input('words'); 

        DB::transaction(function () use ($lessonId, $words) {
            WordMean::where('lesson_id', $lessonId)->delete();
            Word::where('lesson_id', $lessonId)->delete(); 
            foreach ($words as $w) {
            $word = Word::create(['lesson_id'=>$lessonId,
                                  'word' => $w['word'],
                                  'phonetic'=>$w['phonetic']]);
                foreach ($w['means'] as $mean) {

                    WordMean::create(['lesson_id'=>$lessonId,
                                      'word_id' => $word->id,
                                      'language_id' => $mean['language_id'],
                                      'mean' => $mean['mean'] ]);
                }
        }
    });
    return response()->json(['success' => true]);
        
    }*/

    
    public function saveLessonTechWords(Request $request){
        $validated = $request->validate([
        'lessonId' => ['required', 'integer'/*, 'exists:lessons,id'*/],
        'words' => ['nullable', 'array'],
        'words.*.id' => ['required', 'integer'],
        'words.*.part' => ['required', 'integer'],
        'words.*.word' => ['required', 'string'],
        'words.*.mean' => ['nullable', 'string'],
        'words.*.phonetic' => ['nullable', 'string'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
         ]);

        $lessonId = $validated['lessonId'];
        $words = $validated['words'];

        DB::transaction(function () use ($lessonId, $words) {
            
            foreach ($words as $w) {
            $word = TechWord::where('id', $w['id'])->update([
                                  'part' => $w['part'],
                                  'word' => $w['word'],
                                  'phonetic'=>$w['phonetic'],
                                  'mean' => $w['mean']
                                   ]);

              }
           });
           foreach ($validated['removed'] as $word) {
              TechWord::where('id', $word['id'])->delete();
           }
           return response()->json(['success' => true]); 
    }

    public function saveLessonWords(Request $request){
        $validated = $request->validate([
        'lessonId' => ['required', 'integer'/*, 'exists:lessons,id'*/],
        'words' => ['nullable', 'array'],
        'words.*.id' => ['required', 'integer'],
        'words.*.word' => ['required', 'string'],
        'words.*.means' => ['nullable', 'array'],
        'words.*.phonetic' => ['nullable', 'string'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
         ]);

        $lessonId = $validated['lessonId'];
        $words = $validated['words'];

        DB::transaction(function () use ($lessonId, $words) {
            WordMean::where('lesson_id', $lessonId)->delete();
            foreach ($words as $w) {
            $word = Word::where('id', $w['id'])->update([
                                  'word' => $w['word'],
                                  'phonetic'=>$w['phonetic'],
                                   ]);
            foreach ($w['means'] as $mean) {
                    WordMean::create(['lesson_id'=>$lessonId,
                                      'word_id' => $w['id'],
                                      'language_id' => $mean['language_id'],
                                      'mean' => $mean['mean'] ]);
                }
              }
           });
           foreach ($validated['removed'] as $word) {
              Word::where('id', $word['id'])->delete();
           }
           return response()->json(['success' => true]); 
    }

    /*public function getLessonsCards(Request $request){

        $validated = $request->validate([
            'fieldId' => ['nullable', 'integer'],
            'recent' => ['nullable', 'boolean'],
            'authorId' => ['nullable', 'integer'],
            'search' => ['nullable', 'string'],
        ]);

        //$lessons = Lesson::all();
        $lessons = Lesson::whereIn('status', ['raw', 'published'])->with(['author:id,name','fields:id,name'])
          ->select('id', 'author_id', 'title', 'img_path', 'abstract', 'status')
          ->get();

        $result = $lessons->map(function ($lesson) {
            return [
        'id' => $lesson->id,
        'author_id' => $lesson->author_id,
        'author_name' => $lesson->author->name ?? "",
        'title' => $lesson->title,
        'img_path' => $lesson->img_path,
        'abstract' => $lesson->abstract,
        'fields' => $lesson->fields->map(fn($field) => [
            'id' => $field->id,
            'name' => $field->name, 
        ]),
        'status' => $lesson->status,
        ];
       });
        return response()->json($result); 
    }*/

    public function getLessonFields(Request $request){

        //Log::debug("I am here: ". $request->lessonId);
        
        $fields = Lesson::where('id', $request->lessonId)->first()->fields()->get();
        return response()->json(['fields' => $fields]);
    }

    public function getLesson(Request $request){
        
        $lesson = Lesson::where('id', $request->lessonId)
        ->select('id', 'author_id', 'title', 'img_path', 'abstract', 
            'video1', 'video1_text', 'tech_term_body', 'text_p21', 'text_p22', 'text_p23'
            , 'text_p24', 'text_p25')->first();
        return response()->json(['lesson' => $lesson]);
    }

    public function getWords(Request $request){
        
        $words = Word::where('lesson_id', $request->lessonId)
        ->with('means:id,word_id,language_id,mean')
        ->select('id', 'word', 'phonetic')->get();

        return response()->json(['words' => $words]);
    }

    public function getTechWords(Request $request){
        
        $words = TechWord::where('lesson_id', $request->lessonId)
        ->select('id', 'part', 'word', 'phonetic', 'mean')->get();

        return response()->json(['words' => $words]);
    }

    public function getRawDDTestId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = DefDetectTest::create(['lesson_id'=>$validated['lessonId'], 'word'=>'', 'text1'=>'', 'text2'=>'', 'text3'=>'', 'answer'=>0]);
        return response()->json(['success' => true, 'id' => $test->id]);
    }

    public function getRawWdmTestId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = WdmTest::create(['lesson_id'=>$validated['lessonId'], 'body'=>'', 'answer'=>'']);
        return response()->json(['success' => true, 'id' => $test->id]);
    }

    public function getRawWordId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $word = Word::create(['lesson_id'=>$validated['lessonId'],
         'word'=>'', 'phonetic'=>'']);
        return response()->json(['success' => true, 'id' => $word->id]);
    }

    public function getRawTechWordId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $word = TechWord::create(['lesson_id'=>$validated['lessonId'],
         'word'=>'', 'phonetic'=>'']);
        return response()->json(['success' => true, 'id' => $word->id]);
    }

    public function getRawTestWriteId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = TestWrite::create(['lesson_id'=>$validated['lessonId'], 'body'=>""]);
        return response()->json(['success' => true, 'id' => $test->id]);


    }

    public function updateTestWrites(Request $request){

        $validated = $request->validate([
        'authorId' => ['required', 'integer'/*, 'exists:users,id'*/],
        'lessonId' => ['required', 'integer'/*, 'exists:lessons,id'*/],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.body' => ['required', 'string'],
        'removed' => ['nullable', 'array'],
    ]);

        foreach ($validated['tests'] as $test) {
        TestWrite::where('id', $test['id'])->update([
            'body' => $test['body'],
        ]);
    }

    foreach ($validated['removed'] as $test) {
        TestWrite::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);
    }

    public function getLessonTestWrites(Request $request){
        $tests = TestWrite::where('lesson_id', $request->lessonId)
        ->select('id', 'body')->get(); 
        return response()->json(['tests' => $tests]); 
    }

    public function getRawTestFillId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = TestFill::create(['lesson_id'=>$validated['lessonId'], 'body'=>'', 'fill1'=>'', 'fill2'=> '']);
        return response()->json(['success' => true, 'id' => $test->id]);
    }

    public function updateTestFills(Request $request){

      $validated = $request->validate([
        'authorId' => ['required', 'integer'],
        'lessonId' => ['required', 'integer'],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.body' => ['nullable', 'string'],
        'tests.*.fill1' => ['nullable', 'string'],
        'tests.*.fill2' => ['nullable', 'string'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
        'removed.*.body' => ['nullable', 'string'],
        'removed.*.fill1' => ['nullable', 'string'],
        'removed.*.fill2' => ['nullable', 'string'],
    ]);

        foreach ($validated['tests'] as $test) {
        TestFill::where('id', $test['id'])->update([
            'body' => $test['body'], 'fill1' => $test['fill1'], 'fill2' => $test['fill2'],
        ]);
    }

    foreach ($validated['removed'] as $test) {
        TestFill::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);
    }

    public function getLessonTestFills(Request $request){
        $tests = TestFill::where('lesson_id', $request->lessonId)
        ->select('id', 'body', 'fill1', 'fill2')->get();

        return response()->json(['tests' => $tests]);

    }

    public function getRawTestTFId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = TestTf::create(['lesson_id'=>$validated['lessonId'], 'body'=>""]);
        return response()->json(['success' => true, 'id' => $test->id]);
    }

    public function updateTestTFs(Request $request){

      $validated = $request->validate([
        'authorId' => ['required', 'integer'],
        'lessonId' => ['required', 'integer'],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.body' => ['nullable', 'string'],
        'tests.*.answer' => ['nullable', 'boolean'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
        'removed.*.body' => ['nullable', 'string'],
        'removed.*.answer' => ['nullable', 'boolean'],
    ]);

        foreach ($validated['tests'] as $test) {
        TestTf::where('id', $test['id'])->update([
            'body' => $test['body'], 'answer' => $test['answer'],
        ]);
    }

    foreach ($validated['removed'] as $test) {
        TestTf::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);
    }

    public function getLessonTestTFs(Request $request){
        $tests = TestTf::where('lesson_id', $request->lessonId)
        ->select('id', 'body', 'answer')->get();

        return response()->json(['tests' => $tests]);
    }

    public function getRawTestReplyId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = TestReply::create(['lesson_id'=>$validated['lessonId'], 'body'=>""]);
        return response()->json(['success' => true, 'id' => $test->id]);
    }

    public function updateTestReplies(Request $request){
        $validated = $request->validate([
        'authorId' => ['required', 'integer'],
        'lessonId' => ['required', 'integer'],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.body' => ['nullable', 'string'],
        'tests.*.reply1' => ['nullable', 'string'],
        'tests.*.reply2' => ['nullable', 'string'],
        'tests.*.reply3' => ['nullable', 'string'],
        'tests.*.answer' => ['nullable', 'integer'],
        'tests.*.desc1' => ['nullable', 'string'],
        'tests.*.desc2' => ['nullable', 'string'],
        'tests.*.desc3' => ['nullable', 'string'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
        'removed.*.body' => ['nullable', 'string'],
        'removed.*.reply1' => ['nullable', 'string'],
        'removed.*.reply2' => ['nullable', 'string'],
        'removed.*.reply3' => ['nullable', 'string'],
        'removed.*.answer' => ['nullable', 'integer'],
        'removed.*.desc1' => ['nullable', 'string'],
        'removed.*.desc2' => ['nullable', 'string'],
        'removed.*.desc3' => ['nullable', 'string'],
    ]);

        foreach ($validated['tests'] as $test) {
        TestReply::where('id', $test['id'])->update([
            'body' => $test['body'], 'reply1'=> $test['reply1'], 'reply2'=> $test['reply2'],
             'reply3'=> $test['reply3'], 'answer' => $test['answer'], 'desc1'=> $test['desc1'],
             'desc2'=> $test['desc2'], 'desc3'=> $test['desc3'],
        ]);
    }

    foreach ($validated['removed'] as $test) {
        TestReply::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);
    }

        public function updateDDTests(Request $request){
        $validated = $request->validate([
        'authorId' => ['required', 'integer'],
        'lessonId' => ['required', 'integer'],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.word' => ['nullable', 'string'],
        'tests.*.part' => ['nullable', 'integer'],
        'tests.*.text1' => ['nullable', 'string'],
        'tests.*.text2' => ['nullable', 'string'],
        'tests.*.text3' => ['nullable', 'string'],
        'tests.*.answer' => ['nullable', 'integer'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
        'removed.*.word' => ['nullable', 'string'],
        'removed.*.part' => ['required', 'integer'],
        'removed.*.text1' => ['nullable', 'string'],
        'removed.*.text2' => ['nullable', 'string'],
        'removed.*.text3' => ['nullable', 'string'],
        'removed.*.answer' => ['nullable', 'integer'],
    ]);

        foreach ($validated['tests'] as $test) {
        DefDetectTest::where('id', $test['id'])->update([
             'word'=> $test['word'], 'part'=> $test['part'], 'text1'=> $test['text1'],
              'text2'=> $test['text2'],
             'text3'=> $test['text3'], 'answer' => $test['answer']
        ]);
    }

    foreach ($validated['removed'] as $test) {
        DefDetectTest::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);
    }

    public function updateWdmTests(Request $request){
        $validated = $request->validate([
        'authorId' => ['required', 'integer'],
        'lessonId' => ['required', 'integer'],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.part' => ['nullable', 'integer'],
        'tests.*.body' => ['nullable', 'string'],
        'tests.*.answer' => ['nullable', 'string'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
        'removed.*.word' => ['nullable', 'string'],
        'removed.*.part' => ['required', 'integer'],
        'removed.*.body' => ['nullable', 'string'],
        'removed.*.answer' => ['nullable', 'string'],
    ]);

        foreach ($validated['tests'] as $test) {
        WdmTest::where('id', $test['id'])->update([
             'body'=> $test['body'], 'part'=> $test['part'], 'answer' => $test['answer']
        ]);
    }

    foreach ($validated['removed'] as $test) {
        WdmTest::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);
    }

    public function getLessonTestReplies(Request $request){

        $tests = TestReply::where('lesson_id', $request->lessonId)
        ->select('id', 'body', 'reply1', 'reply2', 'reply3', 'answer',
            'desc1', 'desc2', 'desc3')->get();

        return response()->json(['tests' => $tests]);

    }

    public function getLessonDDTests(Request $request){

        $tests = DefDetectTest::where('lesson_id', $request->lessonId)
        ->select('id', 'word', 'part', 'text1', 'text2', 'text3', 'answer')->get();
        return response()->json(['tests' => $tests]);
    }

    public function getLessonWdmTests(Request $request){

        $tests = WdmTest::where('lesson_id', $request->lessonId)
        ->select('id', 'part', 'body', 'answer')->get();
        return response()->json(['tests' => $tests]);
    }

    public function getRawTestAssId(Request $request){
        $validated = $request->validate([
            'authorId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
        ]);
        $lesson_exists = Lesson::where('id', $validated['lessonId'])->exists();
        if(!$lesson_exists){
            return response()->json(['success' => false]);
        }
        $test = TestAss::create(['lesson_id'=>$validated['lessonId'], 'body'=>""]);
        return response()->json(['success' => true, 'id' => $test->id]);
    }

    public function updateTestAsses(Request $request){
        $validated = $request->validate([
        'authorId' => ['required', 'integer'],
        'lessonId' => ['required', 'integer'],
        'tests' => ['nullable', 'array'],
        'tests.*.id' => ['required', 'integer'],
        'tests.*.body' => ['nullable', 'string'],
        'tests.*.opt1' => ['nullable', 'string'],
        'tests.*.opt2' => ['nullable', 'string'],
        'tests.*.opt3' => ['nullable', 'string'],
        'tests.*.opt4' => ['nullable', 'string'],
        'tests.*.answer' => ['nullable', 'integer'],
        'removed' => ['nullable', 'array'],
        'removed.*.id' => ['required', 'integer'],
        'removed.*.body' => ['nullable', 'string'],
        'removed.*.opt1' => ['nullable', 'string'],
        'removed.*.opt2' => ['nullable', 'string'],
        'removed.*.opt3' => ['nullable', 'string'],
        'removed.*.opt4' => ['nullable', 'string'],
        'removed.*.answer' => ['nullable', 'integer'],
    ]);

        foreach ($validated['tests'] as $test) {
        TestAss::where('id', $test['id'])->update([
            'body' => $test['body'], 'opt1'=> $test['opt1'], 'opt2'=> $test['opt2'],
             'opt3'=> $test['opt3'], 'opt4'=> $test['opt4'],
              'answer' => $test['answer'],
        ]);
    }

    foreach ($validated['removed'] as $test) {
        TestAss::where('id', $test['id'])->delete();
    }

    return response()->json(['success' => true]);

    }

    public function getLessonTestAsses(Request $request){
        $tests = TestAss::where('lesson_id', $request->lessonId)
        ->select('id', 'body', 'opt1', 'opt2', 'opt3', 'opt4', 'answer')->get();

        return response()->json(['tests' => $tests]);
    }

    public function archiveLesson(Request $request){
        $validated = $request->validate([
        'lessonId' => ['required', 'integer'],
    ]);
        Lesson::where('id', $validated['lessonId'])->update(['status'=>'archived']);
        return response()->json(['success' => true]); 
    }

    public function changeLessonStatus(Request $request){
        $validated = $request->validate([
        'lessonId' => ['required', 'integer'],
        'status' => ['required', 'string'],
        ]);
        Lesson::where('id', $validated['lessonId'])->update(['status' => $validated['status']]);
        return response()->json(['success' => true]);

    }

    public function getLessonsCardsByField(Request $request){
        $validated = $request->validate([
            'fieldId' => ['nullable', 'integer'],
            'recent' => ['nullable', 'boolean'],
            'authorId' => ['nullable', 'integer'],
            'search' => ['nullable', 'string'],
        ]);

        //$lessons = Lesson::all();
        $f_id = $validated['fieldId'];
        $lessons = Lesson::whereIn('status', ['raw', 'published'])
        ->whereHas('fields', function ($query) use ($f_id) {
        $query->where('id', $f_id);
        })->with(['author:id,name',
                  'fields' => function ($q) use ($f_id) {
                        $q->where('fields.id', $f_id)
                        ->select('fields.id') // minimal
                        ->withPivot('lesson_order');
        }])
          ->select('id', 'author_id', 'title', 'img_path', 'abstract', 'status')
          ->get();

        $result = $lessons->map(function ($lesson) {
            $field = $lesson->fields->first(); // only one exists
            return [
        'id' => $lesson->id,
        'author_id' => $lesson->author_id,
        'author_name' => $lesson->author->name ?? "",
        'title' => $lesson->title,
        'img_path' => $lesson->img_path,
        'abstract' => $lesson->abstract,
        'order' => $field?->pivot->lesson_order,
        'status' => $lesson->status,
        ];
       });
        return response()->json($result); 
    }

    public function updateLessonsOrders(Request $request){
        $validated = $request->validate([
            'fieldId' => ['required', 'integer'],
            'lessons' => ['required', 'array', 'min:1'],    
        ]);
        DB::transaction(function () use ($validated) {
          foreach ($validated['lessons'] as $lesson) {
          FieldLesson::where('field_id', $validated['fieldId'])
            ->where('lesson_id', $lesson['id'])
            ->update([
                'lesson_order' => $lesson['order'], // start from 1
            ]);
         }
        });
    }

    public function getInteractiveWords(Request $request){
        $validated = $request->validate([
            'userId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
            'fieldId' => ['required', 'integer'],
        ]);

        $userId = auth()->id();
        $words = UIWord::query()
        ->where('lesson_id', $validated['lessonId'])
        ->select(
            'word',
            'word_id',
            DB::raw('COUNT(*) as count'),
            DB::raw(
                'MAX(CASE WHEN user_id = ' . (int) $userId . ' THEN 1 ELSE 0 END) as user_selected'
            )
        )
        ->groupBy('word', 'word_id')
        ->get()
        ->map(function ($item) {
            return [
                'word'          => $item->word,
                'word_id'       => $item->word_id,
                'count'         => (int) $item->count,
                'user_selected' => (bool) $item->user_selected,
            ];
        });

        return response()->json(['words'=>($words ?? [])]);
    }


} 




