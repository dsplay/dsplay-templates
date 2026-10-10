import { createRoot } from 'react-dom/client';
import { CountDownContextProvider } from './contexts/count-down-context';
import App from './components/app';
import './style.sass';

function Container() {
  return (
    <CountDownContextProvider>
      <App />
    </CountDownContextProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Container />);
