const { ErroDeRegra, MENSAGENS_DE_REGRA } = require('../src/erros');

describe('ErroDeRegra', () => {
  test('é um Error com nome e mensagem próprios', () => {
    const erro = new ErroDeRegra('jogada proibida');

    expect(erro).toBeInstanceOf(Error);
    expect(erro).toBeInstanceOf(ErroDeRegra);
    expect(erro.name).toBe('ErroDeRegra');
    expect(erro.message).toBe('jogada proibida');
  });

  test('não se confunde com TypeError nem com RangeError', () => {
    const erro = new ErroDeRegra('jogada proibida');

    expect(erro).not.toBeInstanceOf(TypeError);
    expect(erro).not.toBeInstanceOf(RangeError);
  });
});

describe('MENSAGENS_DE_REGRA', () => {
  test('é congelada', () => {
    expect(Object.isFrozen(MENSAGENS_DE_REGRA)).toBe(true);
  });

  test('contém todas as mensagens exatas das regras do jogo', () => {
    expect(MENSAGENS_DE_REGRA).toEqual({
      VALORES_IGUAIS_SEGUIDOS: 'Não pode haver três valores iguais seguidos na mesma linha ou coluna.',
      EXCESSO_DE_UM_VALOR: 'Uma linha ou coluna não pode ter mais de 3 valores iguais.',
      LINHAS_REPETIDAS: 'Não pode haver duas linhas completas iguais.',
      COLUNAS_REPETIDAS: 'Não pode haver duas colunas completas iguais.',
      CELULA_FIXA: 'As células iniciais do quebra-cabeça não podem ser alteradas.',
      CELULA_JA_VAZIA: 'A célula já está vazia.',
      PARTIDA_ENCERRADA: 'A partida já terminou.',
    });
  });

  test('todas as mensagens são distintas', () => {
    const mensagens = Object.values(MENSAGENS_DE_REGRA);

    expect(new Set(mensagens).size).toBe(mensagens.length);
  });
});
