import type { EventId, SampleSpace } from "../types";
import { Event } from "./Event";
import { No } from "./No";
import seedrandom from "seedrandom";

export class Roulette {
  static readonly numbers: Array<No> = Roulette.generateNumbers();
  static readonly events: Array<Event> = Roulette.generateEvents();
  private rng: seedrandom.PRNG | (() => number);

  constructor(seed?: string) {
    this.rng = seed ? seedrandom(seed) : Math.random;
  }

  public spin() {
    const randomIndex = Math.floor(this.rng() * Roulette.numbers.length);
    const number = Roulette.numbers[randomIndex];

    return number;
  }

  private static generateNumbers(): No[] {
    const redNos = new Set([
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ]);

    const numbers: No[] = [];

    for (let i = 0; i <= 36; i++) {
      let color: "red" | "black" | "green";

      if (i === 0) {
        color = "green";
      } else if (redNos.has(i)) {
        color = "red";
      } else {
        color = "black";
      }

      numbers.push(new No(color, i as SampleSpace));
    }

    return numbers;
  }

  private static generateEvents() {
    const events: Array<Event> = [];

    // "split"
    // "corner"
    // "line"

    const firstColumn: Array<No> = [];
    const secondColumn: Array<No> = [];
    const thirdColumn: Array<No> = [];
    const firstDozen: Array<No> = [];
    const secondDozen: Array<No> = [];
    const thirdDozen: Array<No> = [];
    const streets: Array<No[]> = [];
    const red: Array<No> = [];
    const black: Array<No> = [];
    const low: Array<No> = [];
    const high: Array<No> = [];
    const even: Array<No> = [];
    const odd: Array<No> = [];

    Roulette.numbers.forEach((number, index) => {
      const { value, color } = number;

      // number
      events.push(
        new Event({
          id: `n${number.value}`,
          type: "number",
          group: "inside",
          values: [number],
          payout: 35,
        })
      );

      if (value === 0) return;

      // column
      if (value % 3 === 0) firstColumn.push(number);
      else if (value % 3 === 1) secondColumn.push(number);
      else thirdColumn.push(number);

      // dozen
      if (value < 13) firstDozen.push(number);
      else if (value < 25) secondDozen.push(number);
      else thirdDozen.push(number);

      //street
      if (value % 3 === 0) {
        streets.push([
          Roulette.numbers[index - 2],
          Roulette.numbers[index - 1],
          number,
        ]);
      }

      // color
      if (color === "red") red.push(number);
      else black.push(number);

      // low_high
      if (value < 19) low.push(number);
      else high.push(number);

      // even_odd
      if (number.value % 2 === 0) even.push(number);
      else odd.push(number);
    });

    events.push(
      new Event({
        id: "firstColumn",
        type: "column",
        group: "outside",
        values: firstColumn,
        payout: 2,
      })
    );
    events.push(
      new Event({
        id: "secondColumn",
        type: "column",
        group: "outside",
        values: secondColumn,
        payout: 2,
      })
    );
    events.push(
      new Event({
        id: "thirdColumn",
        type: "column",
        group: "outside",
        values: thirdColumn,
        payout: 2,
      })
    );
    events.push(
      new Event({
        id: "firstDozen",
        type: "dozen",
        group: "outside",
        values: firstDozen,
        payout: 2,
      })
    );
    events.push(
      new Event({
        id: "secondDozen",
        type: "dozen",
        group: "outside",
        values: secondDozen,
        payout: 2,
      })
    );
    events.push(
      new Event({
        id: "thirdDozen",
        type: "dozen",
        group: "outside",
        values: thirdDozen,
        payout: 2,
      })
    );
    streets.forEach((street, index) =>
      events.push(
        new Event({
          id: `st${index}` as EventId,
          type: "street",
          group: "inside",
          values: street,
          payout: 11,
        })
      )
    );
    events.push(
      new Event({
        id: "red",
        type: "color",
        group: "outside",
        values: red,
        payout: 1,
      })
    );
    events.push(
      new Event({
        id: "black",
        type: "color",
        group: "outside",
        values: black,
        payout: 1,
      })
    );
    events.push(
      new Event({
        id: "low",
        type: "low_high",
        group: "outside",
        values: low,
        payout: 1,
      })
    );
    events.push(
      new Event({
        id: "high",
        type: "low_high",
        group: "outside",
        values: high,
        payout: 1,
      })
    );
    events.push(
      new Event({
        id: "even",
        type: "even_odd",
        group: "outside",
        values: even,
        payout: 1,
      })
    );
    events.push(
      new Event({
        id: "odd",
        type: "even_odd",
        group: "outside",
        values: odd,
        payout: 1,
      })
    );

    return events;
  }

  public static getEventById(id: EventId): Event {
    return this.events.find((event) => event.id === id)!;
  }

  public static getNumberEvents(number: No): EventId[] {
    let events: EventId[] = [];

    if (number.value === 0) {
      events.push("n0");
    } else {
      this.events.forEach((event) => {
        if (event.containsNo(number)) {
          events.push(event.id);
        }
      });
    }

    return events;
  }
}
