
export enum TokenType {
  NUMBER = "NUMBER",
  IDENTIFIER = "IDENTIFIER",
  EQUALS = "EQUALS",
  BINARY_OPERATOR = "BINARY_OPERATOR",
  LET = "LET",
  L_PAREN = "L_PAREN",
  R_PAREN = "R_PAREN",

  EOF = "EOF"
}

export interface Token {
  type: TokenType;
  value: string;
}

const _KEYWORDS: Record<string, TokenType> = {
  "let": TokenType.LET,
}

function _token(value:string, type: TokenType): Token {
  return { value, type };
}

function _isAlphabet(src: string) {
  return /^[a-zA-Z]$/.test(src);
}

function _isNumber(src: string) {
  return /^[0-9]$/.test(src);
}



export function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();
  const src = source.split("");

  let current = 0;

  while(current < src.length) {
    const char = src[current];

     switch (char) {
       case " ":
       case "\t":
       case "\n":
         current++;
         break;

       case "(":
         tokens.push(_token(char, TokenType.L_PAREN));
         current++;
         break;

       case ")":
         tokens.push(_token(char, TokenType.R_PAREN));
         current++;
         break;

       case "-":
       case "+":
       case "*":
       case "/":
       case "%":
         tokens.push(_token(char, TokenType.BINARY_OPERATOR));
         current++;
         break;

       case "=":
         tokens.push(_token(char, TokenType.EQUALS));
         current++;
         break;

       default:
         if (_isNumber(char)) {
          let num = ""

          while(current < src.length && _isNumber(src[current])){
            num += src[current];
            current++;
          }

          tokens.push(_token(num, TokenType.NUMBER));
          continue;
         }

         if(_isAlphabet(char)){
          let val = ""
          while(current < src.length && (_isAlphabet(src[current]) || _isNumber(src[current]))){
            val += src[current];
            current++;
          }

          const reserved = _KEYWORDS[val];

          if(reserved) {
            tokens.push(_token(val, reserved));
          } else {
            tokens.push(_token(val, TokenType.IDENTIFIER));
          }

          continue;
         }

        console.log(`Unexpected token: ${char}`);
        Deno.exit(1);
     }
  }


  tokens.push(_token("", TokenType.EOF));
  return tokens;
}