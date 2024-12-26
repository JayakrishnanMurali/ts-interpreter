import {
  BinaryExpression,
  NumberLiteral,
  Program,
  Statement,
} from "../parser/ast.ts";
import { NullValue, NumberValue, RuntimeValue } from "./values.ts";

export function evaluate(astNode: Statement): RuntimeValue {
  switch (astNode.kind) {
    case "NumberLiteral":
      return evaluateNumberLiteral(astNode as NumberLiteral);
    case "NullLiteral":
      return evaluateNullLiteral();
    case "BinaryExpression":
      return evaluateBinaryExpression(astNode as BinaryExpression);
    case "Program":
      return evaluateProgram(astNode as Program);

    default:
      console.error("Unknown AST Node", astNode);
      Deno.exit(0);
  }
}

function evaluateNumberLiteral(node: NumberLiteral): RuntimeValue {
  return {
    type: "number",
    value: node.value,
  } as RuntimeValue;
}

function evaluateNullLiteral(): RuntimeValue {
  return {
    type: "null",
    value: "null",
  } as RuntimeValue;
}

function evaluateBinaryExpression(binExp: BinaryExpression): RuntimeValue {
  const left = evaluate(binExp.left);
  const right = evaluate(binExp.right);


  if(left.type === 'number' && right.type === 'number') {
    return evaluateNumericExpression(
      binExp.operator,
      left as NumberValue,
      right as NumberValue
    );
  }

  return {
    type: "null",
    value: "null",
  } as NullValue;

}

function evaluateProgram(program: Program): RuntimeValue {
  let lastEvaluated: RuntimeValue = {
    type: "null",
    value: "null",
  } as NullValue;

  for (const statement of program.body) {
    lastEvaluated = evaluate(statement);
  }

  return lastEvaluated;
}


function evaluateNumericExpression(
  operator: string,
  left: NumberValue,
  right: NumberValue
): NumberValue {

  switch (operator) {
    case "+":
      return {
        type: "number",
        value: left.value + right.value,
      } as NumberValue;
    case "-":
      return {
        type: "number",
        value: left.value - right.value,
      } as NumberValue;
    case "*":
      return {
        type: "number",
        value: left.value * right.value,
      } as NumberValue;
    case "/":
      if (right.value === 0) {
        console.error("Division by zero");
        Deno.exit(1);
      }

      return {
        type: "number",
        value: left.value / right.value,
      } as NumberValue;
    case "%":
      return {
        type: "number",
        value: left.value % right.value,
      } as NumberValue;
    default:
      console.error("Unknown operator", operator);
      Deno.exit(1);
  }
}