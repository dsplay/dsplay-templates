import { createRoot } from 'react-dom/client';
import './font/google/fonts.css';
import './style.css';
import App from './components/app';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
