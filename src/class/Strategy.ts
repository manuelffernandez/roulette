import type { BetSystem, EventId, EventType } from "../types";
import { BetConstructorArgs } from "./Bet";
import { No } from "./No";
import { type BetRecord } from "./Player";
import { Roulette } from "./Roulette";

type StrategyBetRecord = { eventId: EventId; win: boolean; lossAcc: number };
type EventCounter = { eventId: EventId; count: number; threshold: number };

export type StratConfig = {
  targetEvents: Array<EventId> | "all";
  betSystem: BetSystem;
  baseStake: number;
  gameRecord?: Array<No>;
};

export class Strategy {
  public thresholds: Record<EventType, number>;
  public targetEventsCounter: Array<EventCounter>;
  private betSystem: BetSystem;
  private baseStake: number;
  private strategySummary: Array<StrategyBetRecord>;

  constructor(strategy: StratConfig) {
    const { betSystem, targetEvents, baseStake, gameRecord } = strategy;

    let eventsCounterInit = [];

    if (targetEvents === "all") {
      eventsCounterInit = Roulette.events.map((event) => event.id);
    } else {
      // Elimina eventsId repetidos en caso de que los haya dentro del argumento
      eventsCounterInit = Array.from(new Set(targetEvents));
    }

    this.thresholds = {
      color: 4,
      even_odd: 4,
      low_high: 4,
      column: 7,
      dozen: 7,
      street: 45,
      // TODO: GENERAR LOS EVENTOS FALTANTES EN LA CLASE Roulette
      corner: 50,
      line: 50,
      number: 50,
      split: 50,
    };
    this.targetEventsCounter = eventsCounterInit.map((eventId) => {
      const event = Roulette.getEventById(eventId);
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
    this.baseStake = baseStake;
    this.betSystem = betSystem;
    this.strategySummary = [];
  }

  public updateTargetEventCounter(number: No) {
    if (number.value === 0) {
      this.targetEventsCounter.forEach((counter) => {
        const event = Roulette.getEventById(counter.eventId);
        if (event.group === "outside") counter.count = 0;
        else if (event.containsNo(number)) counter.count = 0;
        else counter.count += 1;
      });
    } else {
      this.targetEventsCounter.forEach((counter) => {
        const event = Roulette.getEventById(counter.eventId);

        if (event.containsNo(number)) {
          counter.count = 0;
        } else {
          counter.count += 1;
        }
      });
    }
  }

  public updateLastBetsBySystem(lastBetRecord: BetRecord) {
    switch (this.betSystem) {
      case "martingala": {
        const newStrategySummary: Array<StrategyBetRecord> = lastBetRecord.map(
          (betRecord) => {
            const { bet, win } = betRecord;
            const matchedStrategyBetRecord = this.strategySummary.find(
              (strategyBetRecord) => strategyBetRecord.eventId === bet.event.id
            );

            if (matchedStrategyBetRecord !== undefined) {
              let lossAcc = 0;
              if (!win) lossAcc = matchedStrategyBetRecord.lossAcc + bet.stake;
              return { eventId: bet.event.id, win, lossAcc };
            } else {
              return {
                eventId: bet.event.id,
                win,
                lossAcc: win ? 0 : bet.stake,
              };
            }
          }
        );

        this.strategySummary = newStrategySummary;
        break;
      }
    }
  }

  private getSystemBets(): BetConstructorArgs[] {
    switch (this.betSystem) {
      case "martingala":
        const bets = this.strategySummary
          .filter((strategyBetRecord) => !strategyBetRecord.win) // Obtener las apuestas que perdieron en la última ronda apostada
          .filter((strategyBetRecord) => {
            // Filtra los eventos que tengan el contador en 0. El único evento que puede resetear el contador a 0 es n0 (ver updateTargetEventCounter())
            const eventCounter = this.targetEventsCounter.find(
              (counter) => counter.eventId === strategyBetRecord.eventId
            )!;

            // TODO: ANALIZAR QUE OPCION ES MEJOR
            return eventCounter.count > 0;
            // return eventCounter.count > eventCounter.threshold;
          })
          .map((strategyBetRecord) => {
            const { eventId, lossAcc } = strategyBetRecord;
            const event = Roulette.getEventById(eventId);
            let stake = 0;
            if (lossAcc !== 0) {
              stake = Math.ceil(lossAcc / event.payout + this.baseStake);
            } else {
              stake = this.baseStake;
            }
            return { eventId, stake };
          });
        return bets;
    }
  }

  private getProbableBets(): BetConstructorArgs[] {
    const probableBets = this.targetEventsCounter
      .filter((counter) => counter.count >= counter.threshold) // Solo los que superan el threshold
      .map((counter) => ({
        eventId: counter.eventId,
        stake: this.baseStake,
      }));

    return probableBets;
  }

  public getNextBets(): BetConstructorArgs[] {
    const systemBets = this.getSystemBets();
    const probableBets = this.getProbableBets();
    const nextBets = probableBets
      .filter(
        // Los eventos de sistema tienen prioridad por sobre los probables. Filtra los eventos repetidos de probableBets
        (counter) =>
          systemBets.findIndex(
            (systemBet) => systemBet.eventId === counter.eventId
          ) === -1
      )
      .concat(systemBets);

    return nextBets;
  }

  public arrangeTargetEventsCounter() {
    // ordena de menor a mayor por threshold y luego de mayor a menor por count
    this.targetEventsCounter.sort((a, b) => {
      if (b.threshold !== a.threshold) {
        return a.threshold - b.threshold;
      }
      return b.count - a.count;
    });
  }
}
