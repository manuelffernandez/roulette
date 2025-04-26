import { NoColor, SampleSpace } from "../types";

export class No {
  readonly color: NoColor;
  readonly value: SampleSpace;

  constructor(color: NoColor, value: SampleSpace) {
    this.color = color;
    this.value = value;
  }
}
