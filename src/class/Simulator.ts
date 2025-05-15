import { Game } from "./Game";
import { Player } from "./Player";
import { Statistics } from "./Statistics";

export class Simulator {
  private numberOfgames: number;
  private statistics: Statistics = new Statistics();

  constructor(numberOfgames?: number) {
    this.numberOfgames = numberOfgames ? numberOfgames : 1;
  }

  public run() {
    for (let i = 0; i < this.numberOfgames; i++) {
      const player = new Player({
        name: "Manuel",
        logs: false,
        bankroll: 10000,
        strategy: {
          targetEvents: [
            "black",
            "red",
            "even",
            "odd",
            "firstColumn",
            "st1",
            "st6",
            "secondDozen",
          ],
          betSystem: "martingala",
          baseStake: 10,
        },
      });

      const game = new Game(player, {
        logs: false,
        statistics: this.statistics,
      });
      game.start();
      game.end();
    }
    this.statistics.showStatistics();
  }
}
