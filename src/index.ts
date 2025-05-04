// Teoria https://probability.infarom.ro/roulette.html

import { Game } from "./class/Game";
import { Player } from "./class/Player";

let games = 1;
let highest = 0;
let lowest = 0;
let acc = 0;
let average = 0;
let positiveProfitGames = 0;
let negativeProfitGames = 0;

for (let i = 0; i < games; i++) {
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
  const winPercentage = game.start();
  acc += winPercentage;

  if (winPercentage > 0) positiveProfitGames += 1;
  else negativeProfitGames += 1;

  if (i === 0) {
    highest = winPercentage;
    lowest = winPercentage;
  } else {
    if (winPercentage > highest) highest = winPercentage;
    if (winPercentage < lowest) lowest = winPercentage;
  }
}
average = acc / games;

console.log("number of games: ", games);
console.log("number of winning games: ", positiveProfitGames);
console.log("number of losing games: ", negativeProfitGames);
console.log("highest win percentage: ", highest);
console.log("lowest win percentage: ", lowest);
console.log("average  win percentage: ", average);
