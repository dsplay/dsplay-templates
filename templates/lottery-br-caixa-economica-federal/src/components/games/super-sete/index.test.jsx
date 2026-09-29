import {
  describe, it, expect, afterEach, beforeEach, vi,
} from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { useMedia } from '@dsplay/react-template-utils';
import SuperSete from '.';

vi.mock('@dsplay/react-template-utils', () => ({ useMedia: vi.fn() }));

const superSete = (round) => ({
  round: {
    number: 904,
    date: '2026-09-28T03:00:00.000Z',
    city: 'SAO PAULO, SP',
    numbers: ['3', '8', '1', '0', '3', '4', '6'],
    accumulated: 9379343.84,
    prizes: { hits_7: { winners: 0, amount: 0 } },
    ...round,
  },
  next: { date: '2026-09-30T03:00:00.000Z', estimatedPrize: 9700000 },
});

const setGame = (data) => {
  useMedia.mockReturnValue({ iteration: 0, result: { data: { supersete: data } } });
};

beforeEach(() => setGame(superSete()));
afterEach(cleanup);

describe('SuperSete', () => {
  it('renders the seven drawn digits, including repeated ones', () => {
    render(<SuperSete />);
    expect(document.querySelectorAll('.ball')).toHaveLength(7);
    expect(screen.getAllByText('3')).toHaveLength(2);
  });

  it('shows "acumulou" when there are no 7-hit winners', () => {
    render(<SuperSete />);
    expect(screen.getByText('ACUMULOU')).toBeInTheDocument();
  });

  it('shows the winners when there are 7-hit winners', () => {
    setGame(superSete({ prizes: { hits_7: { winners: 2, amount: 1000 } } }));
    render(<SuperSete />);
    expect(screen.getByText('2 ganhadores')).toBeInTheDocument();
  });
});
