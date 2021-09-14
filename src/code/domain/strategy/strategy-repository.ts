import { Strategy, StrategyStatus } from './model/strategy';

export interface StrategyRepository {
  getById(id: string): Promise<Strategy | null>;

  getAllIdsBySymbolAndActiveStatus(symbol: string): Promise<string[]>;

  updateStatusById(id: string, status: StrategyStatus): Promise<Strategy>;

  updateBudgetById(id: string, consumedBaseAssetQuantity: number, consumedQuoteAssetQuantity: number): Promise<Strategy>;
}
