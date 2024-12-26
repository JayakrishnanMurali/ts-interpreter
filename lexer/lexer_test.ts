import { assertEquals } from "@std/assert";
import { Token, tokenize, TokenType } from "./lexer.ts";

Deno.test("Lexer Test", function lexerText() {
  const src = "let foo = 10 + 20 * (30 - 40) / 50";

  const tokens = tokenize(src);

  const expected: Token[] = [
    { type: TokenType.LET, value: "let" },
    { type: TokenType.IDENTIFIER, value: "foo" },
    { type: TokenType.EQUALS, value: "=" },
    { type: TokenType.NUMBER, value: "10" },
    { type: TokenType.BINARY_OPERATOR, value: "+" },
    { type: TokenType.NUMBER, value: "20" },
    { type: TokenType.BINARY_OPERATOR, value: "*" },
    { type: TokenType.L_PAREN, value: "(" },
    { type: TokenType.NUMBER, value: "30" },
    { type: TokenType.BINARY_OPERATOR, value: "-" },
    { type: TokenType.NUMBER, value: "40" },
    { type: TokenType.R_PAREN, value: ")" },
    { type: TokenType.BINARY_OPERATOR, value: "/" },
    { type: TokenType.NUMBER, value: "50" },
    { type: TokenType.EOF, value: "" },
  ];

  assertEquals(tokens, expected);
});
