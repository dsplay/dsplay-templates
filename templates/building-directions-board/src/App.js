import React, { useState, useEffect } from 'react';
import './App.css';
import MainContainer from './components/main/mainContainer';
import SecondaryContainer from './components/secondary/secondaryContainer';
import { useMedia, Loader, useScreenInfo } from '@dsplay/react-template-utils';
import Seta from './components/images/seta.png';
import Intro from './components/intro';
import defaultLogo from './assets/image/dsplay-logo.png'

const MIN_LOADING_DURATION = 2800;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Condensed',
];
function App() {
  let media = useMedia();
  let mainLogo = media.logo || defaultLogo ;
  let maxPageTimeMilliseconds = (media.maxPageDurationSeconds ?? 60) * 1000;
  const { screenFormat } = useScreenInfo();

  //Paginação
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
  let numberOfPages = Math.ceil(media.targets.length / itemsPerPage);
  let pageDuration = (media.duration - 1000) / numberOfPages;
  let timePage = pageDuration > maxPageTimeMilliseconds ? maxPageTimeMilliseconds : pageDuration;

  let timeoutInterval = timePage;
  let [currentPage, setCurrentPage] = useState(1);
  let [visibleTargets, setVisibleTargets] = useState([]);

  useEffect(() => {
    const targets = media.targets;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTargets = targets.slice(startIndex, endIndex);

    setVisibleTargets(currentTargets);

    const timer = setTimeout(() => {
      if (endIndex < targets.length) {
        setCurrentPage(currentPage + 1);
      } else {
        // Reinicia
        setCurrentPage(1);
      }
    }, timeoutInterval);

    return () => clearTimeout(timer);
  }, [media.targets, currentPage, itemsPerPage, timeoutInterval]);

  return (
    <Loader
      placeholder={<Intro />}
      fonts={fonts}
      minDuration={MIN_LOADING_DURATION}
    >
      <div className={`app-container fade-in ${screenFormat}`}>
        <MainContainer mainLogo={mainLogo}></MainContainer>
        {visibleTargets.map((data, index) => (
          <SecondaryContainer
            key={index}
            logo={data.logo}
            direction={data.direction}
            name={data.name}
            place={data.place}
            floor={data.floor}
            seta={Seta}
          ></SecondaryContainer>
        ))}
      </div>
    </Loader>

  );
}

export default App;