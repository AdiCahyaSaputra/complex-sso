<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
  return view('welcome');
});

Route::get('/dashboard', function () {
  return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/dashboard/clients', function (Request $request) {
  return view('clients', [
    'clients' => $request->user()->clients
  ]);
})->middleware('auth')->name('dashboard.clients');

Route::get('/redirect', function (Request $request) {
  $request->session()->put('state', $state = Str::random(40));

  $query = http_build_query([
    'client_id' => $request->client_id,
    'redirect_uri' => $request->redirect_uri,
    'response_type' => 'code',
    'scope' => '',
    'state' => $state
  ]);

  return redirect('http://localhost:8000/oauth/authorize?' . $query);
});

Route::get('/callback', function (Request $request) {
  $state = $request->session()->pull('state');

  throw_unless(
    strlen($state) > 0 && $state === $request->state,
    InvalidArgumentException::class,
    'Invalid state value.'
  );

  $data = $request->only(['client_id', 'client_secret', 'redirect_uri', 'code']);
  $data['grant_type'] = 'authorization_code';

  return view('callback', [
    'title' => 'Authorize',
    'data' => $data
  ]);
});

require __DIR__ . '/auth.php';
