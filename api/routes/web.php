<?php


use App\Http\Controllers\PdfController;
use App\Services\Sab;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Admin\Pages\YamlConfig;

Route::get('/user-token', function (Request $request) {
    $token = $request->user()->createToken('access');
    return ['token' => $token->plainTextToken];
})->middleware('auth');

Route::post('/save-config', [YamlConfig::class, 'saveConfig']);

Route::get('/pipelines', function (Request $request){
    return $request->user()->pipelines();
});

Route::get('deals/{deal}/pdf/price', [PdfController::class, 'price']);
Route::get('/deals/{deal}/pdf/smet/{smet}', [PdfController::class, 'smet']);
Route::get('/deals/{deal}/pdf/act/{act}', [PdfController::class, 'act'])->name('deals.pdf.act');

Route::get('/sabusers', function (Request $request){
    (new Sab)->getSabUsers();
    return 'ok';
});
