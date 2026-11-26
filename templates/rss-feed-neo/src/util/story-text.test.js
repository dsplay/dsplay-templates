import { describe, it, expect } from 'vitest';
import tidy from './story-text';

describe('tidyDescription (spec M-001b 3.1)', () => {
  it('removes the headline repeated at the start and the credit that follows it', () => {
    const title = 'Veja fotos: Novembro Azul em Movimento promove corrida e ações gratuitas de saúde em Volta Redonda';
    const text = 'Veja fotos: Novembro Azul em Movimento promove corrida e ações gratuitas de saúde em Volta Redonda. Divulgação/TV Rio Sul A primeira edição reuniu centenas de pessoas na orla.';
    expect(tidy(text, title)).toBe('A primeira edição reuniu centenas de pessoas na orla.');
  });

  it('drops a legend and a "Name/Vehicle" credit at the start', () => {
    expect(tidy('Enem 2026 Aline Nascimento/g1 Os candidatos fazem neste domingo a segunda etapa do exame.', 'Matemática e Ciências: candidatos fazem a 2ª etapa'))
      .toBe('Os candidatos fazem neste domingo a segunda etapa do exame.');
    expect(tidy('Praça de Santópolis do Aguapeí (SP) Google Maps Um adolescente de 13 anos foi sozinho à delegacia.', 'Adolescente vai sozinho'))
      .toBe('Um adolescente de 13 anos foi sozinho à delegacia.');
    expect(tidy('Galerias Relacionadas Desde o meio da manhã deste domingo, a frente das escolas ficou movimentada.', 'Candidatos enfrentam dia'))
      .toBe('Desde o meio da manhã deste domingo, a frente das escolas ficou movimentada.');
    expect(tidy('Caminhão atingiu árvores ao sair da pista Polícia Rodoviária Federal/ Divulgação O motorista foi levado ao hospital da cidade e passa bem.', 'Caminhão-tanque sai da pista'))
      .toBe('O motorista foi levado ao hospital da cidade e passa bem.');
  });

  it('only touches the start of the text', () => {
    const text = 'O prefeito anunciou as obras nesta manhã. Foto de Maria Silva/Prefeitura mostra o canteiro.';
    expect(tidy(text, 'Obras no centro')).toBe(text);
  });

  it('is empty when it only repeats the headline or little is left', () => {
    const title = 'Policial militar é baleado durante atendimento a caso de violência doméstica';
    expect(tidy('Policial militar é baleado durante atendimento a caso de violência doméstica em Niterói.', title)).toBe('');
    expect(tidy('Curto demais.', 'Outro título')).toBe('');
    expect(tidy('', 'x')).toBe('');
  });

  it('keeps a normal description', () => {
    const text = 'Dinheiro, drogas e arma apreendidos com o suspeito. Batalhão de Choque da Polícia Militar.';
    expect(tidy(text, 'Som alto de carro leva Choque a traficante com pistola furtada')).toBe(text);
  });
});

describe('leftover of the headline at the start (rule 5)', () => {
  it('removes 1-4 initial words that are in the headline when a sentence follows', () => {
    expect(tidy('Militar Uma arma e diversas drogas foram apreendidas pela Polícia Militar durante a operação.', 'Polícia Militar apreende arma e drogas avaliadas em Angra dos Reis'))
      .toBe('Uma arma e diversas drogas foram apreendidas pela Polícia Militar durante a operação.');
  });

  it('cuts up to the first capital when what is left starts in lowercase', () => {
    expect(tidy('Polícia Militar apreende de drogas Um homem foi preso na noite deste sábado em Angra dos Reis.', 'Polícia Militar apreende arma e drogas avaliadas'))
      .toBe('Um homem foi preso na noite deste sábado em Angra dos Reis.');
  });

  it('leaves a normal sentence alone', () => {
    const text = 'A operação prendeu doze executores e três chefes de facções criminosas segundo a polícia.';
    expect(tidy(text, 'Operação prende mais um suspeito de homicídio')).toBe(text);
  });
});
