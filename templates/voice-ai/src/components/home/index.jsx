/* eslint-disable import/extensions */
import { useState, useEffect, useRef } from 'react';
import VoiceFX from '../voicefx/voicefx';
import './style.sass';
import logger from '../logger';

function Home() {
  logger.log('>>> Home component rendered');
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Solicitar permissão para usar o microfone
    async function activateMicrophone() {
      try {
        // Solicitar permissão ao microfone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setMicrophoneActive(true);
        logger.log('Microphone activated');
      } catch (error) {
        setPermissionError('Alert: Microphone permission is required.');
        logger.error('Error accessing the microphone');
      }
    }
    activateMicrophone(); // Ativar o microfone assim que o componente for montado
  }, []);

  return (
    <div className="home">
      {permissionError ? <h2>{permissionError}</h2> : null}

      {microphoneActive
        ? <VoiceFX />
        : (
          <p>Waiting for microphone activation...</p>
        )}
    </div>

  );
}

export default Home;
