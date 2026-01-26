<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FieldUser;
use App\Models\FieldLesson;
use App\Models\Field;
use App\Models\User;
use App\Models\UserLs;
use App\Models\UIWord;
use App\Models\TestWrite;
use App\Models\AnswerTw;
use App\Models\UserTtw;
use App\Models\DefDetectTest;
use App\Models\WdmTest;
use App\Models\TestFill;
use App\Models\TestReply;
use App\Models\TestAss;
use App\Models\TestTf;
use App\Models\AnswerTf;
use App\Models\AnswerTtf;
use App\Models\AnswerTa;
use App\Models\AnswerTr;
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
                $f = Field::with(['lessons'])->findOrFail($field['id']);
                $lesson_ids = $f->lessons->map(function ($lesson){
                    return $lesson->id;
                });
                $first_lesson_id = $this->findFirstLessonId($lesson_ids->toArray());
                FieldUser::updateOrCreate(['field_id'=>$field['id'], 'user_id' => $validated['userId']],['priority' => 1, 'last_lesson_id'=>$first_lesson_id]); //(priority) 1: working, 10: archived
        } 
            foreach($rm_fields as $field){
            FieldUser::updateOrCreate(['field_id'=>$field['id'], 'user_id' => $validated['userId']],['priority' => 10]); 
        } 
        return response()->json(['success' => true]);
    }

    public function findFirstLessonId($lesson_ids){
        
        return min($lesson_ids);
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
            ];
        });
       return response()->json(['data' => $fields]);

    }

    public function getUserLessonsByField(Request $request){
        $validated = $request->validate([
            'userId' => ['required', 'integer'],
            'fieldId' => ['required', 'integer'],
        ]);

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

    public function getUsrTestTFs(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $user_id = auth()->id();
        $tests = TestTf::where('lesson_id', $validated['lessonId'])
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {
            return [
                'id' => $test->id,
                'body' => $test->body,
                'answer' => $test->answer,
                'usr_answer' => optional($test->answers->first())->answer,
            ];
        });

        return response()->json(['tests' => $tests]); 
    }

    public function saveUsrTestTFsAnswer(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'tests' => ['nullable', 'array'],
            'tests.*.id' => ['required', 'integer'],
            'tests.*.body' => ['required', 'string'],
            'tests.*.answer' => ['required', 'boolean'],
            'tests.*.usr_answer' => ['nullable', 'boolean'],
        ]);

        $data = [];
        $tests = $validated['tests'];

        foreach ($tests as $test) {
           $data[] = [
            'user_id'   => auth()->id(),
            'lesson_id' =>  $validated['lessonId'],
            'test_tf_id'   => $test['id'],
            'answer'      => $test['usr_answer'],
            'created_at' => now(),
            'updated_at' => now(),
          ];
        }

        AnswerTtf::where('user_id', auth()->id())->where('lesson_id', $validated['lessonId'])->delete();

        AnswerTtf::insert($data);
        return response()->json(['success' => true]); 
    } 

    public function getUsrTestReplies(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $user_id = auth()->id();
        $tests = TestReply::where('lesson_id', $validated['lessonId'])
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {
            return [
                'id' => $test->id,
                'body' => $test->body,
                'reply1' => $test->reply1,
                'reply2' => $test->reply2,
                'reply3' => $test->reply3,
                'answer' => $test->answer,
                'desc1' => $test->desc1,
                'desc2' => $test->desc2,
                'desc3' => $test->desc3,
                'usr_answer' => optional($test->answers->first())->answer,
            ];
        });

        return response()->json(['tests' => $tests]); 
    }

    public function saveUsrTestRepliesAnswer(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'tests' => ['nullable', 'array'],
            'tests.*.id' => ['required', 'integer'],
            'tests.*.usr_answer' => ['required', 'integer'],
        ]);

        $data = [];
        $tests = $validated['tests'];

        foreach ($tests as $test) {
           $data[] = [
            'user_id'   => auth()->id(),
            'lesson_id' =>  $validated['lessonId'],
            'test_reply_id'   => $test['id'],
            'answer'      => $test['usr_answer'],
            'created_at' => now(),
            'updated_at' => now(),
          ];
        }

        AnswerTr::where('user_id', auth()->id())->where('lesson_id', $validated['lessonId'])->delete();

        AnswerTr::insert($data);
        return response()->json(['success' => true]); 
    } 

    public function getUsrTestAsses(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $user_id = auth()->id();
        $tests = TestAss::where('lesson_id', $validated['lessonId'])
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {
            return [
                'id' => $test->id,
                'body' => $test->body,
                'opt1' => $test->opt1,
                'opt2' => $test->opt2,
                'opt3' => $test->opt3,
                'opt4' => $test->opt4,
                'usr_answer' => optional($test->answers->first())->answer,
            ];
        });

        return response()->json(['tests' => $tests]); 
    } 

    public function saveUsrTestAssesAnswer(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'tests' => ['nullable', 'array'],
            'tests.*.id' => ['required', 'integer'],
            'tests.*.usr_answer' => ['nullable', 'integer'],
        ]);

        $data = [];
        $tests = $validated['tests'];

        foreach ($tests as $test) {
           $data[] = [
            'user_id'   => auth()->id(),
            'lesson_id' =>  $validated['lessonId'],
            'test_ass_id'   => $test['id'],
            'answer'      => $test['usr_answer'],
            'created_at' => now(),
            'updated_at' => now(),
          ];
        }

        AnswerTa::where('user_id', auth()->id())->where('lesson_id', $validated['lessonId'])->delete();

        AnswerTa::insert($data);
        return response()->json(['success' => true]);
    } 

    public function getUsrTestAssesScore(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $res = $this->calcUsrTestAssesScore($validated['lessonId']);
        return response()->json($res);
    }

    public function getUsrTestRepliesScore(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $res = $this->calcUsrTestRepliesScore($validated['lessonId']);
        return response()->json($res);
    }

    public function getUsrTestTFsScore(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $res = $this->calcUsrTestTFsScore($validated['lessonId']);
        return response()->json($res);
    }

    public function getUsrTestFillsScore(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
        ]);

        $res = $this->calcUsrTestFillsScore($validated['lessonId']);
        return response()->json($res);
    }

    public function updateFieldAndLessonUsrStatus(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'fieldId' => ['required', 'integer'],
        ]);

        $scores = $this->checkFieldAndLessonUsrStatus($validated['lessonId']);
        $passed = false;
        $fill_sc = $scores['fill']['correct']/$scores['fill']['all'];
        $reply_sc = $scores['reply']['correct']/$scores['reply']['all'];
        $tf_sc = $scores['tf']['correct']/$scores['tf']['all'];
        $ass_sc = $scores['ass']['correct']/$scores['ass']['all'];
        if($fill_sc >= 0.7 && $reply_sc >= 0.7 && $tf_sc >= 0.7 && $ass_sc >= 0.7){
            $passed = true;
        }
 
        if(!$passed){ return response()->json(['passed'=> $passed]); }

        $fl = FieldLesson::where('field_id', $validated['fieldId'])
        ->where('lesson_id', $validated['lessonId'])->first();

        $fu = FieldUser::where('user_id', auth()->id())->where('field_id', $validated['fieldId'])->first();
        $prev_last_lesson_id = 0;
        if($fu){
            $prev_last_lesson_id = $fu->last_lesson_id;
        }

        if($prev_last_lesson_id == $validated['lessonId']){
            $next_lesson_id = FieldLesson::where('field_id', $validated['fieldId'])
            ->where('lesson_id', '>', $validated['lessonId'])
            ->orderBy('lesson_id', 'asc')->first()->lesson_id;
            FieldUser::updateOrCreate(['field_id'=> $validated['fieldId'], 'user_id'=> auth()->id()],
                 ['last_lesson_id'=> $next_lesson_id]);

        }

             Log::debug("Scores 3 ". $scores['fill']['correct'] . " *** ". $scores['fill']['all']);

             $mean_sc = ($fill_sc + $reply_sc + $tf_sc + $ass_sc)/4;
             Log::debug("Scores mean ". $mean_sc);
             UserLs::updateOrCreate(['user_id'=> auth()->id(),
              'lesson_id'=> $validated['lessonId']], ['score'=> $mean_sc]);

        return response()->json(['passed'=> $passed]);
    }



    public function checkFieldAndLessonUsrStatus($lessonId){

        $fill_score = $this->calcUsrTestFillsScore($lessonId);
        $reply_score = $this->calcUsrTestRepliesScore($lessonId);
        $tf_score = $this->calcUsrTestTFsScore($lessonId);
        $ass_score = $this->calcUsrTestAssesScore($lessonId);

        $scores = ['fill'=>['all'=>$fill_score['all'], 'correct'=>$fill_score['correct']],
                   'reply'=>['all'=>$reply_score['all'], 'correct'=>$reply_score['correct']],
                   'tf'=>['all'=>$tf_score['all'], 'correct'=>$tf_score['correct']],
                   'ass'=>['all'=>$ass_score['all'], 'correct'=>$ass_score['correct']]
               ];

        //return $passed;
        return $scores;
    } 

    public function calcUsrTestFillsScore($lessonId){

        $user_id = auth()->id();
        $score_arr = TestFill::where('lesson_id', $lessonId)
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {

            $is_wrong = ($test->answers->first() && 
                ($test->fill1 != $test->answers->first()->answer1 ||
                $test->fill2 != $test->answers->first()->answer2)) ? 1 : 0;

            $is_correct = ($test->fill1 == optional($test->answers->first())->answer1 &&
                $test->fill2 == optional($test->answers->first())->answer2);

            return [
                'correct_i' => $is_correct ? 1 : 0,
                'wrong_i' => $is_wrong,
            ];
        });
        $corrects = 0;
        $wrongs = 0;
        foreach($score_arr as $sc){
            $corrects = $corrects + $sc['correct_i'];
            $wrongs = $wrongs + $sc['wrong_i'];
        }

        $all = $score_arr->count();
        $res = ['all'=> $all, 'wrong'=> $wrongs, 'correct'=> $corrects];
        return $res;
    }

    public function calcUsrTestTFsScore($lessonId){

        $user_id = auth()->id();
        $score_arr = TestTf::where('lesson_id', $lessonId)
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {

            $is_wrong = ($test->answers->first() && 
                $test->answer != $test->answers->first()->answer) ? 1 : 0;

            return [
                'correct_i' => $test->answer == optional($test->answers->first())->answer ? 1 : 0,
                'wrong_i' => $is_wrong,
            ];
        });
        $corrects = 0;
        $wrongs = 0;
        foreach($score_arr as $sc){
            $corrects = $corrects + $sc['correct_i'];
            $wrongs = $wrongs + $sc['wrong_i'];
        }

        $all = $score_arr->count();
        $res = ['all'=> $all, 'wrong'=> $wrongs, 'correct'=> $corrects];
        return $res;
    }

    public function calcUsrTestRepliesScore($lessonId){

        $user_id = auth()->id();
        $score_arr = TestReply::where('lesson_id', $lessonId)
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {

            $is_wrong = (optional($test->answers->first())->answer && 
                $test->answer != optional($test->answers->first())->answer) ? 1 : 0;

            return [
                'correct_i' => $test->answer == optional($test->answers->first())->answer ? 1 : 0,
                'wrong_i' => $is_wrong,
            ];
        });
        $corrects = 0;
        $wrongs = 0;
        foreach($score_arr as $sc){
            $corrects = $corrects + $sc['correct_i'];
            $wrongs = $wrongs + $sc['wrong_i'];
        }

        $all = $score_arr->count();
        $res = ['all'=> $all, 'wrong'=> $wrongs, 'correct'=> $corrects];
        return $res;
    }

    public function calcUsrTestAssesScore($lessonId){

        $user_id = auth()->id();
        $score_arr = TestAss::where('lesson_id', $lessonId)
        ->with(['answers'=> function ($q) use ($user_id) {
            $q->where('user_id', $user_id);
        }])->get()
        ->map(function ($test) {

            $is_wrong = (optional($test->answers->first())->answer && 
                $test->answer != optional($test->answers->first())->answer) ? 1 : 0;

            return [
                'correct_i' => $test->answer == optional($test->answers->first())->answer ? 1 : 0,
                'wrong_i' => $is_wrong,
            ];
        });
        $corrects = 0;
        $wrongs = 0;
        foreach($score_arr as $sc){
            $corrects = $corrects + $sc['correct_i'];
            $wrongs = $wrongs + $sc['wrong_i'];
        }

        $all = $score_arr->count();
        $res = ['all'=> $all, 'wrong'=> $wrongs, 'correct'=> $corrects];
        return $res;
    }

    public function isLessonOpenToUser(Request $request){
        $validated = $request->validate([
            'lessonId' => ['required', 'integer'],
            'fieldId' => ['required', 'integer'],
        ]);

        $is_premium = User::find(auth()->id())->isPremium();

        if($is_premium){
            return response()->json(['is_open'=> true]);
        }

        $fl = FieldLesson::where('field_id', $validated['fieldId'])
        ->where('lesson_id', $validated['lessonId'])->first();

        $is_open = false;

        if($fl){
            $is_open = $fl->is_open;
        }

        return response()->json(['is_open'=> $is_open]);
    }





}
