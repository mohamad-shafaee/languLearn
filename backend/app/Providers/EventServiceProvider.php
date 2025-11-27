<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Registered;
use App\Listeners\SendUserVerificationEmail;

class EventServiceProvider extends ServiceProvider
{
/*protected $listen = [
    \Illuminate\Auth\Events\Registered::class => [
        // Empty on purpose — do NOT include SendEmailVerificationNotification
        \App\Listeners\SendUserVerificationEmail::class,
    ],
];*/
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        parent::boot(); // important

    \Event::listen(
        Registered::class,
        [SendUserVerificationEmail::class, 'handle']
    );
    }
}
