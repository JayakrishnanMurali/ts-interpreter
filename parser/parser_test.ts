import { assertEquals } from "@std/assert/equals";
import Parser from "./parser.ts";
import { NumberLiteral, Program } from "./ast.ts";

Deno.test("Parser Text", function parserText() {
  const src = "10";

  const parser = new Parser();
  const ast = parser.generateAST(src);

  const expected: Program = {
    kind: "Program",
    body: [
      {
        kind: "NumberLiteral",
        value: 10,
      } as NumberLiteral,
    ],
  };

  assertEquals(ast, expected);
});
