import React, { createRoot } from 'react-dom/client';
import { CountUpContextProvider } from './contexts/countUpContext';
import App from './components/app';
import './style.sass';
import './fonts.sass';

const Container = () => (
  <CountUpContextProvider>
    <App />
  </CountUpContextProvider>
);

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Container />);
