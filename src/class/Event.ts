import type { EventId, EventType } from "../types";
import { No } from "./No";

export class Event {
  type: EventType;
  payout: number;
  group: Array<No>;
  id: EventId;

  constructor(type: EventType, group: Array<No>, payout: number, id: EventId) {
    this.payout = payout;
    this.group = group;
    this.type = type;
    this.id = id;
  }

  isEqual(event: Event) {
    return this.id === event.id;
  }

  containsNo(number: No) {
    return this.group.some((no) => no.value === number.value);
  }
}
