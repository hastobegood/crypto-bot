import { Candlestick } from '../../../../src/code/domain/candlestick/model/candlestick';
import { randomNumber } from '../../random-test-builder';

export const buildDefaultCandlesticks = (): Candlestick[] => {
  return [buildDefaultCandlestick(), buildDefaultCandlestick(), buildDefaultCandlestick()];
};

export const buildDefaultCandlestick = (): Candlestick => {
  return {
    openingDate: new Date(),
    closingDate: new Date(),
    openingPrice: randomNumber(1_000, 100_000),
    closingPrice: randomNumber(1_000, 100_000),
    lowestPrice: randomNumber(1_000, 100_000),
    highestPrice: randomNumber(1_000, 100_000),
  };
};