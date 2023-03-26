import { createRoot } from 'react-dom/client';
import { CountDownContextProvider } from './contexts/countDownContext';
import App from './components/app';
import './style.sass';
import './fonts.sass';

const Container = () => (
  <CountDownContextProvider>
    <App />
  </CountDownContextProvider>
);

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Container />);
