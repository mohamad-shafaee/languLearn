<?php

namespace App\Listeners;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Mail\NotifyPasswordResetMail;
use Illuminate\Support\Facades\Mail;

class NotifyPasswordReset
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PasswordReset $event): void
    {
        $user = $event->user;
        Mail::to($user)
        ->send(new NotifyPasswordResetMail($user->name));
    }
}
