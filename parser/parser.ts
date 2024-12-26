import {
  Expression,
  Identifier,
  NumberLiteral,
  Program,
  Statement,
  BinaryExpression,
  NullLiteral,
} from "./ast.ts";
import { Token, tokenize, TokenType } from "../lexer/lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  public generateAST(src: string): Program {
    this.tokens = tokenize(src);

    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parse_statement());
    }

    return program;
  }

  private at(): Token {
    return this.tokens[0];
  }

  private next(): Token {
    return this.tokens.shift() as Token;
  }

  private expect_or_error(type: TokenType, err: string): Token {
    const prev = this.tokens.shift() as Token;

    if(!prev || prev.type !== type) {
      console.error("Parser error:\n", err, prev, "\nExpected: ", type);
      Deno.exit(1);
    }

    return prev;
  }

  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }

  private parse_statement(): Statement {
    // skip to parse expression.

    return this.parse_expression();
  }

  private parse_expression(): Expression {
    return this.parse_additive_expression();
  }

  private parse_additive_expression(): Expression {
    let left = this.parse_multiplicative_expression();

    while (
      this.at().value === "+" ||
      this.at().value === "-" 
    ) {
      const operator = this.next().value;
    const right = this.parse_multiplicative_expression();

      left = {
        kind: "BinaryExpression",
        operator: operator,
        left: left,
        right: right,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_multiplicative_expression(): Expression {
    let left = this.parse_primary_expression();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.next().value;
      const right = this.parse_primary_expression();

      left = {
        kind: "BinaryExpression",
        operator: operator,
        left: left,
        right: right,
      } as BinaryExpression;
    }

    return left;
  }

  private parse_primary_expression(): Expression {
    const token = this.at();

    switch (token.type) {
      case TokenType.IDENTIFIER:
        return this.parse_identifier();
      case TokenType.NUMBER:
        return this.parse_number_literal();
      case TokenType.NULL:
        return this.parse_null_literal();
      // case TokenType.BINARY_OPERATOR:
      // case TokenType.LET:
      case TokenType.L_PAREN:
        return this.parse_open_paren_expression();
      // case TokenType.R_PAREN:
      // case TokenType.EOF:
      default:
        console.error(`Unexpected token: ${JSON.stringify(token)}`);
        Deno.exit(1);
    }
  }

  private parse_null_literal(): Expression {
    this.next();
    return {
      kind: "NullLiteral",
      value: "null",
    } as NullLiteral;
  }

  private parse_open_paren_expression(): Expression {
    this.next();
    const value = this.parse_expression();
    this.expect_or_error(TokenType.R_PAREN, "Expected closing parenthesis");
    return value;
  }

  private parse_number_literal(): NumberLiteral {
    return {
      kind: "NumberLiteral",
      value: parseFloat(this.next().value),
    };
  }

  private parse_identifier(): Identifier {
    return {
      kind: "Identifier",
      symbol: this.next().value,
    };
  }
}
