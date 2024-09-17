export class StockGenerator {
  history: any[];
  currentPrice: number;
  stabilityFactor: number;

  constructor(currentPrice: number, stabilityFactor: number, history: any[]) {
    this.currentPrice = currentPrice;
    this.stabilityFactor = stabilityFactor;
    this.history = history;
  }

  generateNextStockPrice() {
    let variation = Math.random() * 2 - 1;

    if (Math.random() * this.stabilityFactor < 0.02) {
      // como maximo un 2% de posibilidades de un variacion importante
      variation *= 10;
    }
    // if  (this.history.length > 0) {
    //     this.currentPrice = this.history[this.history.length - 1];
    // }
    return this.currentPrice + variation;
  }
}
