import { createToken, Lexer } from "chevrotain";

export const Variable = createToken({
  name: "Variable",
  pattern: /\d+/,
});

export const And = createToken({
  name: "And",
  pattern: /\^/,
});

export const Or = createToken({
  name: "Or",
  pattern: /v/,
});

export const Minus = createToken({
  name: "Minus",
  pattern: /-/,
});

export const Negation = createToken({
  name: "Negation",
  pattern: /¬/,
});

export const OpenParenthesis = createToken({
  name: "OpenParenthesis",
  pattern: /\(/,
});

export const CloseParenthesis = createToken({
  name: "CloseParenthesis",
  pattern: /\)/,
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
  And,
  Or,
  OpenParenthesis,
  CloseParenthesis,
  Minus,
  Whitespace,
];
