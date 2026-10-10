import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { useMedia } from '@dsplay/react-template-utils';
import LotoFacil from '.';

vi.mock('@dsplay/react-template-utils', () => ({ useMedia: vi.fn() }));

const lotoFacil = (extra) => ({
  round: {
    number: 3791,
    date: '2026-09-28T03:00:00.000Z',
    city: 'SÃO PAULO, SP',
    numbers: ['01', '02', '04'],
    accumulated: 0,
    prizes: { hits_15: { winners: 1, amount: 1612688.47 } },
  },
  next: { date: '2026-09-29T03:00:00.000Z', estimatedPrize: 2000000 },
  ...extra,
});

const setGame = (data) => {
  useMedia.mockReturnValue({ iteration: 0, result: { data: { lotofacil: data } } });
};

afterEach(cleanup);

describe('LotoFacil', () => {
  // The service only sends accumulatedIndependenceDaySpecialPrize around the special draw;
  // a missing value used to crash react-countup and leave the screen blank.
  it('renders when there is no special prize in the payload', () => {
    setGame(lotoFacil());
    render(<LotoFacil />);
    expect(screen.getByText('1 ganhador')).toBeInTheDocument();
    expect(document.querySelector('.special-prizes')).toBeNull();
  });

  it('shows the special prize when the payload has it', () => {
    setGame(lotoFacil({ accumulatedIndependenceDaySpecialPrize: 1750000 }));
    render(<LotoFacil />);
    expect(document.querySelector('.special-prizes')).not.toBeNull();
  });
});
