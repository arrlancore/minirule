const keywords = [
  "RULE",
  "WHEN",
  "THEN",
  "END",
  "IS",
  "BETWEEN",
  "AND",
  "APPLY",
  "TO",
  "DISCOUNT",
  "BONUS",
];
export const operators = [">", "<", "%"];

const keywordLower = keywords.map((keyword) => keyword.toLowerCase());
const keyword = [...keywordLower, ...keywords];

export const tokens = {
  stringPattern: /"[^"]*"/,
  numberPattern: /\d+(\.\d+)?/,
  operatorPattern: new RegExp(operators.join("|")),
  identifierPattern: /[a-zA-Z][a-zA-Z0-9.]*/,
};

export const configureMiniruleLanguage = (monaco: any) => {
  monaco.languages.register({ id: "minirule" });
  monaco.languages.setMonarchTokensProvider("minirule", {
    tokenizer: {
      root: [
        [new RegExp(keyword.join("|")), "keyword"],
        [tokens.stringPattern, "string"],
        [tokens.numberPattern, "number"],
        [tokens.operatorPattern, "operator"],
        [tokens.identifierPattern, "identifier"],
      ],
    },
  });
};
