/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import KUTE from 'kute.js';  // Importando KUTE.js para animação

export default function AudioBubble() {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bubble1Ref = useRef(null);
  const bubble2Ref = useRef(null);
  const bubble3Ref = useRef(null);
  const rafIdRef = useRef(null);

  // Função para capturar as amplitudes e deformar as bolhas
  const draw = () => {
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    // Normalizar as amplitudes e obter o valor máximo para deformar as bolhas
    const normalizedAmplitudes = Array.from(dataArrayRef.current).map(
      (value) => value / 128 - 1 // Normaliza os valores de -1 a 1
    );

    const deformValue1 = Math.max(...normalizedAmplitudes.map(Math.abs)) * 7; // Escala para bolha 1
    const deformValue2 = Math.max(...normalizedAmplitudes.map(Math.abs)) * 7; // Escala para bolha 2
    const deformValue3 = Math.max(...normalizedAmplitudes.map(Math.abs)) * 7; // Escala para bolha 3

    // Deformar as bolhas de acordo com as amplitudes capturadas
    KUTE.to(bubble1Ref.current, {
      attr: { rx: 150 * deformValue1, ry: 150 * deformValue1 },
    }).start();

    KUTE.to(bubble2Ref.current, {
      attr: { rx: 150 * deformValue2, ry: 150 * deformValue2 },
    }).start();

    KUTE.to(bubble3Ref.current, {
      attr: { rx: 150 * deformValue3, ry: 150 * deformValue3 },
    }).start();

    // Continua a animação
    rafIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    // Configurar o microfone e o contexto de áudio
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

        // Iniciar a deformação das bolhas
        draw();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    setupMicrophone();

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []); // O array vazio [] garante que o useEffect rode apenas uma vez

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 800 800"
      style={{ width: '100%', height: '100%' }}
      transform="translate(0, 0)"
    >
      <defs>
        <filter
          id="bbblurry-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            stdDeviation="40"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          ></feGaussianBlur>
        </filter>
      </defs>
      <g filter="url(#bbblurry-filter)">
        <ellipse
          ref={bubble1Ref}
          rx="150"
          ry="150"
          cx="455"
          cy="528"
          fill="hsl(37, 99%, 67%)"
        ></ellipse>
        <ellipse
          ref={bubble2Ref}
          rx="150"
          ry="150"
          cx="292"
          cy="510"
          fill="hsl(316, 73%, 52%)"
        ></ellipse>
        <ellipse
          ref={bubble3Ref}
          rx="150"
          ry="150"
          cx="505"
          cy="352"
          fill="hsl(185, 100%, 57%)"
        ></ellipse>
      </g>
    </svg>
  );
}
