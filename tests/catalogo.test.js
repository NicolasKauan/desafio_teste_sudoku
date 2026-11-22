const { CATALOGO_DE_QUEBRA_CABECAS } = require('../src/catalogo');
const { Tabuleiro } = require('../src/tabuleiro');
const { encontrarViolacao } = require('../src/regras');
const { SOLUCOES_DO_CATALOGO, listarJogadasQueCompletam } = require('./helpers/solucoesDoCatalogo');

const QUEBRA_CABECAS_COM_SOLUCAO = CATALOGO_DE_QUEBRA_CABECAS.map((quebraCabeca, indice) => [
  indice,
  quebraCabeca,
  SOLUCOES_DO_CATALOGO[indice],
]);

describe('CATALOGO_DE_QUEBRA_CABECAS', () => {
  test('tem 3 quebra-cabeças, um para cada solução conhecida', () => {
    expect(CATALOGO_DE_QUEBRA_CABECAS).toHaveLength(3);
    expect(CATALOGO_DE_QUEBRA_CABECAS).toHaveLength(SOLUCOES_DO_CATALOGO.length);
  });

  test('todos os quebra-cabeças do catálogo são distintos', () => {
    const representacoes = CATALOGO_DE_QUEBRA_CABECAS.map((quebraCabeca) => JSON.stringify(quebraCabeca));

    expect(new Set(representacoes).size).toBe(CATALOGO_DE_QUEBRA_CABECAS.length);
  });

  test('o catálogo e cada linha de cada quebra-cabeça são congelados', () => {
    expect(Object.isFrozen(CATALOGO_DE_QUEBRA_CABECAS)).toBe(true);
    CATALOGO_DE_QUEBRA_CABECAS.forEach((quebraCabeca) => {
      expect(Object.isFrozen(quebraCabeca)).toBe(true);
      quebraCabeca.forEach((linha) => expect(Object.isFrozen(linha)).toBe(true));
    });
  });

  test.each(QUEBRA_CABECAS_COM_SOLUCAO)(
    'o quebra-cabeça %i é aceito pelo tabuleiro, tem pistas iniciais e tem células vazias',
    (_indice, quebraCabeca) => {
      const tabuleiro = new Tabuleiro(quebraCabeca);
      const temPistaInicial = quebraCabeca.some((linha) => linha.some((celula) => celula !== null));

      expect(temPistaInicial).toBe(true);
      expect(tabuleiro.estaCheio()).toBe(false);
    },
  );

  test.each(QUEBRA_CABECAS_COM_SOLUCAO)(
    'a solução conhecida do quebra-cabeça %i é válida e respeita as células iniciais',
    (_indice, quebraCabeca, solucao) => {
      expect(encontrarViolacao(solucao)).toBeNull();
      quebraCabeca.forEach((linha, indiceDaLinha) => {
        linha.forEach((celula, indiceDaColuna) => {
          if (celula !== null) {
            expect(solucao[indiceDaLinha][indiceDaColuna]).toBe(celula);
          }
        });
      });
    },
  );

  test.each(QUEBRA_CABECAS_COM_SOLUCAO)(
    'o quebra-cabeça %i pode ser completado jogada a jogada até a solução',
    (_indice, quebraCabeca, solucao) => {
      const tabuleiro = new Tabuleiro(quebraCabeca);

      listarJogadasQueCompletam(quebraCabeca, solucao).forEach(([linha, coluna, valor]) => {
        tabuleiro.preencher(linha, coluna, valor);
      });

      expect(tabuleiro.estaCheio()).toBe(true);
      expect(tabuleiro.grade).toEqual(solucao);
    },
  );
});
