import { createRoot } from 'react-dom/client';
import { CountUpContextProvider } from './contexts/count-up-context';
import App from './components/app';
import './style.sass';
import './fonts.sass';

function Container() {
  return (
    <CountUpContextProvider>
      <App />
    </CountUpContextProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Container />);
