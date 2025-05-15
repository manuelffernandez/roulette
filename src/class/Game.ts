import { CLI } from "./cli";
import { No } from "./No";
import { Player } from "./Player";
import { Roulette } from "./Roulette";
import { Statistics } from "./Statistics";

export type GameConfig = {
  logs: boolean;
  seed: string | undefined;
  useSeed: boolean;
  rounds: number;
  statistics: Statistics;
};

export type GameRecord = Array<No>;

const defualtConfig: GameConfig = {
  logs: false,
  seed: undefined,
  useSeed: true,
  rounds: 100,
  statistics: new Statistics(),
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
      seed = config.seed ? config.seed : Math.random().toString();
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

    for (let i = 0; i < this.config.rounds; i++) {
      if (logs) console.log("\n ROUND ", i);
      this.playRound();
    }
  }

  public end() {
    this.config.statistics.addGame({
      gameRecord: this.gameRecord,
      player: {
        name: this.player.name,
        initialBankroll: this.player.initialBankroll,
        finalBankroll: this.player.bankroll,
      },
    });

    console.log("\ninitial bankroll: ", this.player.initialBankroll);
    console.log("final bankroll: ", this.player.bankroll, "\n");
  }
}
