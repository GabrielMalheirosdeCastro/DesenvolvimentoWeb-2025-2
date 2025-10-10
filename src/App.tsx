import React from 'react';
import InterfaceUniversal from './components/ui/interface-universal';
import './styles/globals.css';

function App() {
  return (
    <div className="App min-h-screen">
      <InterfaceUniversal 
        showMultipleScreens={true}
        enableThemeSelector={true}
        className="w-full"
      />
    </div>
  );
}

export default App;