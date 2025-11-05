import { parser, lexer } from "./grammar.js";

class Interpreter {
  private definitions: Map<string, any> = new Map();

  interpret(input: string) {
    const lexResult = lexer.tokenize(input);
    parser.input = lexResult.tokens;
    const cst = parser.rules();

    if (parser.errors.length > 0) {
      throw new Error("Parsing errors detected");
    }

    // Reset definitions for each interpretation
    this.definitions.clear();

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
    const defines = ctx.children.defineClause
      ? ctx.children.defineClause.map(this.visitDefineClause.bind(this))
      : [];

    const rules = ctx.children.rule
      ? ctx.children.rule.map(this.visitRule.bind(this))
      : [];

    return {
      definitions: defines,
      rules: rules,
    };
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
    return this.visitOrExpression(ctx.children.orExpression[0]);
  }

  private visitOrExpression(ctx: any) {
    const andExpressions = ctx.children.andExpression.map(
      this.visitAndExpression.bind(this)
    );

    if (andExpressions.length === 1) {
      return andExpressions[0];
    }

    return {
      type: "or",
      expressions: andExpressions,
    };
  }

  private visitAndExpression(ctx: any) {
    const conditions = ctx.children.condition.map(
      this.visitCondition.bind(this)
    );

    if (conditions.length === 1) {
      return conditions[0];
    }

    return {
      type: "and",
      expressions: conditions,
    };
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
      let value: any;
      if (ctx.children.StringLiteral) {
        value = ctx.children.StringLiteral[0].image.slice(1, -1);
      } else if (ctx.children.Identifier[1]) {
        // Reference to a defined term
        const refName = ctx.children.Identifier[1].image;
        value = this.definitions.get(refName) ?? refName;
      }
      return {
        type: "is",
        field,
        value,
      };
    } else if (ctx.children.GreaterThan) {
      let value: any;
      if (ctx.children.NumberLiteral && ctx.children.NumberLiteral[0]) {
        value = Number(ctx.children.NumberLiteral[0].image);
      } else if (ctx.children.Identifier[1]) {
        const refName = ctx.children.Identifier[1].image;
        value = this.definitions.get(refName) ?? refName;
      }
      return {
        type: "greaterThan",
        field: field,
        value,
      };
    } else if (ctx.children.LessThan) {
      let value: any;
      if (ctx.children.NumberLiteral && ctx.children.NumberLiteral[1]) {
        value = Number(ctx.children.NumberLiteral[1].image);
      } else if (ctx.children.Identifier[1]) {
        const refName = ctx.children.Identifier[1].image;
        value = this.definitions.get(refName) ?? refName;
      }
      return {
        type: "lessThan",
        field: field,
        value,
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

  private visitDefineClause(ctx: any) {
    const name = ctx.children.Identifier[0].image;
    let value: any;

    if (ctx.children.StringLiteral) {
      value = ctx.children.StringLiteral[0].image.slice(1, -1);
    } else if (ctx.children.NumberLiteral) {
      value = Number(ctx.children.NumberLiteral[0].image);
    } else if (ctx.children.Identifier[1]) {
      // Reference to another defined term
      const refName = ctx.children.Identifier[1].image;
      value = this.definitions.get(refName) ?? refName;
    }

    // Store in definitions map for later reference
    this.definitions.set(name, value);

    return {
      name,
      value,
    };
  }
}

export const interpreter = new Interpreter();
