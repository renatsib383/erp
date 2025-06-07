<?php

use App\Http\Controllers\Communications\CallController;
use App\Http\Controllers\Communications\ImboxController;
use App\Http\Controllers\Communications\ImController;
use App\Http\Controllers\Communications\ImGroupController;
use App\Http\Controllers\Communications\MessageController;
use App\Http\Controllers\Communications\UisController;
use App\Http\Controllers\Communications\WhatsappController;
use App\Http\Controllers\Contacts\ContactController;
use App\Http\Controllers\Divisions\CompanyController;
use App\Http\Controllers\Deals\DealController;
use App\Http\Controllers\Deals\NoteController;
use App\Http\Controllers\Deals\PipelineController;
use App\Http\Controllers\Deals\StageController;
use App\Http\Controllers\Deals\TaskController;
use App\Http\Controllers\Finance\DeductionController;
use App\Http\Controllers\Finance\PaymentController;
use App\Http\Controllers\Finance\SalaryController;
use App\Http\Controllers\Finance\StatisticController;
use App\Http\Controllers\GitlabWebhookController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\Remont\ActController;
use App\Http\Controllers\Remont\RoomController;
use App\Http\Controllers\Remont\RoomTypeController;
use App\Http\Controllers\Remont\SmetController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Staff\ActivityController;
use App\Http\Controllers\Staff\EmployeeController;
use App\Http\Controllers\Staff\PositionController;
use App\Http\Controllers\Works\CategoryController;
use App\Http\Controllers\Works\CollectionController;
use App\Http\Controllers\Works\GroupController;
use App\Http\Controllers\Works\WorkController;
use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use App\Models\User;
use App\Notifications\PushNotification;
use App\Services\Amo;
use App\Services\Sab;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataTableController;
use App\Http\Controllers\UserController;
use NotificationChannels\WebPush\PushSubscription;

//Auth::loginUsingId(3);

Route::prefix('uis')->group(function () {
    Route::controller(UisController::class)->group(function () {
        Route::post('lost', 'lost');
        Route::post('call', 'call');
    });
});

Route::prefix('whatsapp')->group(function () {
    Route::controller(WhatsappController::class)->group(function () {
        Route::post('webhook', 'webhook');
    });
});

Route::post('/gitlab-webhook', [GitlabWebhookController::class, 'handle']);

Route::middleware(['auth:sanctum'])->group(function(){
    Route::get('/notifications/list', function (Request $request) {
        $offset = request()->query('offset', 0);
        return $request->user()->notifications()->offset($offset)->limit(50)->get();
    });

    Route::post('/notifications/read-all', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return true;
    });
    Route::post('/notifications/read/{id}', function (string $id, Request $request) {
        return $request->user()->notifications()->where('id',$id)->update(['read_at' => now()]);
    });

    Route::get('datatables/{model}', [DataTableController::class, 'handle']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles:id,name')->append('permissions');
    });
    Route::apiResource('users', UserController::class);
    // System
    Route::controller(HolidayController::class)->prefix('holidays')->group(function () {
        Route::get('update', 'update');
        Route::get('get-days', 'getDays');
        Route::get('get-count-work', 'getCountWorkDays');
    });

    // Communications
    Route::get('calls', [CallController::class, 'index']);

    // Works
    Route::apiResource('works/categories', CategoryController::class);
    Route::apiResource('works/groups', GroupController::class);
    Route::apiResource('works/collections', CollectionController::class);
    Route::apiResource('works', WorkController::class);
    Route::apiResource('deductions', DeductionController::class);


    Route::controller(MessageController::class)
        ->name('messages.')
        ->prefix('messages')
        ->group(function () {
            Route::post('/upload', 'upload')->name('upload');
            Route::get('/file/{message}', 'getFile')->name('get-file');
            Route::post('/viewed/{message}', 'markViewed')->name('viewed');
        });
    Route::apiResource('messages', MessageController::class);

    Route::post('/dds/{payment}/comment',[PaymentController::class, 'comment']);
    Route::post('/dds/{payment}/upload',[PaymentController::class, 'upload']);
    Route::get('/dds/list',[PaymentController::class, 'list']);
    Route::apiResource('dds', PaymentController::class,[
        'parameters' => [
            'dds' => 'payment'
        ]
    ]);
    Route::get('salary', [SalaryController::class, 'index']);
    Route::get('finance/statistic', [StatisticController::class, 'index']);


    Route::apiResource('companies', CompanyController::class);
    Route::apiResource('contacts', ContactController::class);
    // Remont
    Route::apiResource('acts', ActController::class);
    Route::apiResource('smets', SmetController::class);
    Route::apiResource('rooms', RoomController::class);
    Route::apiResource('room-types', RoomtypeController::class);
    // Staff
    Route::apiResource('staff/positions', PositionController::class);
    Route::apiResource('staff/employees', EmployeeController::class);

    // Deals
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('deal/pipelines', PipelineController::class);
    Route::apiResource('deal/stages', StageController::class);

    Route::controller(NoteController::class)
        ->name('deal.notes.')
        ->prefix('deal/notes')
        ->group(function () {
            Route::post('/upload', 'upload')->name('upload');
            Route::get('/file/{note}', 'getFile')->name('get-file');
        });
    Route::apiResource('deal/notes', NoteController::class);

    Route::get('deals/{deal}/feed', [DealController::class, 'feed'])->name('deals.feed');
    Route::get('deals/{deal}/copy/smet/{smet}', [DealController::class, 'smetCopy'])->name('deals.smet.copy');
    Route::post('deals/{deal}/price', [DealController::class, 'makePrice'])->name('deals.price');

    Route::get('deals/{deal}/pdf/smet/{smet}', [PdfController::class, 'smet'])->name('deals.pdf.smet');
    Route::get('deals/{deal}/pdf/act/{act}', [PdfController::class, 'act'])->name('deals.pdf.act');
    Route::get('deals/{deal}/pdf/price', [PdfController::class, 'price'])->name('deals.pdf.price');


    Route::get('deals/kanban', [DealController::class, 'dataKanban'])->name('deals.kanban');
    Route::get('deals/table', [DealController::class, 'dataTable'])->name('deals.table');
    Route::apiResource('deals', DealController::class);

    Route::get('lists/{list}',function(string $list){
        return ListController::index($list);
    });

    Route::controller(ImboxController::class)->name('imbox.')->prefix('imbox')->group(function () {
        Route::get('/lists', 'lists')->name('lists');
        Route::get('/messages', 'messages')->name('messages');
    });




    Route::get('/activity', [ActivityController::class, 'index'])->name('activity');
    Route::get('/search', [SearchController::class, 'search'])->name('search');

    Route::get('/amo/{deal}', function (Deal $deal) {
        return (new Amo)->getLeadData($deal);
    })->name('amo.data');

    Route::get('/sab/{deal}', function (Deal $deal) {
        return (new Sab)->getData($deal);
    })->name('sab.data');

    Route::post('/push/subscription', function (Request $request) {
        $user = User::findOrFail($request->user_id);
        return $user->updatePushSubscription(
            $request->subscription['endpoint'],
            @$request->subscription['keys']['p256dh'],
            @$request->subscription['keys']['auth']
        );
    });

    Route::post('/push/subscribe', function (Request $request) {
        $user = User::findOrFail($request->user_id);
        return $user->updatePushSubscription(
            $request->subscription['endpoint'],
            @$request->subscription['keys']['p256dh'],
            @$request->subscription['keys']['auth']
        );
    });

    Route::post('/push/unsubscribe', function (Request $request) {
        $this->validate($request, ['endpoint' => 'required']);
        $user = PushSubscription::findByEndpoint($request->endpoint)->user;
        $user->deletePushSubscription($request->endpoint);
        return response()->json(null, 204);
    });

    Route::post('/push/send', function (Request $request) {
        $message = $request->input('notification');
        $users = User::all();
        $status = 'Уведомления отправлены!';
        foreach ($users as $user) {
            try {
                $user->notify(new PushNotification($message));
            } catch (Exception $e) {
                $status = 'Ошибка при отправке уведомлений: '.$e->getMessage();
            }
        }

        return response()->json(['status' => $status]);
    });

    Route::post('/contacts/{contact}/delete/{deal}', function (Contact $contact,Deal $deal) {
        $deal->contacts()->detach($contact);
        return 'ok';
    });

    Route::apiResource('im_groups', ImGroupController::class);

    Route::controller(ImController::class)->name('im.')->prefix('im')->group(function () {
        Route::get('/lists', 'lists')->name('lists');
        Route::get('/messages', 'messages')->name('messages');
    });
});
