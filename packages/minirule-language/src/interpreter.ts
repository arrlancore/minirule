import { parser, lexer } from "./grammar.js";

class Interpreter {
  interpret(input: string) {
    const lexResult = lexer.tokenize(input);
    parser.input = lexResult.tokens;
    const cst = parser.rules();

    if (parser.errors.length > 0) {
      throw new Error("Parsing errors detected");
    }

    return this.visitRules(cst);
  }

  validate(input: string): null | string {
    const lexResult = lexer.tokenize(input);
    parser.input = lexResult.tokens;
    parser.rules();

    if (parser.errors.length > 0) {
      console.error(parser.errors.map((e) => e.message).join("\n"));

      return parser.errors[0].message;
    }

    return null;
  }

  private visitRules(ctx: any) {
    return ctx.children.rule.map(this.visitRule.bind(this));
  }

  private visitRule(ctx: any) {
    const name = ctx.children.StringLiteral[0].image.slice(1, -1);
    const whenClause = this.visitWhenClause(ctx.children.whenClause[0]);
    const thenClause = this.visitThenClause(ctx.children.thenClause[0]);

    return {
      name,
      conditions: whenClause,
      action: thenClause,
    };
  }

  private visitWhenClause(ctx: any) {
    return ctx.children.condition.map(this.visitCondition.bind(this));
  }

  private visitCondition(ctx: any) {
    const field = ctx.children.Identifier[0].image;
    if (ctx.children.Is && ctx.children.Between) {
      return {
        type: "between",
        field,
        start: ctx.children.StringLiteral[0].image.slice(1, -1),
        end: ctx.children.StringLiteral[1].image.slice(1, -1),
      };
    } else if (ctx.children.Is) {
      return {
        type: "is",
        field,
        value: ctx.children.StringLiteral[0].image.slice(1, -1),
      };
    } else if (ctx.children.GreaterThan) {
      return {
        type: "greaterThan",
        field: field,
        value: Number(ctx.children.NumberLiteral[0].image),
      };
    } else if (ctx.children.LessThan) {
      return {
        type: "lessThan",
        field: field,
        value: Number(ctx.children.NumberLiteral[0].image),
      };
    }
  }

  private visitThenClause(ctx: any) {
    const businessTerm = ctx.children.BusinessTerm[0].image.toLowerCase();
    return {
      type: `apply${
        businessTerm.charAt(0).toUpperCase() + businessTerm.slice(1)
      }`,
      amount: Number(ctx.children.NumberLiteral[0].image),
      field: ctx.children.Identifier[0].image,
    };
  }
}

export const interpreter = new Interpreter();
