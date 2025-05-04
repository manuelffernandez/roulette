import { Bet, BetConstructorArgs } from "./Bet";
import { No } from "./No";
import { Roulette } from "./Roulette";
import { StratConfig, Strategy } from "./Strategy";

export class Player {
  public bankroll: number;
  private bets: Array<Bet>;
  private betNumbers: Array<No>;
  private strategy: Strategy;
  private logs: boolean;
  public name: string;

  constructor({
    name,
    logs = false,
    bankroll,
    strategy,
  }: {
    name: string;
    logs?: boolean;
    bankroll: number;
    strategy: StratConfig;
  }) {
    this.name = name;
    this.logs = logs;
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
    if (this.logs)
      console.log(`${this.name} placed bet: `, eventId, "-> $", stake);

    // remove from players bankroll
    this.bankroll -= stake;
    const event = Roulette.getEventById(eventId);

    // if bet already exists, add stake to it. If not create one.
    const idx = this.bets.findIndex((bet) => {
      bet.event.isEqual(event);
    });
    if (idx !== -1) this.bets[idx].increaseBet(stake);
    else {
      this.bets.push(new Bet({ eventId, stake }));

      event.values.forEach((value) => {
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
    if (this.logs) console.log(`${this.name} suggested bets by strat: `, bets);
    bets.forEach((bet) =>
      this.makeBet({ eventId: bet.eventId, stake: bet.stake })
    );
  }

  public resolveBets(number: No) {
    let profit: number = 0;
    let returnedStakes: number = 0;
    let lastBets: Array<BetConstructorArgs & { win: boolean }> = [];
    this.strategy.updateTargetEventCounter(number);

    if (this.bets.length !== 0) {
      this.bets.forEach((bet) => {
        const lastBet = { eventId: bet.event.id, stake: bet.stake, win: false };
        if (bet.event.containsNo(number)) {
          lastBet.win = true;
          profit += bet.stake * bet.event.payout;
          returnedStakes += bet.stake;
        }
        lastBets.push(lastBet);
      });

      this.strategy.updatePreviousBetsBySystem(lastBets);
      this.bankroll += profit + returnedStakes;

      if (this.logs) {
        console.log("profit: ", profit);
        console.log("bankroll: ", this.bankroll);
      }

      this.resetBets();
    }

    if (this.logs) this.showTargetEventsCounter();
    return profit;
  }

  public getWinningProb() {
    const probability = this.betNumbers.length / 37;
    return probability;
  }

  public showTargetEventsCounter() {
    console.log("target events counter: ", this.strategy.targetEventsCounter);
  }
}
