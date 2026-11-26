import { describe, it, expect } from 'vitest';
import cleanDescription, { normalize, truncate } from './description';
import { kickerHidden, newsFrom, MAX_LINK_LENGTH } from './news';

describe('cleanDescription', () => {
  it('removes a caption/credit prefix up to the first period, parenthesis or slash', () => {
    expect(cleanDescription('Foto: Fulano/Agência Texto da notícia aqui.', 'Outra manchete')).toBe('Agência Texto da notícia aqui.');
    expect(cleanDescription('Divulgação/Polícia Militar Uma arma foi apreendida.', 'X')).toBe('Polícia Militar Uma arma foi apreendida.');
    expect(cleanDescription('Reprodução. A notícia começa aqui.', 'X')).toBe('A notícia começa aqui.');
    expect(cleanDescription('Imagem (Reuters) Texto.', 'X')).toBe('Texto.');
  });
  it('drops a description equal to the headline, or starting with it with less than 30 chars left', () => {
    expect(cleanDescription('Obras no Centro: prefeitura anuncia!', 'Obras no centro prefeitura anuncia')).toBe('');
    expect(cleanDescription('Obras no centro. Veja fotos.', 'Obras no centro')).toBe('');
    expect(cleanDescription('Obras no centro. Segundo a prefeitura, as intervenções começam na próxima semana.', 'Obras no centro')).not.toBe('');
  });
  it('truncates at the end of a sentence (at least 60 chars), else at a word with an ellipsis', () => {
    const sentence = 'Primeira frase com um tamanho razoável para passar do mínimo de sessenta caracteres. ';
    const text = sentence + 'palavra '.repeat(60);
    expect(truncate(text)).toBe(sentence.trim());
    const noEnd = 'palavra '.repeat(60);
    const cut = truncate(noEnd);
    expect(cut.length).toBeLessThanOrEqual(281);
    expect(cut.endsWith('…')).toBe(true);
    expect(truncate('curta.')).toBe('curta.');
  });
  it('normalizes accents, case and punctuation', () => {
    expect(normalize('  Ação, Rápida! ')).toBe('acao rapida');
  });
});

describe('kickerHidden', () => {
  const items = [1, 2, 3].map((n) => ({ title: `T${n}`, categories: ['G1'] }));
  it('hides a category equal to the feed title or source', () => {
    expect(kickerHidden({ title: 'g1' }, 'G1')).toBe(true);
    expect(kickerHidden({ result: { data: { title: 'G1', items: [] } } }, 'g1')).toBe(true);
    expect(kickerHidden({ source: 'Feed' }, 'feed')).toBe(true);
  });
  it('hides a category that is the same in every item', () => {
    expect(kickerHidden({ result: { data: { items } } }, 'G1')).toBe(true);
  });
  it('keeps a useful category', () => {
    const mixed = [{ categories: ['Esporte'] }, { categories: ['Ciência'] }];
    expect(kickerHidden({ title: 'Notícias', result: { data: { items: mixed } } }, 'Esporte')).toBe(false);
    expect(kickerHidden({}, '')).toBe(false);
  });
});

describe('links for the QR code', () => {
  it('a link longer than 180 characters hides the QR code and "Read more"', () => {
    const long = `https://x.com/${'a'.repeat(MAX_LINK_LENGTH)}`;
    expect(newsFrom({ itemTitle: 'a', link: long }, {}).link).toBe('');
    expect(newsFrom({ itemTitle: 'a', link: 'https://x.com/ok' }, {}).link).toBe('https://x.com/ok');
  });
  it('never uses the feed title as the category', () => {
    expect(newsFrom({ itemTitle: 'Manchete', title: 'Feed' }, {}).kicker).toBe('');
  });
});
