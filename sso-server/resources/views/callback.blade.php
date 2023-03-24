  <!DOCTYPE html>
  <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
  </head>

  <body class="font-sans antialiased">
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">

      <!-- Page Heading -->
      @if (isset($header))
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {{ $header }}
        </div>
      </header>
      @endif

      <!-- Page Content -->
      <main class="flex justify-center items-center h-screen">
        <h1 class="text-white text-2xl font-bold" id="text">Authorizing. Please wait...</h1>
      </main>
    </div>

    <script>
      const data = {{ Illuminate\Support\Js::from($data) }}

      fetch('http://localhost:8000/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json()).then(res => {
        let redirect = `${data.redirect_uri}?error=1`
        
        if(res.access_token && res.refresh_token) {
          redirect = `${data.redirect_uri}?access_token=${res.access_token}&refresh_token=${res.refresh_token}&expires_in=${res.expires_in}`
        }

        return window.location.href = redirect
      })
    </script>
  </body>

  </html>
