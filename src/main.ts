import * as fs from "node:fs";

import {
  lexer,
  parser,
  visitor,
  ParsedHeader,
  ParsedClauses,
  ParsedProgram,
} from "./parser/index.ts";

const CNF_FILE = "examples/example.cnf";
const CNF_FORMULA = "examples/example.cnf.formula";
const CNF_OUTPUT = "examples/example.cnf.output";

const parseFormule = (formula: string): ParsedClauses => {
  const lexing = lexer.tokenize(formula);
  if (lexing.errors.length > 0) {
    throw new Error("Lexing errors detected");
  }

  parser.input = lexing.tokens;
  const cst = parser.conjunction();
  if (parser.errors.length > 0) {
    throw new Error("Parsing errors detected");
  }

  return visitor.visit(cst);
}

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

const toProgram = (clauses: ParsedClauses): ParsedProgram => {
  const variables = new Set<number>();

  for (const clause of clauses) {
    for (const variable of clause.variables) {
      variables.add(variable.variable);
    }
  }

  const header: ParsedHeader = {
    variables: variables.size,
    clauses: clauses.length,
  };

  const program: ParsedProgram = {
    header: header,
    clauses: clauses,
  };

  return program;
}

const writeProgram = async (program: ParsedProgram): Promise<void> => {
  const header = `p cnf ${program.header.variables} ${program.header.clauses}\n`;
  const clauses = program.clauses.map(clause => {
    return clause.variables
      .map(variable => {
        return variable.negation ? `-${variable.variable}` : `${variable.variable}`;
      })
      .join(" ") + " 0";
  }).join("\n");

  const content = header + clauses + "\n";
  await fs.promises.writeFile(CNF_OUTPUT, content);
}

const main = async (): Promise<ParsedProgram> => {
  console.log("Parsing CNF file...");
  const lines = await fs.promises.readFile(CNF_FILE, "utf-8");
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
  console.log("Formatted program:");
  console.log(formatted);

  console.log("Parsing CNF formula...");
  const formula = await fs.promises.readFile(CNF_FORMULA, "utf-8");

  console.log("Parsing formula...");
  const parsedFormula = parseFormule(formula);
  writeProgram(toProgram(parsedFormula));

  return program;
};

main();
