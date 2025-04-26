import { CLI } from "./cli";
import { No } from "./No";
import { Player } from "./Player";
import { Roulette } from "./Roulette";

export type GameConfig = {};

export class Game {
  readonly roulette: Roulette;
  records: Array<No>;
  private player: Player;
  private config: GameConfig;

  constructor(player: Player, config?: GameConfig) {
    CLI.newGame();

    this.roulette = new Roulette();
    this.records = [];
    this.player = player;
    this.config = config ?? {};
  }

  private playRound() {
    this.player.makeStratBet();
    const no = this.roulette.spin();
    this.records.push(no);
    this.player.resolveBets(no);
    this.player.showStrategy();
    CLI.separator();
  }

  public start() {
    const rounds = 20;
    for (let i = 0; i < rounds; i++) {
      this.playRound();
    }
  }
}
