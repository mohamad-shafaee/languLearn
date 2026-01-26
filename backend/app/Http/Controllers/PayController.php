<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Plan;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PayController extends Controller {


    public function getUserPlansDetails(Request $request){
        /*$validated = $request->validate([
            'userId' => ['required', 'integer'],
        ]);*/ 

      $plans = Plan::whereNull('inactivated_at')->where('status', 'usual')
      ->select('id', 'name', 'color', 'fields', 'price', 'currency', 
            'interval', 'description', 'provider')->get();

         return response()->json(['plans' => $plans]);
    }
 
    public function getUserSubscriptionsDetails(Request $request){
        /*$validated = $request->validate([
            'userId' => ['required', 'integer'],
        ]);*/

        $subscriptions = auth()->user()
        ->subscriptions()
        ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
        ->where(function ($q) {
                $q->whereNull('subscriptions.ends_at')
                ->orWhere('subscriptions.ends_at', '>', now());
        })
        ->select('subscriptions.id' ,'plans.name as plan_name', 'subscriptions.ends_at')
        ->get()
        ->toArray();

        return response()->json(['subscriptions' => $subscriptions]);


    }

    public function getPlansForAdmins(Request $request){
        /*$validated = $request->validate([
            'userId' => ['required', 'integer'],
        ]);*/

        $plans = Plan::select('id', 'name', 'color', 'fields', 'price', 'currency', 
            'interval', 'description', 'provider', 'provider_plan_id', 'inactivated_at')
        ->where('status', 'usual')->get();
         return response()->json(['plans' => $plans]);
    }

    public function takePlanId(Request $request){
        $author_id = request()->input('authorId');
        $plan = Plan::where('author_id', $author_id)->where('name', '')
        ->where('price', 0)->where('description', '')->first();
        if($plan){
        return response()->json(['success'=> true, 'id'=>$plan->id]);
        }
        $plan = Plan::create([
            'name' => '',
            'color' => '',
            'fields' => 3,
            'author_id' => $author_id,
            'currency' => 'IRR',
            'description' => '',
            'status' => 'usual',
            ]); 
        return response()->json(['success'=> true, 'id'=>$plan->id]); 

    }

    public function getPlanByIdForAdmin(Request $request){
        $plan = Plan::where('id', $request->input('planId'))
        ->select('id', 'name', 'color', 'fields', 'price', 'currency', 'interval',
         'description', 'provider', 'provider_plan_id', 'inactivated_at')->first();
        return response()->json(['plan' => $plan]);
    }

    public function updatePlanByAdmin(Request $request){

        $plan = $request->input('plan'); // array
        $authorId = $request->input('authorId');

        $p = Plan::find($plan['id']);
            if ($p) {
                  $p->update([
                  'name' => $plan['name'],
                  'color' => $plan['color'],
                  'fields' => $plan['fields'],
                  'price' => $plan['price'],
                  'currency' => $plan['currency'],
                  'interval' => $plan['interval'],
                  'provider' => $plan['provider'],
                  'provider_plan_id' => $plan['provider_plan_id'],
                  'description' => $plan['description'],
           ]);
            return response()->json(['success' => true, 'id'=>$p->id]);
        }
        return response()->json(['success' => false]);
    }

    public function removePlanByAdmin(Request $request){
        $planId = $request->input('planId');
        $authorId = $request->input('authorId');

        $plan = Plan::find($planId);

        if (!$plan) {
         return response()->json(['success' => false, 'message'=> 'Plan not found!']);
        }

        if($plan->author_id !== $author_id){
            return response()->json(['success' => false, 'message' => 'Plan is not removed. You are not the creator of the plan!']);
        }

        $isStillValid = is_null($plan->inactivated_at) || now()->lessThan(
             $plan->inactivated_at->copy()->addMonths($plan->interval));
        if($isStillValid){
            return response()->json(['success' => false, 'message' => 'Plan is still valid and could not be removed!']);
        }

        //$plan->delete();
        $plan->update(['status' => 'archived']);
         return response()->json(['success' => true]); 
    } 




    ////////////////


public function createPayment(Request $request)
{
    $plan = $request->input('plan'); // array

    $link = '';

    if($plan['provider'] == "idpay"){

        $orderId = 'ORD-'. auth()->id() . time(); // better than uniqid

    $response = Http::withHeaders([
        'X-API-KEY' => env('IDPAY_API_KEY'),
        'X-SANDBOX' => '0', // set to 0 in production, and 1 in test
        'Content-Type' => 'application/json',
    ])->post('https://api.idpay.ir/v1.1/payment', [
        'order_id' => $orderId,
        'amount' => $plan['price'],
        'name' => 'Premium Plan',
        'description' => 'LanguField',
        'callback' => route('idpay.callback'),
    ]);

    if (!$response->successful()) {
        return response()->json([
            'error' => 'IDPay request failed',
            'details' => $response->body()
        ], 400);
    }
    // Save payment in DB
            $payment = Payment::create([
               'user_id' => auth()->id(),
               'order_id' => $orderId,
               'amount' => $plan['price'],
               'currency' => 'IRR',
               'provider' => 'idpay',
               'provider_payment_id' => $response->json('id'),
               'provider_payload' => $response,
               'payable_type' => Plan::class,
               'payable_id' => $plan['id'],
       ]);

    $link = $response->json('link');
    return response()->json(['link'=>$link]);
    }

    if($plan['provider'] == "zarinpal"){

        $merchantId = env('ZARINPAL_MERCHANT_ID');  // your merchant ID
        $amount     = (int) $plan['price'];             // in IRR
        $callback   = route('zarinpal.callback'); // e.g. https://yourdomain.com/api/zarinpal/verify

        // Prepare request body
        $data = [
            'merchant_id'  => $merchantId,
            'amount'       => $amount,
            'callback_url' => $callback,
            'description'  => 'Payment for LinguField premium',

        ];

        // Send to Zarinpal API
        $response = Http::acceptJson()->post('https://api.zarinpal.com/pg/v4/payment/request.json', $data);

        $result = $response->json();
        if ($response->successful() && isset($result['data']['authority'])) {
            // Save payment in DB
            $payment = Payment::create([
               'user_id' => auth()->id(),
               'order_id' => 'ORD-'. auth()->id() . time(),
               'amount' => $amount,
               'currency' => 'IRR',
               'status' => 'pending',
               'provider' => 'zarinpal',
               'provider_payment_id' => $result['data']['authority'],
               'provider_payload' => $result,
               'payable_type' => Plan::class,
               'payable_id' => $plan['id'],
]);

            $link = "https://payment.zarinpal.com/pg/StartPay/" . $result['data']['authority'];
            return response()->json(['link'=>$link]);

        } 
            return response()->json([
            'error' => $result,
        ], 400);
    }
}

public function zarinpalCallback(Request $request){

    /*
         Zarinpal sends:
         - Authority
         - Status (OK / NOK)
        */

        $authority = $request->query('Authority');
        $status    = $request->query('Status');

        if (! $authority || $status !== 'OK') {
            return redirect(config('app.frontend_url') . '/premium-plans?status=failed');
        }
        // Find payment
        $payment = Payment::where('provider', 'zarinpal')
            ->where('provider_payment_id', $authority)
            ->first();

        if (! $payment) {
            return redirect(config('app.frontend_url') . '/premium-plans?status=failed');
        }
          // Verify with Zarinpal
        $response = Http::acceptJson()->post(
            'https://api.zarinpal.com/pg/v4/payment/verify.json',
            [
                //'merchant_id' => config('services.zarinpal.merchant_id'),
                'merchant_id' => env('ZARINPAL_MERCHANT_ID'),  // your merchant ID,
                'amount' => $payment->amount,
                'authority' => $authority,
            ]
        );

        $result = $response->json();

        if (
            $response->successful() &&
            isset($result['data']['code']) &&
            in_array($result['data']['code'], [100, 101])
        ) {
            $payment->update([
                'status' => 'paid',
                'paid_at' => now(),
                'provider_payload' => $result,
            ]);

            //Activate subscription here
            $this->activateSubscription($payment);

            return redirect(config('app.frontend_url') . '/premium-plans?status=success');
        }
        // Failed verification
        $payment->update([
            'status' => 'failed',
            'provider_payload' => $result,
        ]);

        return redirect(config('app.frontend_url') . '/premium-plans?status=failed');
    }

    protected function activateSubscription($payment)
     {
    $userId = $payment->user_id;
    $plan   = $payment->plan; // relation: Payment belongsTo Plan

    $now = Carbon::now();
    $durationDays = $plan->interval * 30;

    //Check existing active subscription
    $activeSub = Subscription::where('user_id', $userId)
        ->where('status', 'active')
        ->where('ends_at', '>', $now)
        ->latest()
        ->first();

    if ($activeSub) {
        //Extend current subscription
        $activeSub->ends_at = Carbon::parse($activeSub->ends_at)
            ->addDays($durationDays);

        $activeSub->save();

        return $activeSub;

    }

    //No active subscription → create new one
    return Subscription::create([
        'user_id'   => $userId,
        'plan_id'   => $plan->id,
        'status'    => 'active',
        'starts_at' => $now,
        'ends_at'   => $now->copy()->addDays($durationDays),
    ]);
}




    //////////////
}


/* $plans = Plan::where(function ($q) {
        $q->whereNull('inactivated_at')->orWhereRaw(
              'DATE_ADD(inactivated_at, INTERVAL plans.interval MONTH) > NOW()');
    })->get();
        */

    
