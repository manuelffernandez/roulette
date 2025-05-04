import type { EventGroup, EventId, EventType } from "../types";
import { No } from "./No";

export class Event {
  readonly id: EventId;
  readonly type: EventType;
  readonly group: EventGroup;
  readonly values: Array<No>;
  readonly payout: number;

  constructor({
    id,
    type,
    group,
    values,
    payout,
  }: {
    id: EventId;
    type: EventType;
    group: EventGroup;
    values: Array<No>;
    payout: number;
  }) {
    this.id = id;
    this.type = type;
    this.group = group;
    this.values = values;
    this.payout = payout;
  }

  isEqual(event: Event) {
    return this.id === event.id;
  }

  containsNo(number: No) {
    return this.values.some((no) => no.value === number.value);
  }
}
