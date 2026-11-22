import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  screen,
  useConfig,
  useMedia,
  useScreenInfo,
} from '@dsplay/react-template-utils';
import Banner from '../banner';
import MenuRow from '../menu-row';
import Promo from '../promo';
import useMenu from '../../hooks/use-menu';
import {
  bannerSequence, filledPromos, filledRows, itemDuration, PRODUCT_COUNT,
} from '../../utils/menu-items';
import './style.sass';

function Main() {
  const { t, i18n } = useTranslation();
  const { locale = 'en_US' } = useConfig();
  const { duration } = useMedia();
  const { screenFormat } = useScreenInfo();
  const { title, promos, rows } = useMenu();

  const [lng] = locale.split('_');

  // In an effect, not in the render body: changing the language updates every component that uses
  // useTranslation, and doing that while rendering loops ("Maximum update depth exceeded").
  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [i18n, lng]);

  const banner = screenFormat === screen.H_BANNER;
  const items = bannerSequence(promos, rows);
  const shownRows = filledRows(rows);
  // The square screen lists the menu in two columns; every other format in one.
  const halves = [shownRows.slice(0, PRODUCT_COUNT / 2), shownRows.slice(PRODUCT_COUNT / 2)];

  return (
    <div className="main">
      <div className="frame">
        <div className="title-tab"><h1 className="title">{title}</h1></div>
        {banner ? (
          <Banner items={items} itemMs={itemDuration(duration, items.length)} />
        ) : (
          <div className="body">
            <div className="promos">
              {filledPromos(promos).map((promo) => <Promo key={`${promo.name}:${promo.img}`} {...promo} />)}
            </div>
            <div className="rows">
              {halves.map((half, column) => (half.length > 0 || column === 0) && (
                <div className="rows-col" key={column}>
                  <MenuRow head name={t('Menu')} price={t('Price')} />
                  {half.map((row, index) => <MenuRow key={`${row.name}:${index}`} {...row} />)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
