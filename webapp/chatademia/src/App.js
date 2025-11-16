import './App.css';
import { useState, useRef } from 'react';
import appPreview from './assets/app-preview.png';
import appIcon from './assets/icon.png';

function App() {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const moveX = -deltaX * 0.01;
    const moveY = -deltaY * 0.01;
    
    setTransform({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setTransform({ x: 0, y: 0 });
  };

  const handleLoginRedirect = () => {
  const width = 500;
  const height = 600;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  window.open(
    'https://google.com',
    'loginPopup',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <header className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
              <img src={appIcon} alt="Ikona aplikacji" className="w-14 h-14" />
            <span className="text-3xl font-bold ml-2" style={{ color: '#5004E0' }}>Chatademia</span>
          </div>
        </div>
      </header>

      <main 
        className="container mx-auto px-4 py-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 ml-16">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-gray-900">
                Rozmawiaj.<br />
                Współpracuj.<br />
                Ucz się razem.
              </h1>
            </div>
            
            <p className="text-xl font-medium text-gray-600 max-w-xl">
              Chatademia to uniwersytecka aplikacja czatowa,<br></br> która łączy studentów i ułatwia kontakt w ramach zajęć, projektów i grup studenckich.
            </p>

            <div className="flex gap-4">
              <button 
                className="px-8 py-4 bg-white font-semibold rounded-full hover:bg-purple-50 transition-colors" 
                style={{ borderWidth: '3px', color: '#5004E0', borderColor: '#5004E0' }}
                onClick={handleLoginRedirect}
              >
                Zaloguj się
              </button>
              <button className="px-32 py-4 text-white font-semibold rounded-full transition-colors" style={{ backgroundColor: '#5004E0' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#4003B8'} onMouseLeave={(e) => e.target.style.backgroundColor = '#5004E0'}>
                Zaczynamy!
              </button>
            </div>
          </div>

          <div className="relative translate-x-20">
            <img 
              ref={imageRef}
              src={appPreview} 
              alt="Chat Preview" 
              className="w-[150%] max-w-none transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px)`,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
