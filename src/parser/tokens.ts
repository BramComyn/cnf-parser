import { createToken, Lexer } from "chevrotain";

export const Variable = createToken({
  name: "Variable",
  pattern: /\d+/,
});

export const Negation = createToken({
  name: "Negation",
  pattern: /-/,
});

export const Whitespace = createToken({
  name: "Whitespace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const p = createToken({
  name: "P",
  pattern: /p/i,
});

export const cnf = createToken({
  name: "CNF",
  pattern: /cnf/i,
});

export const tokens = [
  p,
  cnf,
  Variable,
  Negation,
  Whitespace,
];
