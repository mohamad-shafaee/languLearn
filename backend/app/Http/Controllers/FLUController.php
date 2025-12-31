<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FieldUser;
use App\Models\Field;
use App\Models\User;
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


}
