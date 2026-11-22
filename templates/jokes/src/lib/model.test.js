import { describe, it, expect } from 'vitest';
import {
  lngOf, normalizeIteration, pickJoke, questionMs, readJokes,
} from './model';
import { exampleResult } from '../test-support/fixture';

describe('readJokes', () => {
  it('reads the twelve jokes of the example answer', () => {
    const jokes = readJokes(exampleResult());
    expect(jokes).toHaveLength(12);
    expect(jokes[0]).toEqual({ id: '2026-11-15-pt-01', setup: 'O que é um pontinho verde no fundo da sala?', punchline: 'Uma ervilha de castigo!' });
  });

  it('drops a joke with no question or no answer, and tidies spaces', () => {
    const jokes = readJokes({
      jokes: [{ setup: ' a  b ', punchline: 'c\n d' }, { setup: 'only', punchline: '' }, { punchline: 'x' }, null, 'x', { setup: 'q', punchline: 'a', id: 5 }],
    });
    expect(jokes).toEqual([{ id: '', setup: 'a b', punchline: 'c d' }, { id: '', setup: 'q', punchline: 'a' }]);
  });

  it('gives nothing for an answer with no jokes', () => {
    expect(readJokes(undefined)).toEqual([]);
    expect(readJokes({})).toEqual([]);
    expect(readJokes({ jokes: 'x' })).toEqual([]);
  });
});

describe('pickJoke', () => {
  const jokes = readJokes(exampleResult());

  it('shows jokes[iteration % n]', () => {
    expect(pickJoke(jokes, 0)).toBe(jokes[0]);
    expect(pickJoke(jokes, 5)).toBe(jokes[5]);
    expect(pickJoke(jokes, 12)).toBe(jokes[0]);
    expect(pickJoke(jokes, 27)).toBe(jokes[3]);
  });

  it('works with a pool of any size, and with nothing', () => {
    expect(pickJoke(jokes.slice(0, 3), 7)).toBe(jokes[1]);
    expect(pickJoke(jokes.slice(0, 1), 99)).toBe(jokes[0]);
    expect(pickJoke([], 4)).toBeNull();
    expect(pickJoke(jokes, undefined)).toBe(jokes[0]);
    expect(pickJoke(jokes, -3)).toBe(jokes[0]);
  });

  it('normalizes the counter and the locale', () => {
    expect(normalizeIteration('4')).toBe(4);
    expect(normalizeIteration(2.7)).toBe(2);
    expect(lngOf('pt_br')).toBe('pt');
    expect(lngOf(undefined)).toBe('en');
  });
});

describe('questionMs', () => {
  it('is 45% of the duration', () => {
    expect(questionMs(10000)).toBe(4500);
    expect(questionMs(12000)).toBe(5400);
  });

  it('is never under 3 seconds nor over 9', () => {
    expect(questionMs(1000)).toBe(3000);
    expect(questionMs(6000)).toBe(3000);
    expect(questionMs(20000)).toBe(9000);
    expect(questionMs(60000)).toBe(9000);
  });

  it('takes 3 seconds when the duration is unknown', () => {
    expect(questionMs(undefined)).toBe(3000);
    expect(questionMs('x')).toBe(3000);
    expect(questionMs(0)).toBe(3000);
  });
});
