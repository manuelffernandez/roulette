import { CLI } from "./cli";
import { type GameRecord } from "./Game";

type StatisticsGameRecord = {
  gameRecord: GameRecord;
  player: { name: string; initialBankroll: number; finalBankroll: number };
  profitPercentage: number;
};

export class Statistics {
  private numberOfGames: number = 0;
  private statisticsGamesRecords: Array<StatisticsGameRecord> = [];
  private numberOfPositiveProfitGames: number = 0;
  private numberOfNegativeProfitGames: number = 0;
  private highestProfitGame: StatisticsGameRecord | undefined;
  private lowestProfitGame: StatisticsGameRecord | undefined;
  private profitPercentageAcc: number = 0;
  private averageProfitPercentage: number = 0;

  public addGame(record: Pick<StatisticsGameRecord, "gameRecord" | "player">) {
    const profitPercentage =
      record.player.finalBankroll / record.player.initialBankroll - 1;
    const statisticsGamesRecord = { ...record, profitPercentage };

    this.profitPercentageAcc += profitPercentage; //

    if (profitPercentage > 0) {
      this.numberOfPositiveProfitGames += 1;
    } else {
      this.numberOfNegativeProfitGames += 1;
    }

    if (this.numberOfGames === 0) {
      this.highestProfitGame = statisticsGamesRecord;
      this.lowestProfitGame = statisticsGamesRecord;
    } else {
      if (profitPercentage > this.highestProfitGame!.profitPercentage)
        this.highestProfitGame = statisticsGamesRecord;
      if (profitPercentage < this.lowestProfitGame!.profitPercentage)
        this.lowestProfitGame = statisticsGamesRecord;
    }

    this.numberOfGames = this.statisticsGamesRecords.push(
      statisticsGamesRecord
    );
    this.averageProfitPercentage =
      this.profitPercentageAcc / this.numberOfGames;
  }

  public showStatistics() {
    if (this.numberOfGames === 0) {
      console.log("There are no games to display the statistics");
      return;
    }

    CLI.separator();
    console.log("number of games: ", this.numberOfGames);
    console.log("number of winning games: ", this.numberOfPositiveProfitGames);
    console.log("number of losing games: ", this.numberOfNegativeProfitGames);
    console.log(
      "highest win percentage: ",
      this.highestProfitGame?.profitPercentage
    );
    console.log(
      "lowest win percentage: ",
      this.lowestProfitGame?.profitPercentage
    );
    console.log("average  win percentage: ", this.averageProfitPercentage);
  }
}
