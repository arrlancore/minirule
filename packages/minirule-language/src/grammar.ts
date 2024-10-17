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
    [keywords.discount, keywords.bonus].map((key) => `\\b${key}\\b`).join("|"),
    "i"
  ),
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
  Apply,
  To,
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
    this.MANY_SEP({
      SEP: And,
      DEF: () => this.SUBRULE(this.condition),
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
          this.CONSUME3(StringLiteral);
        },
      },
      {
        ALT: () => {
          this.CONSUME(GreaterThan);
          this.CONSUME1(NumberLiteral);
        },
      },
      {
        ALT: () => {
          this.CONSUME(LessThan);
          this.CONSUME2(NumberLiteral);
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
}

export const parser = new RuleParser();
export const lexer = new Lexer(allTokens);
