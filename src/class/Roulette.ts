import type { EventId, SampleSpace } from "../types";
import { Event } from "./Event";
import { No } from "./No";

export class Roulette {
  static readonly numbers: Array<No> = Roulette.generateNumbers();
  static readonly events: Array<Event> = Roulette.generateEvents();

  public spin() {
    const randomIndex = Math.floor(Math.random() * Roulette.numbers.length);
    const number = Roulette.numbers[randomIndex];
    console.log("Number: ", number);
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
      events.push(new Event("number", [number], 35, `n${number.value}`));

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

    events.push(new Event("column", firstColumn, 2, "firstColumn"));
    events.push(new Event("column", secondColumn, 2, "secondColumn"));
    events.push(new Event("column", thirdColumn, 2, "thirdColumn"));
    events.push(new Event("dozen", firstDozen, 2, "firstDozen"));
    events.push(new Event("dozen", secondDozen, 2, "secondDozen"));
    events.push(new Event("dozen", thirdDozen, 2, "thirdDozen"));
    streets.forEach((street, index) =>
      events.push(new Event("street", street, 11, `st${index}` as EventId))
    );
    events.push(new Event("color", red, 1, "red"));
    events.push(new Event("color", black, 1, "black"));
    events.push(new Event("low_high", low, 1, "low"));
    events.push(new Event("low_high", high, 1, "high"));
    events.push(new Event("even_odd", even, 1, "even"));
    events.push(new Event("even_odd", odd, 1, "odd"));

    return events;
  }

  public static getEvent(id: EventId): Event {
    return this.events.find((event) => event.id === id)!;
  }
}
