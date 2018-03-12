<?php
    require_once './vendor/autoload.php';

    use GO\Scheduler;

    // Create a new scheduler.
    $scheduler = new Scheduler();

    // ... configure the scheduled jobs (see below) ...

    // Let the scheduler execute jobs which are due.
    $scheduler->run();

    // Schedule php scripts every hour on 5th minute to allow all auctions to finish.
    $scheduler->php('notify_winners.php')->hourly(05);
