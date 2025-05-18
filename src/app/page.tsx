// Teoria https://probability.infarom.ro/roulette.html

import { Simulator } from "@/class";

export default function Home() {
  const simulator = new Simulator();
  simulator.run();

  return <div>Hello world</div>;
}
