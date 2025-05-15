import { Bet, BetConstructorArgs } from "./Bet";
import { No } from "./No";
import { Roulette } from "./Roulette";
import { StratConfig, Strategy } from "./Strategy";

type PlayerConfig = {
  name: string;
  logs?: boolean;
  bankroll: number;
  strategy: StratConfig;
};

export type BetRecord = Array<{ bet: Bet; win: boolean }>;

export class Player {
  public initialBankroll: number;
  public bankroll: number;
  private activeBets: Array<Bet>;
  private activeBettedNumbers: Array<No>;
  private bettingHistory: Array<BetRecord>;
  private strategy: Strategy;
  private logs: boolean;
  public name: string;

  constructor({ name, logs = false, bankroll, strategy }: PlayerConfig) {
    this.name = name;
    this.logs = logs;
    this.bankroll = bankroll;
    this.initialBankroll = bankroll;
    this.activeBets = [];
    this.activeBettedNumbers = [];
    this.strategy = new Strategy(strategy);
    this.bettingHistory = [];
  }

  private resetActiveBets() {
    this.activeBets = [];
  }

  public placeBet({ eventId, stake }: BetConstructorArgs) {
    if (this.bankroll < stake) return false;
    if (this.logs) {
      console.log(`${this.name} placed bet: `, eventId, "-> $", stake);
    }

    // remove stake amount from players bankroll
    this.bankroll -= stake;
    const event = Roulette.getEventById(eventId);

    // if bet already exists, add stake to it. If not create one.
    const idx = this.activeBets.findIndex((bet) => {
      bet.event.isEqual(event);
    });
    if (idx !== -1) {
      this.activeBets[idx].increaseBet(stake);
    } else {
      this.activeBets.push(new Bet({ eventId, stake }));
    }
    event.values.forEach((value) => {
      const isNumberBetted = this.activeBettedNumbers.find(
        (number) => number.value === value.value
      );
      if (!isNumberBetted) this.activeBettedNumbers.push(value);
    });
    return true;
  }

  public placeAutomatedBet() {
    const bets = this.strategy.getNextBets();
    if (this.logs) console.log(`${this.name} suggested bets by strat: `, bets);
    bets.forEach((bet) => this.placeBet(bet));
  }

  public resolveBets(number: No) {
    let profit: number = 0;
    let returnedStakes: number = 0;
    this.strategy.updateTargetEventCounter(number);

    if (this.activeBets.length !== 0) {
      const betRecord: BetRecord = this.activeBets.map((bet) => {
        let win = false;
        if (bet.event.containsNo(number)) {
          win = true;
          profit += bet.stake * bet.event.payout;
          returnedStakes += bet.stake;
        }
        return { bet, win };
      });

      this.bettingHistory.push(betRecord);
      this.strategy.updateLastBetsBySystem(betRecord);
      this.bankroll += profit + returnedStakes;

      if (this.logs) {
        console.log("profit: ", profit);
        console.log("bankroll: ", this.bankroll);
      }

      this.resetActiveBets();
    }

    if (this.logs) this.showTargetEventsCounter();
    return profit;
  }

  public getWinningProb() {
    const probability = this.activeBettedNumbers.length / 37;
    return probability;
  }

  public showTargetEventsCounter() {
    console.log("target events counter: ", this.strategy.targetEventsCounter);
  }
}
