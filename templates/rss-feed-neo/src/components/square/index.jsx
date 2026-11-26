import { useView } from '../../hooks/view-context';
import useFirstImage from '../../hooks/use-first-image';
import Photo from '../photo';
import Lead from '../lead';
import Brief from '../brief';
import Footer from '../footer';
import './style.sass';

const GAP = 4;

/**
 * Square (spec M-001b 2.3): the lead in a reduced form (photo 38 wide at the left, no QR: it does not fit outside the photo,
 * `show_qr_code` is ignored here), N2 and N3 as one line each, footer.
 */
function Square({ stories, fallbackPhoto }) {
  const { stage, theme } = useView();
  const [lead, second, third] = stories;
  const leadPhoto = useFirstImage([lead.image, fallbackPhoto]);
  const width = stage.w - GAP * 2;
  const colH = stage.h - 20;
  const rows = (second ? 1 : 0) + (third ? 1 : 0);
  const leadH = colH - rows * (GAP + 15);
  const photoOn = leadPhoto.status !== 'none';

  return (
    <div className="square">
      <div className="stack" style={{ left: `${GAP}rem`, right: `${GAP}rem`, top: `${GAP}rem`, height: `${colH}rem` }}>
        <div className="lead-row" style={{ height: `${leadH}rem` }}>
          {photoOn && <Photo photo={leadPhoto} style={{ width: '38rem', height: `${leadH}rem` }} />}
          <Lead
            story={lead}
            width={photoOn ? width - 38 - 4 : width}
            height={leadH}
            titleMax={5.6}
            titleMin={5.2}
            titleLines={3}
            descMax={4.6}
            descMin={4.2}
            descLines={4}
            className={photoOn ? 'lead-text' : ''}
          />
        </div>
        {second && <div className="brief-row"><Brief story={second} width={width} accent /></div>}
        {second && third && <div className="hrule" style={{ backgroundColor: theme.border, top: `${leadH + GAP + 15 + 1.925}rem` }} />}
        {third && <div className="brief-row"><Brief story={third} width={width} /></div>}
      </div>
      <Footer small />
    </div>
  );
}

export default Square;
