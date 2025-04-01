import React from 'react';
import Map from './components/Map';
import { Navigation } from 'lucide-react';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex items-center">
          <Navigation className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Location Tracker</h1>
        </div>
      </header>
      
      <main className="flex-1 relative">
        <Map />
      </main>
    </div>
  );
}

export default App;