import { Game } from "./Game";
import { Player } from "./Player";

export class Simulator {
  private games: number;

  constructor(games?: number) {
    this.games = games ? games : 1;
  }

  public run() {
    for (let i = 0; i < this.games; i++) {
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

      const game: Game = new Game(player, { logs: true });
      game.start();
    }
  }
}
