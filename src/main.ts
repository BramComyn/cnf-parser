import * as fs from "node:fs";

import {
  lexer,
  parser,
  visitor,
  ParsedHeader,
  ParsedClauses,
  ParsedProgram,
} from "./parser/index.ts";

const FILE = "examples/example.cnf";

const parseHeader = (headerLine: string): ParsedHeader => {
  const lexing = lexer.tokenize(headerLine);
  if (lexing.errors.length > 0) {
    throw new Error("Lexing errors detected");
  }

  parser.input = lexing.tokens;
  const cst = parser.header();
  if (parser.errors.length > 0) {
    throw new Error("Parsing errors detected");
  }

  return visitor.visit(cst);
}

const parseClauses = (clausesLines: string[]): ParsedClauses => {
  const clauses: ParsedClauses = [];
  
  for (const line of clausesLines) {
    const lexing = lexer.tokenize(line);
    if (lexing.errors.length > 0) {
      throw new Error("Lexing errors detected");
    }

    parser.input = lexing.tokens;
    const cst = parser.clause();
    if (parser.errors.length > 0) {
      throw new Error("Parsing errors detected");
    }

    const clause = visitor.visit(cst);
    clauses.push(clause);
  }

  return clauses;
}

const formatProgram = (program: ParsedProgram): string => {
  const result = 
    program.clauses.map(clause => {
      const variables = 
        clause.variables
          .map(variable => {
            return variable.negation ? `¬${variable.variable}` : `${variable.variable}`;
          })
          .join(" v ");

      return variables.length === 1 ? `${variables}` : `(${variables})`;
    })
    .join(" ^ ");
  
  return result;
}

const main = async (): Promise<ParsedProgram> => {
  console.log("Parsing CNF file...");
  const lines = await fs.promises.readFile(FILE, "utf-8");
  const [headerLine, ...clauseLines] = 
    lines.split("\n").filter(line => line.trim() !== "");

  console.log("Parsing header...");
  const header = parseHeader(headerLine);

  if (header.clauses !== clauseLines.length) {
    throw new Error("Header and clauses count mismatch");
  }

  console.log("Parsing clauses...");
  const clauses = parseClauses(clauseLines);

  const program = {
    header: header,
    clauses: clauses,
  };

  const formatted = formatProgram(program);
  console.log("Formatted CNF:");
  console.log(`\t${formatted}`);
  return program;
};

main();
