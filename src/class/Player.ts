import type { EventId } from "../types";
import { Bet, BetConstructorArgs } from "./Bet";
import { No } from "./No";
import { Roulette } from "./Roulette";
import { StratConfig, Strategy } from "./Strategy";

export class Player {
  private bankroll: number;
  private bets: Array<Bet>;
  private betNumbers: Array<No>;
  private strategy: Strategy;

  constructor({
    bankroll,
    strategy,
  }: {
    bankroll: number;
    strategy: StratConfig;
  }) {
    this.bankroll = bankroll;
    this.bets = [];
    this.betNumbers = [];
    this.strategy = new Strategy(strategy);
  }

  private resetBets() {
    this.bets = [];
  }

  public makeBet({ eventId, stake }: BetConstructorArgs) {
    if (this.bankroll < stake) return false;

    // remove from players bankroll
    this.bankroll -= stake;
    const event = Roulette.getEvent(eventId);

    // if bet already exists, add stake to it. If not create one.
    const idx = this.bets.findIndex((bet) => {
      bet.event.isEqual(event);
    });
    if (idx !== -1) this.bets[idx].increaseBet(stake);
    else {
      this.bets.push(new Bet({ eventId, stake }));

      event.group.forEach((value) => {
        const isNumberBet = this.betNumbers.find(
          (number) => number.value === value.value
        );
        if (!isNumberBet) this.betNumbers.push(value);
      });
    }
    return true;
  }

  public makeStratBet() {
    const bets = this.strategy.getNextBets();
    console.log("player suggested bets by strat: ", bets);
    bets.forEach((bet) =>
      this.makeBet({ eventId: bet.eventId, stake: bet.stake })
    );
  }

  public resolveBets(number: No) {
    let profit: number = 0;
    let returnedStakes: number = 0;

    this.strategy.updateTargetEventCounter(number);

    if (this.bets.length !== 0) {
      this.bets.forEach((bet) => {
        const lastBet = { eventId: bet.event.id, stake: bet.stake, win: false };
        if (bet.event.containsNo(number)) {
          lastBet.win = true;
          profit += bet.stake * bet.event.payout;
          returnedStakes += bet.stake;
        }
        this.strategy.updatePreviousBets(lastBet);
      });

      this.bankroll += profit + returnedStakes;
      this.resetBets();
    }

    return profit;
  }

  public getWinningProb() {
    const probability = this.betNumbers.length / 37;
    return probability;
  }

  public showStrategy() {
    console.log(this.strategy.targetEventsCounter);
  }
}
