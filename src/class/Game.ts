import { CLI } from "./cli";
import { No } from "./No";
import { Player } from "./Player";
import { Roulette } from "./Roulette";

export type GameConfig = {
  logs: boolean;
  seed: string | undefined;
  useSeed: boolean;
};

const defualtConfig: GameConfig = {
  logs: false,
  seed: undefined,
  useSeed: true,
};

export class Game {
  readonly roulette: Roulette;
  records: Array<No>;
  private player: Player;
  private config: GameConfig;

  constructor(player: Player, customConfig?: Partial<GameConfig>) {
    const config = { ...defualtConfig, ...customConfig };
    CLI.newGame();

    let seed: GameConfig["seed"] = undefined;
    if (config.useSeed) {
      const seed = config.seed ? config.seed : Math.random().toString();
      console.log("seed: ", seed);
    }

    this.roulette = new Roulette(seed);
    this.records = [];
    this.player = player;
    this.config = config;
  }

  private playRound() {
    this.player.makeStratBet();
    const no = this.roulette.spin();

    if (this.config.logs) console.log("-- Outcome number: ", no, " --");

    this.records.push(no);
    this.player.resolveBets(no);
  }

  public start() {
    const { logs } = this.config;
    const initial = this.player.bankroll;

    if (logs) {
      console.log("initial bankroll", initial);
      CLI.separator();
    }

    const rounds = 150;
    for (let i = 0; i < rounds; i++) {
      if (logs) console.log("\n ROUND ", i);
      this.playRound();
    }
    const final = this.player.bankroll;
    const winPercentage = (final / initial - 1) * 100;

    if (logs) {
      CLI.separator();
      console.log("final bankroll", final);
      console.log("profit percentage", winPercentage);
    }

    return winPercentage;
  }
}
