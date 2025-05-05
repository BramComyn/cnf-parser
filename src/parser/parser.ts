import { CstParser } from "chevrotain";
import { cnf, Negation, p, tokens, Variable } from "./tokens.ts";

class Parser extends CstParser {
  constructor() {
    super(tokens);
    this.performSelfAnalysis();
  }

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
    this.OPTION(() => this.CONSUME(Negation));
    this.CONSUME(Variable);
  });
}

export const parser = new Parser();
