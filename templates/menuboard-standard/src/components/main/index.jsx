import {
  useTemplateVal,
} from '@dsplay/react-template-utils';
import './style.sass';
import MenuBoardItens from '../menuitens';

function Main() {
  return (
    <div className="main">
      <div className="flex flex-row justify-end h-screen p-6 mr-10">
        <div className="flex flex-col basis-4/12">
          <img className="inline-block mt-12 ml-32 h-64 w-64 rounded-full ring-3 ring-white" src={useTemplateVal('logo')} alt="" />
        </div>
        <div className="flex flex-col basis-8/12">
          <MenuBoardItens />
        </div>
      </div>
    </div>

  );
}

export default Main;
