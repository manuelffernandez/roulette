import { CLI } from "./cli";
import { No } from "./No";
import { Player } from "./Player";
import { Roulette } from "./Roulette";

export type GameConfig = {
  logs: boolean;
  seed: string | undefined;
  useSeed: boolean;
  rounds: number;
};

export type GameRecord = Array<No>;

const defualtConfig: GameConfig = {
  logs: false,
  seed: undefined,
  useSeed: true,
  rounds: 100,
};

export class Game {
  readonly roulette: Roulette;
  gameRecord: GameRecord = [];
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
    this.player = player;
    this.config = config;
  }

  private playRound() {
    this.player.placeAutomatedBet();
    const no = this.roulette.spin();

    if (this.config.logs) console.log("-- Outcome number: ", no, " --");

    this.gameRecord.push(no);
    this.player.resolveBets(no);
  }

  public start() {
    const { logs } = this.config;
    const initial = this.player.bankroll;

    if (logs) {
      console.log("initial bankroll", initial);
      CLI.separator();
    }

    for (let i = 0; i < this.config.rounds; i++) {
      if (logs) console.log("\n ROUND ", i);
      this.playRound();
    }
    const final = this.player.bankroll;

    if (logs) {
      CLI.separator();
      console.log("final bankroll", final);
    }
  }
}
