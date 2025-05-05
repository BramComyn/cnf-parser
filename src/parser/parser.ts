import { CstParser } from "chevrotain";
import { cnf, Minus, Negation, p, tokens, Variable, And, Or, OpenParenthesis, CloseParenthesis } from "./tokens.ts";

class Parser extends CstParser {
  constructor() {
    super(tokens);
    this.performSelfAnalysis();
  }

  conjunction = this.RULE("conjunction", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: And,
      DEF: () => {
        this.OPTION(() => this.CONSUME(OpenParenthesis));
        this.SUBRULE(this.disjunction);
        this.OPTION2(() => this.CONSUME(CloseParenthesis));
      }
    })
  });

  disjunction = this.RULE("disjunction", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: Or,
      DEF: () => {
        this.SUBRULE(this.variable);
      }
    });
  });

  header = this.RULE("header", () => {
    this.CONSUME(p);
    this.CONSUME(cnf);
    this.CONSUME(Variable);
    this.CONSUME2(Variable);
  });

  clause = this.RULE("clause", () => {
    this.MANY(
      () => this.SUBRULE(this.variable)
    );
  });

  variable = this.RULE("variable", () => {
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(Minus) },
        { ALT: () => this.CONSUME(Negation) }
      ]);
    });
    this.CONSUME(Variable);
  });
}

export const parser = new Parser();
