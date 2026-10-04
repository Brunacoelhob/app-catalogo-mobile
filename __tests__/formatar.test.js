import { formatarPercentual, formatarPreco, precoComDesconto } from '../src/utils/formatar';

describe('formatarPreco', () => {
  it('usa vírgula decimal e duas casas', () => {
    expect(formatarPreco(12.5)).toBe('US$ 12,50');
    expect(formatarPreco('7')).toBe('US$ 7,00');
  });

  it('valor inválido vira travessão (não "NaN")', () => {
    expect(formatarPreco(undefined)).toBe('—');
    expect(formatarPreco('abc')).toBe('—');
  });
});

describe('precoComDesconto', () => {
  it('aplica o percentual e arredonda para centavos', () => {
    expect(precoComDesconto(100, 15)).toBe(85);
    expect(precoComDesconto(9.99, 10.5)).toBe(8.94);
  });

  it('ignora percentual inválido, negativo ou acima de 100', () => {
    expect(precoComDesconto(50, undefined)).toBe(50);
    expect(precoComDesconto(50, -5)).toBe(50);
    expect(precoComDesconto(50, 150)).toBe(50);
    expect(precoComDesconto(50, 0)).toBe(50);
  });

  it('preço inválido devolve NaN', () => {
    expect(precoComDesconto('x', 10)).toBeNaN();
  });
});

describe('formatarPercentual', () => {
  it('mostra "N% OFF" só quando há desconto', () => {
    expect(formatarPercentual(12.4)).toBe('12% OFF');
    expect(formatarPercentual(0)).toBe('');
    expect(formatarPercentual(undefined)).toBe('');
  });
});
