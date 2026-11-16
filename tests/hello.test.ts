import {expect, it} from "vitest";
import {greet} from "../src/hello";

it(`greets the user`, () => {
  expect(greet("Csaba")).toBe("Hello Csaba!");
})