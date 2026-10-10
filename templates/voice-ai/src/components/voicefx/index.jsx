import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import VapiAssistant from '../vapi';
import logger from '../../utils/logger';

export default function VoiceFX() {
  const { t } = useTranslation();
  // countdown before switching to the VapiAssistant view
  const [timer, setTimer] = useState(3);
  const [showAssistant, setShowAssistant] = useState(false);

  // amplitude values driving the SVG waveform
  const [amplitudes, setAmplitudes] = useState(new Array(100).fill(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        // eslint-disable-next-line no-use-before-define
        draw();
      } catch (err) {
        logger.log('Error accessing microphone:', err);
      }
    };

    setupMicrophone();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // animates the SVG waveform based on the microphone input
  const draw = () => {
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    // normalizes values from -1 to 1
    const normalizedAmplitudes = Array.from(dataArrayRef.current).map(
      (value) => value / 128 - 1,
    );

    setAmplitudes(normalizedAmplitudes);

    rafIdRef.current = requestAnimationFrame(draw);
  };

  const generateSVGPath = () => {
    const width = 1920;
    const height = 200;
    const step = width / amplitudes.length;
    let d = `M 0 ${height / 2}`;

    amplitudes.forEach((amplitude, i) => {
      const x = i * step;
      const y = (height / 2) + amplitude * (height / 2);
      d += ` L ${x} ${y}`;
    });

    return d;
  };

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
    return setShowAssistant(true);
  }, [timer]);

  if (showAssistant) {
    return <VapiAssistant />;
  }

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>
        {t('Speak loudly to test the audio... {{timer}}', { timer })}
      </h3>
      <svg width="500" height="200" style={{ border: '1px solid black' }}>
        <path d={generateSVGPath()} stroke="blue" fill="none" strokeWidth="2" />
      </svg>
    </div>
  );
}
