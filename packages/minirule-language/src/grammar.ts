import { createToken, Lexer, CstParser } from "chevrotain";
import { tokens, keywords, operators } from "./tokenConfig.js";

// Define tokens
const Rule = createToken({
  name: "Rule",
  pattern: new RegExp(`\\b${keywords.rule}\\b`, "i"),
});
const When = createToken({
  name: "When",
  pattern: new RegExp(`\\b${keywords.when}\\b`, "i"),
});
const Then = createToken({
  name: "Then",
  pattern: new RegExp(`\\b${keywords.then}\\b`, "i"),
});
const End = createToken({
  name: "End",
  pattern: new RegExp(`\\b${keywords.end}\\b`, "i"),
});
const Is = createToken({
  name: "Is",
  pattern: new RegExp(`\\b${keywords.is}\\b`, "i"),
});
const Between = createToken({
  name: "Between",
  pattern: new RegExp(`\\b${keywords.between}\\b`, "i"),
});
const And = createToken({
  name: "And",
  pattern: new RegExp(`\\b${keywords.and}\\b`, "i"),
});
const Or = createToken({
  name: "Or",
  pattern: new RegExp(`\\b${keywords.or}\\b`, "i"),
});
const Apply = createToken({
  name: "Apply",
  pattern: new RegExp(`\\b${keywords.apply}\\b`, "i"),
});
const To = createToken({
  name: "To",
  pattern: new RegExp(`\\b${keywords.to}\\b`, "i"),
});
const BusinessTerm = createToken({
  name: "BusinessTerm",
  pattern: new RegExp(
    [keywords.discount, keywords.bonus, keywords.fee]
      .map((key) => `\\b${key}\\b`)
      .join("|"),
    "i"
  ),
});
const Define = createToken({
  name: "Define",
  pattern: new RegExp(`\\b${keywords.define}\\b`, "i"),
});
const As = createToken({
  name: "As",
  pattern: new RegExp(`\\b${keywords.as}\\b`, "i"),
});
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: tokens.stringPattern,
});
const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: tokens.numberPattern,
});
const GreaterThan = createToken({
  name: "GreaterThan",
  pattern: new RegExp(operators[0]),
});
const LessThan = createToken({
  name: "LessThan",
  pattern: new RegExp(operators[1]),
});
const Percent = createToken({
  name: "Percent",
  pattern: new RegExp(operators[2]),
});
const Identifier = createToken({
  name: "Identifier",
  pattern: tokens.identifierPattern,
});

const allTokens = [
  Rule,
  When,
  Then,
  End,
  Is,
  Between,
  And,
  Or,
  Apply,
  To,
  Define,
  As,
  BusinessTerm,
  Identifier,
  StringLiteral,
  NumberLiteral,
  GreaterThan,
  LessThan,
  Percent,
  createToken({ name: "Whitespace", pattern: /\s+/, group: Lexer.SKIPPED }),
];

class RuleParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public rules = this.RULE("rules", () => {
    this.MANY(() => {
      this.SUBRULE(this.defineClause);
    });
    this.MANY2(() => {
      this.SUBRULE(this.rule);
    });
  });

  private rule = this.RULE("rule", () => {
    this.CONSUME(Rule);
    this.CONSUME(StringLiteral);
    this.SUBRULE(this.whenClause);
    this.SUBRULE(this.thenClause);
    this.CONSUME(End);
  });

  private whenClause = this.RULE("whenClause", () => {
    this.CONSUME(When);
    this.SUBRULE(this.orExpression);
  });

  private orExpression = this.RULE("orExpression", () => {
    this.SUBRULE(this.andExpression);
    this.MANY(() => {
      this.CONSUME(Or);
      this.SUBRULE2(this.andExpression);
    });
  });

  private andExpression = this.RULE("andExpression", () => {
    this.SUBRULE(this.condition);
    this.MANY(() => {
      this.CONSUME(And);
      this.SUBRULE2(this.condition);
    });
  });

  private condition = this.RULE("condition", () => {
    this.CONSUME(Identifier);
    this.OR([
      {
        ALT: () => {
          this.CONSUME(Is);
          this.CONSUME(Between);
          this.CONSUME1(StringLiteral);
          this.CONSUME(And);
          this.CONSUME2(StringLiteral);
        },
      },
      {
        ALT: () => {
          this.CONSUME1(Is);
          this.OR2([
            {
              ALT: () => {
                this.CONSUME3(StringLiteral);
              },
            },
            {
              ALT: () => {
                this.CONSUME1(Identifier);
              },
            },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME(GreaterThan);
          this.OR3([
            {
              ALT: () => {
                this.CONSUME1(NumberLiteral);
              },
            },
            {
              ALT: () => {
                this.CONSUME2(Identifier);
              },
            },
          ]);
        },
      },
      {
        ALT: () => {
          this.CONSUME(LessThan);
          this.OR4([
            {
              ALT: () => {
                this.CONSUME2(NumberLiteral);
              },
            },
            {
              ALT: () => {
                this.CONSUME3(Identifier);
              },
            },
          ]);
        },
      },
    ]);
  });

  private thenClause = this.RULE("thenClause", () => {
    this.CONSUME(Then);
    this.CONSUME(Apply);
    this.CONSUME(NumberLiteral);
    this.CONSUME(Percent);
    this.CONSUME(BusinessTerm);
    this.CONSUME(To);
    this.CONSUME(Identifier);
  });

  private defineClause = this.RULE("defineClause", () => {
    this.CONSUME(Define);
    this.CONSUME(Identifier);
    this.CONSUME(As);
    this.OR([
      {
        ALT: () => {
          this.CONSUME(StringLiteral);
        },
      },
      {
        ALT: () => {
          this.CONSUME(NumberLiteral);
        },
      },
      {
        ALT: () => {
          this.CONSUME1(Identifier);
        },
      },
    ]);
  });
}

export const parser = new RuleParser();
export const lexer = new Lexer(allTokens);
