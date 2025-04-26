import { EventId } from "../types";
import { Event } from "./Event";
import { Roulette } from "./Roulette";

export type BetConstructorArgs = { eventId: EventId; stake: number };

export class Bet {
  event: Event;
  stake: number;

  constructor({ eventId, stake }: BetConstructorArgs) {
    this.event = Roulette.getEvent(eventId);
    this.stake = stake;
  }

  increaseBet(newStake: number) {
    this.stake += newStake;
  }
}
