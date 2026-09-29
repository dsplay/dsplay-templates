import './style.sass';

// Loteca "columns": 1 = home team wins, X = draw, 2 = away team wins.
function resultColumn({ leftColumn, middleColumn }) {
  if (leftColumn) {
    return '1';
  }
  return middleColumn ? 'X' : '2';
}

function Match({
  match,
}) {
  const {
    game,
    leftTeamName,
    rightTeamName,
    leftTeam,
    rightTeam,
    leftColumn,
    rightColumn,
  } = match;

  return (
    <div className="match">
      <span className="game">{String(game).padStart(2, '0')}</span>
      <span className={`team left${leftColumn ? ' winner' : ''}`}>{leftTeamName}</span>
      <span className="score">{leftTeam} x {rightTeam}</span>
      <span className={`team right${rightColumn ? ' winner' : ''}`}>{rightTeamName}</span>
      <span className="column">{resultColumn(match)}</span>
    </div>
  );
}

export default Match;
