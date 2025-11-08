
import React, { useState } from 'react';
import FloatingWindow from './components/FloatingWindow';

const App: React.FC = () => {
  const [isWindowVisible, setIsWindowVisible] = useState(false);

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden bg-black text-white p-4 flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(https://picsum.photos/1920/1080?blur=5)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="relative z-10 text-center">
        {!isWindowVisible && (
          <>
            <h1 className="text-5xl font-bold mb-4 text-green-400 tracking-wider [text-shadow:_0_0_10px_rgb(74_222_128_/_50%)]">
              GH-X PRO
            </h1>
            <p className="text-gray-300 mb-8">The ultimate game hacking simulator.</p>
            <button
              onClick={() => setIsWindowVisible(true)}
              className="px-8 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
            >
              Launch Tool
            </button>
          </>
        )}
      </div>

      {isWindowVisible && <FloatingWindow onClose={() => setIsWindowVisible(false)} />}
    </div>
  );
};

export default App;
