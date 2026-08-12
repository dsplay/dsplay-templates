import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceFX from '../voicefx';
import './style.sass';
import logger from '../../utils/logger';

function Home() {
  const { t } = useTranslation();
  logger.log('>>> Home component rendered');
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    // request microphone permission as soon as the component mounts
    async function activateMicrophone() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setMicrophoneActive(true);
        logger.log('Microphone activated');
      } catch (error) {
        setPermissionDenied(true);
        logger.error('Error accessing the microphone');
      }
    }
    activateMicrophone();
  }, []);

  return (
    <div className="home">
      {permissionDenied ? <h2>{t('Alert: Microphone permission is required.')}</h2> : null}

      {microphoneActive
        ? <VoiceFX />
        : (
          <p>{t('Waiting for microphone activation...')}</p>
        )}
    </div>

  );
}

export default Home;
