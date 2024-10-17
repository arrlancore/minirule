export const keywords = {
  rule: "RULE",
  when: "WHEN",
  then: "THEN",
  end: "END",
  is: "IS",
  between: "BETWEEN",
  and: "AND",
  apply: "APPLY",
  to: "TO",
  discount: "DISCOUNT",
  bonus: "BONUS",
  fee: "FEE",
};

export const operators = [">", "<", "%"];

export const tokens = {
  keywords: [
    keywords.rule,
    keywords.when,
    keywords.then,
    keywords.end,
    keywords.is,
    keywords.between,
    keywords.and,
    keywords.apply,
    keywords.to,
    keywords.discount,
    keywords.bonus,
  ],
  stringPattern: /"[^"]*"/,
  numberPattern: /\d+(\.\d+)?/,
  operatorPattern: new RegExp(operators.join("|")),
  identifierPattern: /[a-zA-Z][a-zA-Z0-9.]*/,
};
