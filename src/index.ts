// Teoria https://probability.infarom.ro/roulette.html

import { Game } from "./class/Game";
import { Player } from "./class/Player";

const player = new Player({
  bankroll: 1000,
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
    initialStake: 10,
  },
});

const game: Game = new Game(player);

game.start();
