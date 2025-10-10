import InterfaceUniversal from './components/ui/interface-universal';
import './styles/globals.css';
import './styles/figma-gallery-fixes.css';
import './styles/portfolio-public-links.css';
import './styles/external-navigation.css';

function App() {
  return (
    <div className="App">
      <InterfaceUniversal 
        showMultipleScreens={true}
        enableThemeSelector={true}
        className="min-h-screen"
      />
    </div>
  );
}

export default App;