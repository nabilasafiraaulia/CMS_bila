import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Cms from './components/Cms';
import Camera from './components/Camera';

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('login') === 'true');
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem('profile_picture') || '/fotonabila/fotonabila.jpeg'
  );

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync body classes with current page routing
  useEffect(() => {
    document.body.className = '';
    if (hash === '#/login') {
      document.body.classList.add('login-page-active');
    } else if (hash === '#/cms') {
      document.body.classList.add('cms-page-active');
    }
  }, [hash]);

  // Render components based on hash routing
  const renderContent = () => {
    if (hash === '#/login') {
      return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
    }
    
    if (hash === '#/cms') {
      if (!isLoggedIn) {
        window.location.hash = '#/login';
        return null;
      }
      return <Cms onLogout={() => setIsLoggedIn(false)} />;
    }

    if (hash === '#/camera') {
      return (
        <Camera 
          onProfilePicChange={(url) => setProfilePic(url)} 
          embedMode={false} 
        />
      );
    }

    // Default route: Home (includes sub-hashes like #/profil, #/about, etc.)
    return (
      <Home 
        isLoggedIn={isLoggedIn} 
        onLogout={() => setIsLoggedIn(false)} 
        profilePic={profilePic} 
      />
    );
  };

  return (
    <div className="app-root-container">
      {renderContent()}
    </div>
  );
}

export default App;

