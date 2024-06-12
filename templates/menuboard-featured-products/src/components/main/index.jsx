import {
  FitText,
  useTemplateVal,
} from '@dsplay/react-template-utils';
import './style.sass';
import MenuCarousel from '../menucarousel';
import MenuBoardItens from '../menuitens';

import backgroundBlackBoard from '../../assets/image/blackboard.gif';

function Main() {
  return (
    <div className="main">
      <div className="flex flex-row h-screen p-6">
        <div className="flex flex-col basis-2/5 bg-neutral-900 p-8 m-2 rounded-2xl promo-bar" style={{ backgroundImage: `url(${backgroundBlackBoard})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          <div
            className="grid grid-cols-1 place-items-center h-auto w-full rounded-2xl ring-2 ring-black p-2"
            style={{
              backgroundImage: `url(${useTemplateVal('logo_banner')})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPositionX: '-50%', backgroundPositionY: '50%',
            }}
          >
            <img className="inline-block h-24 w-24 rounded-full ring-4 ring-black" src={useTemplateVal('logo')} alt="" />
          </div>
          <div className="h-32 p-4 promo-title">
            <FitText>{useTemplateVal('promo_title', 'Untitled')}</FitText>
          </div>
          <div className="grow h-full">
            <MenuCarousel />
          </div>
        </div>
        <div className="flex flex-col basis-3/5 m-2 rounded-2xl">
          <MenuBoardItens />
        </div>
      </div>

    </div>

  );
}

export default Main;
