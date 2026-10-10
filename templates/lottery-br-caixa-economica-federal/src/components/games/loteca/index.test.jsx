import {
  describe, it, expect, afterEach, beforeEach, vi,
} from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { useMedia } from '@dsplay/react-template-utils';
import Loteca from '.';

vi.mock('@dsplay/react-template-utils', () => ({ useMedia: vi.fn() }));

const match = (game, leftTeamName, rightTeamName, leftTeam, rightTeam) => ({
  game,
  leftTeamName,
  rightTeamName,
  leftTeam,
  rightTeam,
  leftColumn: leftTeam > rightTeam,
  middleColumn: leftTeam === rightTeam,
  rightColumn: leftTeam < rightTeam,
});

const loteca = (round) => ({
  round: {
    number: 1272,
    date: '2026-09-28T03:00:00.000Z',
    accumulated: 0,
    isAccumulated: false,
    matches: [
      match(1, 'INGLATERRA', 'ESPANHA', 2, 3),
      match(2, 'OPERARIO', 'CEARA', 2, 2),
      match(3, 'NAUTICO', 'SPORT', 3, 1),
    ],
    prizes: { hits_14: { winners: 1, amount: 1294441.38 } },
    ...round,
  },
  next: { date: '2026-10-05T03:00:00.000Z', estimatedPrize: 600000 },
});

const setLoteca = (data) => {
  useMedia.mockReturnValue({ iteration: 0, result: { data: { loteca: data } } });
};

beforeEach(() => setLoteca(loteca()));
afterEach(cleanup);

describe('Loteca', () => {
  it('renders every match with its result column', () => {
    render(<Loteca />);
    expect(screen.getByText('INGLATERRA')).toBeInTheDocument();
    expect(screen.getByText('ESPANHA')).toBeInTheDocument();
    expect(screen.getByText('2 x 3')).toBeInTheDocument();
    // away win -> 2, draw -> X, home win -> 1
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows the 14-hit winners', () => {
    render(<Loteca />);
    expect(screen.getByText('1 ganhador')).toBeInTheDocument();
  });

  it('shows "acumulou" when nobody hit 14 and the prize accumulated', () => {
    setLoteca(loteca({
      isAccumulated: true,
      accumulated: 500000,
      prizes: { hits_14: { winners: 0, amount: 0 } },
    }));
    render(<Loteca />);
    expect(screen.getByText('ACUMULOU')).toBeInTheDocument();
  });

  it('does not show a prize value when nobody won and nothing accumulated', () => {
    setLoteca(loteca({ prizes: { hits_14: { winners: 0, amount: 0 } } }));
    render(<Loteca />);
    expect(screen.getByText('NÃO HOUVE GANHADORES (14 ACERTOS)')).toBeInTheDocument();
    expect(screen.queryByText(/R\$/, { selector: '.result' })).toBeNull();
  });
});
