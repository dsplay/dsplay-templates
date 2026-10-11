import { useState, useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  useMedia, Loader, useScreenInfo, useConfig,
} from '@dsplay/react-template-utils';
import MainContainer from '../main';
import SecondaryContainer from '../secondary';
import Seta from '../../assets/image/seta.png';
import Intro from '../intro';
import i18n from '../../i18n';
import defaultLogo from '../../assets/image/dsplay-logo.png';
import noneBackground from '../../assets/image/noneBackground.png';
import './style.sass';

const MIN_LOADING_DURATION = 2800;

function App() {
  const media = useMedia();
  const { locale } = useConfig();
  const mainLogo = media.logo || defaultLogo;
  const maxPageTimeMilliseconds = (media.maxPageDurationSeconds ?? 60) * 1000;
  const { screenFormat } = useScreenInfo();

  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  // pagination
  const viewHeight = window.innerHeight;
  let itemsPerPage = 4;

  if (viewHeight <= 720) {
    itemsPerPage = 3;
  } else if (viewHeight <= 1080) {
    itemsPerPage = 5;
  } else if (viewHeight <= 1280) {
    itemsPerPage = 6;
  } else {
    itemsPerPage = 9;
  }
  const numberOfPages = Math.ceil(media.targets.length / itemsPerPage);
  const pageDuration = (media.duration - 1000) / numberOfPages;
  const timePage = pageDuration > maxPageTimeMilliseconds ? maxPageTimeMilliseconds : pageDuration;

  const timeoutInterval = timePage;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleTargets = useMemo(
    () => media.targets.slice(startIndex, endIndex),
    [media.targets, startIndex, endIndex],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (endIndex < media.targets.length) {
        setCurrentPage(currentPage + 1);
      } else {
        // restarts
        setCurrentPage(1);
      }
    }, timeoutInterval);

    return () => clearTimeout(timer);
  }, [media.targets, currentPage, endIndex, timeoutInterval]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        placeholder={<Intro />}
        minDuration={MIN_LOADING_DURATION}
      >
        <div className={`app-container fade-in ${screenFormat}`}>
          <MainContainer mainLogo={mainLogo} />
          {visibleTargets.map((data, index) => (
            <SecondaryContainer
              key={index}
              logo={data.logo || noneBackground}
              direction={data.direction}
              name={data.name}
              place={data.place}
              floor={data.floor}
              seta={Seta}
            />
          ))}
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
