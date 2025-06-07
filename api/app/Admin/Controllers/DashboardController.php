<?php

namespace App\Admin\Controllers;
use MoonShine\Contracts\Core\PageContract;
use App\Models\System\ModelEvent;
use MoonShine\Laravel\Http\Controllers\MoonShineController;
class DashboardController extends MoonShineController
{
    public function __invoke() : PageContract
    {
        $events = ModelEvent::all()->take(10);
       
        return $this->view('Admin.dashboard', compact('events'));
    }
}
