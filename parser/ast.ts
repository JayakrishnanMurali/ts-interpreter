export type NodeType =
  | "Program"
  | "NumberLiteral"
  | "Identifier"
  | "BinaryExpression"
  | "NullLiteral";


export interface Statement {
  kind: NodeType;
}

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
}

export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
  kind: "BinaryExpression";
  left: Expression;
  operator: string;
  right: Expression;
}

export interface NumberLiteral extends Expression {
  kind: "NumberLiteral";
  value: number;
}

export interface Identifier extends Expression {
  kind: "Identifier";
  symbol: string;
}

export interface NullLiteral extends Expression {
  kind: "NullLiteral";
  value: "null";
}