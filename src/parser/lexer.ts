import { Lexer } from "chevrotain";
import { tokens } from "./tokens.ts";

export const lexer = new Lexer(tokens);
