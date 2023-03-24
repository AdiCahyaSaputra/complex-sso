    <x-app-layout>
      <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {{ __('Clients') }}
        </h2>
      </x-slot>

      <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">

            <div class="p-6 text-gray-900 dark:text-gray-100">

              <p class="font-semibold">
                List of your clients
              </p>

              @foreach($clients as $client)
              <div class="py-4">

                <h3 class="text-lg font-bold text-green-600">{{ $client->name }}</h3>
                <p class="text-sky-500">{{ $client->redirect }}</p>
                <div class="mt-2">
                  <p>ID : {{ $client->id }}</p>
                  <p>Secret : {{ $client->secret }}</p>
                </div>

              </div>
              @endforeach

            </div>

            <hr />

            <div class="p-6 text-gray-900 dark:text-gray-100">

              <form action="/oauth/clients" method="post">

                @csrf

                <div>
                  <x-input-label for="name">Name</x-input-label>
                  <x-text-input name="name" type="text" id="name" />
                </div>

                <div class="mt-2">
                  <x-input-label for="redirect">Redirect</x-input-label>
                  <x-text-input name="redirect" type="text" id="redirect" />
                </div>

                <div class="mt-6">
                  <x-primary-button type="submit">Create Client</x-primary-button>
                </div>

              </form>

            </div>

          </div>
        </div>
      </div>
    </x-app-layout>
