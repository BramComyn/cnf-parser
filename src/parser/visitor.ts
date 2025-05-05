import { parser } from "./parser.ts";
import { ParsedClause, ParsedClauses, ParsedHeader, ParsedVariable } from "./types.ts";

const BaseVisitor = parser.getBaseCstVisitorConstructor();

class Visitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  conjunction(ctx: any): ParsedClauses {
    return ctx.disjunction.map((d: any) => this.visit(d));
  }

  disjunction(ctx: any): ParsedClause {
    return {
      variables: ctx.variable.map((v: any) => this.visit(v)),
    };
  }

  header(ctx: any): ParsedHeader {
    const variables = parseInt(ctx.Variable[0].image, 10);
    const clauses = parseInt(ctx.Variable[1].image, 10);

    return {
      variables,
      clauses,
    };
  }

  clause(ctx: any): ParsedClause {
    return {
      variables: ctx.variable.map((v: any) => this.visit(v)),
    };
  }

  variable(ctx: any): ParsedVariable {
    const negation = (ctx.Minus || ctx.Negation) ? true : false;
    const variable = parseInt(ctx.Variable[0].image, 10);

    return {
      variable,
      negation,
    };
  }
}

export const visitor = new Visitor();
