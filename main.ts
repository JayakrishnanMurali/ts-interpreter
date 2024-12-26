import { evaluate } from "./interpreter/interpreter.ts";
import Parser from "./parser/parser.ts";



function repl() {
  const parser = new Parser()
  console.log("\nREPL 1.0.0\n")

  while(true){
    const input = prompt(">> ")
    if(!input || input.toLowerCase().includes("exit")) {
      console.log("Goodbye!")
      Deno.exit(0)
    }

    const ast = parser.generateAST(input)
    const result = evaluate(ast)

    console.log(result)
    console.log("--------------------\n\n");
  }
}

repl()