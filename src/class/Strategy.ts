import type { EventId, EventType } from "../types";
import { Bet, BetConstructorArgs } from "./Bet";
import { No } from "./No";
import { Roulette } from "./Roulette";

type BetSystem = "martingala";

type PreviousBet = BetConstructorArgs & { win: boolean };

export type StratConfig = {
  targetEvents: Array<EventId> | "all";
  betSystem: BetSystem;
  initialStake: number;
  gameRecord?: Array<No>;
  risk?: number;
};

export class Strategy {
  public thresholds: Record<EventType, number>;
  public targetEventsCounter: Array<{
    eventId: EventId;
    count: number;
    threshold: number;
  }>;
  private betSystem: BetSystem;
  private risk: number;
  private initialStake: number;
  private previousBets: Array<PreviousBet>;

  constructor(strategy: StratConfig) {
    const { betSystem, targetEvents, initialStake, gameRecord, risk } =
      strategy;

    let eventsCounterInit = [];

    if (targetEvents === "all") {
      eventsCounterInit = Roulette.events.map((event) => event.id);
    } else {
      // removes repeated strings
      eventsCounterInit = Array.from(new Set(targetEvents));
    }

    this.thresholds = {
      color: 4,
      even_odd: 4,
      low_high: 4,
      column: 7,
      dozen: 7,
      street: 18,
      // TODO: GENERATE EVENTS IN ROULETTE STATIC PROP
      corner: 50,
      line: 50,
      number: 50,
      split: 50,
    };
    this.targetEventsCounter = eventsCounterInit.map((eventId) => {
      const event = Roulette.getEvent(eventId);
      const counter = {
        eventId,
        count: 0,
        threshold: this.thresholds[event.type],
      };

      // Inicializa el contador de los targetevents segun el historial del juego
      if (gameRecord?.length !== 0) {
        gameRecord?.forEach((number) => {
          if (event.containsNo(number)) counter.count += 1;
        });
      }

      return counter;
    });
    this.initialStake = initialStake;
    this.betSystem = betSystem;
    this.risk = risk ?? 2;
    this.previousBets = [];
    // this.lastOutcome =
    //   gameRecord !== undefined && gameRecord.length !== 0
    //     ? gameRecord[gameRecord.length - 1]
    //     : undefined;
  }

  public updateTargetEventCounter(number: No) {
    // this.lastOutcome = number;
    this.targetEventsCounter.forEach((counter) => {
      const event = Roulette.getEvent(counter.eventId);
      const containsNo = event.containsNo(number);

      if (containsNo) {
        counter.count = 0;
      } else {
        counter.count += 1;
      }
    });
  }

  public updatePreviousBets(lastBet: BetConstructorArgs & { win: boolean }) {
    this.previousBets.push(lastBet);
  }

  private getSystemBets(): Array<BetConstructorArgs> {
    switch (this.betSystem) {
      case "martingala":
        // TODO: Implementar funciones del cuaderno
        this.previousBets.forEach((bet) => {});
        return [{ eventId: "black", stake: 10 }];
    }
  }

  public getNextBets() {
    const systemBets = this.getSystemBets();

    const eventsToBet = this.targetEventsCounter
      .filter((counter) => counter.count >= counter.threshold)
      .sort((a, b) => b.count - a.count)
      .slice(0, this.risk)
      .map((counter) => counter.eventId);

    const bets = eventsToBet.map((eventId) => ({
      eventId,
      stake: this.initialStake,
    }));

    return bets;
  }
}
