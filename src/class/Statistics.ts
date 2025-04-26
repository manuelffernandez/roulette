import { No } from "./No";

export class Statistics {
  gameRecord: Array<No>;

  constructor(gameRecord: Array<No>) {
    this.gameRecord = gameRecord;
  }

  public showStatistics() {
    console.log();
  }
}
