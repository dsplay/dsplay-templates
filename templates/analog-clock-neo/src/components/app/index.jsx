import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import useFormat from '../../hooks/use-format';
import useSettings from '../../hooks/use-settings';
import './style.sass';

// every face the template draws (their @font-face's are in fonts.sass); no 500 file: the numerals are 400 + a stroke
const fonts = [{ family: 'Roboto', weight: 400 }];

function App() {
  const { look, animationEnabled } = useSettings();
  const format = useFormat();
  const { locale } = useConfig();
  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  // the page behind the (hidden, then revealed) template has the base color too, so a dark base never flashes light
  useEffect(() => {
    document.body.style.backgroundColor = look.base;
  }, [look.base]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader reveal fonts={fonts}>
        <div
          className={`app fmt-${format}${animationEnabled ? ' animated' : ''}`}
          style={{ backgroundColor: look.base, color: look.text }}
        >
          <Main format={format} />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
