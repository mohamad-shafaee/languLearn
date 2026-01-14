<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FieldUser;
use App\Models\Field;
use App\Models\User;
use App\Models\UIWord;
use App\Models\TestWrite;
use App\Models\AnswerTw;
use App\Models\UserTtw;
use App\Models\DefDetectTest;
use App\Models\WdmTest;
use App\Models\TestFill;
use App\Models\AnswerTf;
use Illuminate\Support\Facades\Log;

class FLUController extends Controller
{
    
    public function uploadUserFields(Request $request){

        $validated = $request->validate([
            'userId' => ['required', 'integer'],
            'addFields' => ['nullable', 'array'],
            'addFields.*.id' => ['required', 'integer'],
            'removedFields' => ['nullable', 'array'],
            'removedFields.*.id' => ['required', 'integer'],
            //'fields.*.name' => ['nullable', 'string'],
            //'fields.*.img_path' => ['nullable', 'string'],
            //'fields.*.description' => ['nullable', 'string'],
        ]);

        $add_fields = $validated['addFields'] ?? [];
        $rm_fields = $validated['removedFields'] ?? [];
        
            foreach($add_fields as $field){
            FieldUser::updateOrCreate(['field_id'=>$field['id'], 'user_id' => $validated['userId']],['priority' => 1]); //(priority) 1: working, 10: archived
        }
        

        
            foreach($rm_fields as $field){
            FieldUser::updateOrCreate(['field_id'=>$field['id'], 'user_id' => $validated['userId']],['priority' => 10]); 
        }
        
        
        return response()->json(['success' => true]);
    }

    public function getUserFields(Request $request){
        $validated = $request->validate([
            'userId' => ['required', 'integer'],
        ]);

        //$fields = $request->user()->fields;
        //$fields = $request->user()->fields()->where('priority', '<', 9)->get();

        $user = User::with(['fields' => function ($qf) {
            $qf->where('priority', '<', 9);
        }])->findOrFail($validated['userId']);
        $fields = $user->fields->map(function ($field) {

            return [
                'id' => $field->id,
                'name' => $field->name,
                'img_path' => $field->img_path,
                'description' => $field->description,
                'has_order' => $field->has_order,
                'last_lesson_id' => $field->pivot->last_lesson_id,
                'last_lesson_stat' => $field->pivot->last_lesson_stat,

            ];
        });
       return response()->json(['data' => $fields]);

    }

    public function getUserLessonsByField(Request $request){
        $validated = $request->validate([
            'userId' => ['required', 'integer'],
            'fieldId' => ['required', 'integer'],
        ]);
        
        //$field = Field::find($validated['fieldId']);
        //$lessons = $field->lessons()->where('status', 'published')->get();

        $field = Field::with(['lessons' => function ($q) use ($validated) {
            $q->where('status', 'published')
            ->with([
                'users' => function ($uq) use ($validated) {
                    $uq->where('users.id', $validated['userId']);
                }
            ]);

        }])->findOrFail($validated['fieldId']);
        $lessons = $field->lessons->map(
            function ($lesson){
                $user = $lesson->users->first();
                return [
                    'id' =>       $lesson->id,
                    'title' =>    $lesson->title,
                    'img_path' => $lesson->img_path,
                    'abstract' => $lesson->abstract,
                    'order' =>    $lesson->pivot->lesson_order,
                    'score' =>    $user ? $user->pivot->score : null, 
                ];
            }); 

       return response()->json(['data' => $lessons]);
    }

    public function saveUserInteractiveWords(Request $request){
        $validated = $request->validate([
            'userId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
            'fieldId' => ['required', 'integer'],
            'words' => ['nullable', 'array'],
            'words.*.id' => ['required', 'integer'],
            'words.*.word' => ['required', 'string'],
        ]);

        $words = $validated['words'] ?? [];
        foreach($words as $word){
            UIWord::updateOrCreate(['user_id'   => auth()->id(),
            'field_id'  => $validated['fieldId'],'lesson_id' => $validated['lessonId'],
            'word_id'   => $word['id']],['word' => $word['word']]);
        }

        return response()->json(['success' => true]);
    }

    public function getUsrTestWrites(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);
        $user_id = auth()->id();
        $tests = TestWrite::where('lesson_id', $validated['lessonId'])
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {
            return [
                'id' => $test->id,
                'body' => $test->body,
                'usr_answer' => optional($test->answers->first())->answer ?? '',
            ];
        });

        return response()->json(['tests' => $tests]);

    }

    public function saveUsrTestWriteAnswer(Request $request){
        $validated = $request->validate([
            'testId' => ['required', 'integer'],
            'lessonId' => ['required', 'integer'],
            'answer' => ['nullable', 'string'],
        ]);

        AnswerTw::updateOrCreate(['user_id' => auth()->id(), 
        'lesson_id'=> $validated['lessonId'], 'test_write_id' => $validated['testId']],
         ['answer'=>$validated['answer']]);

        return response()->json(['success' => true]);
    }

    public function getUserStaredWords(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'part' => ['required', 'integer'],
        ]);

        $words = UserTtw::where('user_id', auth()->id())
        ->where('lesson_id', $validated['lessonId'])
        ->where('part', $validated['part'])
        ->select('word_id', 'status', 'learned')->get();

        return response()->json(['words' => $words]);

    }

    public function saveUserStaredWords(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'part' => ['required', 'integer'],
            'words' => ['nullable', 'array'],
        ]);

        UserTtw::where('user_id', auth()->id())
        ->where('lesson_id', $validated['lessonId'])
        ->where('part', $validated['part'])
        ->delete();
        $data = [];
        $words = $validated['words'];

        foreach ($words as $word) {
           $data[] = [
            'user_id'   => auth()->id(),
            'lesson_id' => $validated['lessonId'],
            'word_id'   => $word['word_id'],
            'part'      => $validated['part'],
            'status'    => $word['status'],
            'learned'   => $word['learned'],
            'created_at' => now(),
            'updated_at' => now(),
          ];
        }

        UserTtw::insert($data);
        return response()->json(['success' => true]);

    }

    public function getUsrDDTests(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);
        $tests = DefDetectTest::where('lesson_id', $validated['lessonId'])->select('id', 'word', 'part', 
            'text1', 'text2', 'text3', 'answer')->get();

        return response()->json(['tests' => $tests]);
    }

        public function getUsrWdmTests(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);
        $tests = WdmTest::where('lesson_id', $validated['lessonId'])
        ->select('id', 'part', 'body', 'answer')
        ->get();

        return response()->json(['tests' => $tests]);
    }

    public function getUsrTestFills(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $user_id = auth()->id();
        $tests = TestFill::where('lesson_id', $validated['lessonId'])
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {
            return [
                'id' => $test->id,
                'body' => $test->body,
                'fill1' => $test->fill1,
                'fill2' => $test->fill2,
                'usr_answer1' => optional($test->answers->first())->answer1 ?? '',
                'usr_answer2' => optional($test->answers->first())->answer2 ?? '',
            ];
        });

        return response()->json(['tests' => $tests]); 
    }

    public function saveUsrTestFillsAnswer(Request $request)
    {
        
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'tests' => ['nullable', 'array'],
            'tests.*.id' => ['required', 'integer'],
            'tests.*.body' => ['required', 'string'],
            'tests.*.fill1' => ['required', 'string'],
            'tests.*.fill2' => ['nullable', 'string'],
            'tests.*.usr_answer1' => ['required', 'string'],
            'tests.*.usr_answer2' => ['nullable', 'string'],
        ]);

        $data = [];
        $tests = $validated['tests'];

        foreach ($tests as $test) {
           $data[] = [
            'user_id'   => auth()->id(),
            'lesson_id' =>  $validated['lessonId'],//$request['lessonId'],
            'test_fill_id'   => $test['id'],
            'answer1'      => $test['usr_answer1'],
            'answer2'      => $test['usr_answer2'] ?? '',
            'created_at' => now(),
            'updated_at' => now(),
          ];
        }

        AnswerTf::where('user_id', auth()->id())->where('lesson_id', $validated['lessonId'])->delete();

        AnswerTf::insert($data);
        return response()->json(['success' => true]);


        
    }


}
