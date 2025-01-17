/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import { useState, useEffect, useRef } from 'react';
import VapiAssistant from '../vapi/index';
import logger from '../logger';

export default function VoiceFX() {
  // Estado para o timer (contagem regressiva)
  const [timer, setTimer] = useState(3);
  const [showAssistant, setShowAssistant] = useState(false);

  // Array para armazenar os valores de amplitude
  const [amplitudes, setAmplitudes] = useState(new Array(100).fill(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    // Função para ativar o microfone e configurar o contexto de áudio
    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256; // Tamanho da FFT, define a precisão da análise
        analyserRef.current = analyser;

        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        // Começar a animação
        // eslint-disable-next-line no-use-before-define
        draw(); // Aqui chamamos draw após ela estar definida
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

  // Função responsável por animar a linha SVG com base no input do microfone
  const draw = () => {
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    // Atualiza a linha SVG com base nos valores de amplitude
    const normalizedAmplitudes = Array.from(dataArrayRef.current).map(
      // Normaliza os valores de -1 a 1
      (value) => value / 128 - 1,
    );

    setAmplitudes(normalizedAmplitudes);

    rafIdRef.current = requestAnimationFrame(draw); // Continua a animação
  };

  // Gera o caminho SVG baseado nos valores de amplitude
  const generateSVGPath = () => {
    const width = 1920; // Largura do SVG
    const height = 200; // Altura do SVG
    const step = width / amplitudes.length;
    let d = `M 0 ${height / 2}`; // Começa no meio da tela

    amplitudes.forEach((amplitude, i) => {
      const x = i * step;
      const y = (height / 2) + amplitude * (height / 2); // Ajusta a linha conforme a amplitude
      d += ` L ${x} ${y}`;
    });

    return d;
  };
  // Efeito para o timer de 5 segundos
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
    return setShowAssistant(true);
  }, [timer]);

  // Se o timer chegou a 0, renderiza o VapiAssistant
  if (showAssistant) {
    return <VapiAssistant />; // Renderiza o componente externo
  }

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>
        {`Speak loudly to test the audio... ${timer}`}
      </h3>
      <svg width="500" height="200" style={{ border: '1px solid black' }}>
        <path d={generateSVGPath()} stroke="blue" fill="none" strokeWidth="2" />
      </svg>
    </div>
  );
}
