export interface ParsedProgram {
  header: ParsedHeader;
  clauses: ParsedClauses;
}

export interface ParsedHeader {
  variables: number;
  clauses: number;
}

export interface ParsedClause {
  variables: ParsedVariables;
}

export type ParsedClauses = ParsedClause[];

export interface ParsedVariable {
  variable: number;
  negation: boolean;
}

export type ParsedVariables = ParsedVariable[];
