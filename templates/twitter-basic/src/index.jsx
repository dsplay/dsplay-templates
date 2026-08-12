import { createRoot } from 'react-dom/client';
import './font/flaticon.css';
import './font/google/fonts.css';
import App from './components/app';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
