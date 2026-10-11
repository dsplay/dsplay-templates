import { useEffect, useState, useRef } from 'react';
import { useTemplateVal } from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import './anim.sass';
import logger from '../../utils/logger';

function VapiAssistant() {
  const assistant = useTemplateVal('assistant_id');
  const apiKey = useTemplateVal('api_key');
  const { t } = useTranslation();
  const [amplitudes, setAmplitudes] = useState(new Array(100).fill(0));
  const [callError, setCallError] = useState(false);
  const backgroundMedia = useTemplateVal('background_media', useTemplateVal('background_image_url'));
  const gradienteColor1 = useTemplateVal('gradiente_color_1');
  const gradienteColor2 = useTemplateVal('gradiente_color_2');

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafIdRef = useRef(null);
  const bubbleRef = useRef(null);

  useEffect(() => {
    let vapiInstance = null;
    const buttonConfig = {};

    const loadVapiScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
      script.defer = true;
      script.async = true;
      script.onload = () => {
        if (window.vapiSDK) {
          vapiInstance = window.vapiSDK.run({ apiKey, assistant, config: buttonConfig });
          // an invalid/misconfigured assistant_id or api_key only surfaces once a call is
          // actually attempted (the widget itself renders fine regardless) - these are the
          // Vapi SDK's own error events, not a Loader task, so this can't be caught proactively
          // during the intro the way templates/flight-information handles its API key
          vapiInstance?.on?.('error', () => setCallError(true));
          vapiInstance?.on?.('call-start-failed', () => setCallError(true));
        }
      };

      document.body.appendChild(script);
    };

    loadVapiScript();

    return () => {
      if (vapiInstance) vapiInstance = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the Vapi widget script is appended once; apiKey/assistant are template variables that do not change while it runs, and re-running would append a second script
  }, []);

  useEffect(() => {
    const draw = () => {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      const normalizedAmplitudes = Array.from(dataArrayRef.current).map((value) => value / 128 - 1);
      setAmplitudes(normalizedAmplitudes);
      rafIdRef.current = requestAnimationFrame(draw);
    };

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

  const generateSVGPath = () => {
    const width = 1920;
    const height = 1080;
    const step = width / amplitudes.length;
    let d = `M 0 ${height / 2}`;
    amplitudes.forEach((amplitude, i) => {
      const x = i * step;
      const y = (height / 2) + amplitude * (height / 2);
      d += ` L ${x} ${y}`;
    });
    return d;
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        backgroundImage: `url(${backgroundMedia})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        style={{ width: '80%', height: '80%' }}
        className="spinner"
      >
        <defs>
          <linearGradient id="gradientFade" x1="20%" x2="50%" y1="60%" y2="100%">
            <stop offset="0%" stopColor={gradienteColor1} />
            <stop offset="25%" stopColor={gradienteColor1} stopOpacity="75%" />
            <stop offset="50%" stopColor={gradienteColor1} stopOpacity="50%" />
            <stop offset="75%" stopColor={gradienteColor1} stopOpacity="25%" />
            <stop offset="100%" stopColor={gradienteColor1} stopOpacity="5%" />
          </linearGradient>
          <linearGradient id="gradientFade2" x1="20%" x2="50%" y1="60%" y2="100%">
            <stop offset="0%" stopColor={gradienteColor2} />
            <stop offset="25%" stopColor={gradienteColor2} stopOpacity="75%" />
            <stop offset="50%" stopColor={gradienteColor2} stopOpacity="50%" />
            <stop offset="75%" stopColor={gradienteColor2} stopOpacity="25%" />
            <stop offset="100%" stopColor={gradienteColor2} stopOpacity="5%" />
          </linearGradient>
          <linearGradient id="gradientFade3" x1="20%" x2="50%" y1="60%" y2="100%">
            <stop offset="0%" stopColor={gradienteColor1} />
            <stop offset="25%" stopColor={gradienteColor1} stopOpacity="75%" />
            <stop offset="50%" stopColor={gradienteColor1} stopOpacity="50%" />
            <stop offset="75%" stopColor={gradienteColor1} stopOpacity="25%" />
            <stop offset="100%" stopColor={gradienteColor1} stopOpacity="5%" />
          </linearGradient>
          <linearGradient id="ampGradientFade" x1="20%" x2="50%" y1="60%" y2="100%">
            {[['0%', undefined], ['25%', '75%'], ['50%', '50%'], ['75%', '25%'], ['100%', '5%']].map(([offset, opacity]) => (
              <stop key={offset} offset={offset} stopOpacity={opacity} className="amp-spinner-gradient-stop">
                {/* SMIL, not JS: the colors cross-fade from gradiente_color_1 to gradiente_color_2 and back,
                    on the same 10s cycle as the spinner, with no timer or library behind it */}
                {gradienteColor1 && gradienteColor2 && (
                  <animate
                    attributeName="stop-color"
                    values={`${gradienteColor1};${gradienteColor2};${gradienteColor1}`}
                    dur="20s"
                    repeatCount="indefinite"
                  />
                )}
              </stop>
            ))}
          </linearGradient>
          <filter
            id="blurry-filter"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              x="10%"
              y="0%"
              width="100%"
              height="100%"
              stdDeviation="15"
              in="SourceGraphic"
              result="blur"
            />
          </filter>
          <clipPath id="cut-off-bottom">
            <circle cx="960" cy="540" r="340" />
          </clipPath>
        </defs>
        <g filter="url(#blurry-filter)">
          <ellipse
            ref={bubbleRef}
            rx="300"
            ry="300"
            cx="960"
            cy="540"
            style={{ transition: 'transform 1s ease-in-out' }}
          />
        </g>
        <path
          d={generateSVGPath()}
          stroke="url(#ampGradientFade)"
          strokeWidth="1"
          clipPath="url(#cut-off-bottom)"
          fill='url("#ampGradientFade")'
        />
        <path
          d={generateSVGPath()}
          stroke="white"
          strokeWidth="1"
          clipPath="url(#cut-off-bottom)"
          fill='url("#gradientFade2")'
        />
        <path
          d={generateSVGPath()}
          stroke="white"
          strokeWidth="1"
          clipPath="url(#cut-off-bottom)"
          fill='url("#gradientFade3")'
        />
        <g>
          <circle
            cx="960"
            cy="540"
            r="350"
            fill="transparent"
            stroke="url(#gradientFade)"
            strokeWidth="15"
          />
          <circle
            cx="960"
            cy="540"
            r="355"
            transform="rotate(180 960 540)"
            fill="transparent"
            stroke="url(#gradientFade2)"
            strokeWidth="20"
            filter='url("#blurry-filter")'
            strokeDasharray={`${amplitudes * 1000}, 1000`}
            style={{ transition: 'stroke-dasharray 0.1s ease' }}
          />
          <circle
            cx="960"
            cy="540"
            r="355"
            fill="transparent"
            stroke="url(#gradientFade3)"
            strokeWidth="30"
            transform="rotate(360 900 525)"
            filter='url("#blurry-filter")'
          />
        </g>
      </svg>
      {callError && (
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '0.75em 1.5em',
            borderRadius: '0.5em',
            fontSize: '1.5rem',
            textAlign: 'center',
          }}
        >
          {t('Call failed. Please check the assistant configuration.')}
        </div>
      )}
    </div>
  );
}

export default VapiAssistant;
