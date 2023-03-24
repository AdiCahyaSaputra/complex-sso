<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
  $request->session()->put('code_verifier', $code_verifier = Str::random(128));

  $code_challange = strtr(rtrim(base64_encode(hash('sha256', $code_verifier, true)), '='), '+/', '-_');

  $query = http_build_query([
    'client_id' => $request->client_id,
    'redirect_uri' => $request->redirect_uri,
    'response_type' => 'code',
    'scope' => '',
    'state' => $state,
    'code_challenge' => $code_challange,
    'code_challenge_method' => 'S256'
  ]);

  return redirect('http://localhost:8000/oauth/authorize?' . $query);
});

Route::get('/callback', function (Request $request) {
  $state = $request->session()->pull('state');
  $code_verifier = $request->session()->pull('code_verifier');

  throw_unless(
    strlen($state) > 0 && $state === $request->state,
    InvalidArgumentException::class,
    'Invalid state value.'
  );

  $data = $request->only(['client_id', 'redirect_uri', 'code']);
  $data['grant_type'] = 'authorization_code';
  $data['code_verifier'] = $code_verifier;

  return view('callback', [
    'title' => 'Authorize',
    'data' => $data
  ]);
});

Route::post('/logout', function (Request $request) {
  $request->user()->token()->revoke();
  $request->user()->token()->delete();

  return response()->json([
    "message" => "Logout"
  ], 200);
})->middleware('auth:api');

require __DIR__ . '/auth.php';
