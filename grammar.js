module.exports = grammar({
  name: "calc",

  extras: $ => [
    /[ \t\r]/,
    $.result_comment,
    $.comment,
  ],

  rules: {
    source_file: $ => seq(
      repeat($._line),
      optional($.statement),
    ),

    _line: $ => seq(
      optional($.statement),
      "\n",
    ),

    statement: $ => choice(
      $.section_header,
      $.assignment_statement,
      $.expression_statement,
    ),

    section_header: $ => seq(
      field("name", $.identifier),
      ":",
    ),

    assignment_statement: $ => seq(
      field("name", $.identifier),
      "=",
      field("value", $.expression),
    ),

    expression_statement: $ => $.expression,

    expression: $ => choice(
      $.number,
      $.currency,
      $.money,
      $.text,
      $.boolean,
      $.list,
      $.qualified_identifier,
      $.parenthesized_expression,
      $.unary_expression,
      $.binary_expression,
    ),

    parenthesized_expression: $ => seq(
      "(",
      $.expression,
      ")",
    ),

    unary_expression: $ => prec(3, seq(
      field("operator", "-"),
      field("argument", $.expression),
    )),

    binary_expression: $ => choice(
      prec.left(1, seq(
        field("left", $.expression),
        field("operator", choice("+", "-")),
        field("right", $.expression),
      )),
      prec.left(2, seq(
        field("left", $.expression),
        field("operator", choice("*", "/")),
        field("right", $.expression),
      )),
    ),

    number: $ => token(choice(
      /\d+(\.\d*)?/,
      /\.\d+/,
    )),

    currency: $ => token(choice(
      /[A-Z]{3}/,
      "£",
      "$",
      "€",
    )),

    money: $ => token(seq(
      choice(/[A-Z]{3}/, "£", "$", "€"),
      choice(
        /\d+(\.\d*)?/,
        /\.\d+/,
      ),
    )),

    text: $ => token(seq(
      '"',
      repeat(/[^"]/),
      '"',
    )),

    boolean: $ => choice("true", "false"),

    list: $ => seq(
      "[",
      $.expression,
      repeat(seq(",", $.expression)),
      optional(","),
      "]",
    ),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

    qualified_identifier: $ => seq(
      $.identifier,
      repeat(seq(".", $.identifier)),
    ),

    result_comment: $ => token(seq("#", /[ \t]*/, "=", /.*/)),

    comment: $ => token(seq("#", /.*/)),
  },
});
