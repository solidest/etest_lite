const conf = {
    comments: {
        lineComment: "//",
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"', notIn: ["string"] },
        { open: "'", close: "'", notIn: ["string"] },
    ],
    surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    indentationRules: {
        increaseIndentPattern: new RegExp(
            "^((?!(\\-\\-)).)*((\\b(device|protocol|topology|oneof|as|linking|mapping|binding)\\b((?!\\b(\\})\\b).)*)|(\\{\\s*))$"
        ),
        decreaseIndentPattern: new RegExp(
            "^\\s*((\\})|(\\)))"
        ),
    },
};

const language = {
    defaultToken: "",
    tokenPostfix: ".etl",

    keywords: [
        "false",
        "this",
        "true",
        "protocol",
        "device",
        "topology",
        "oneof",
        "as",
        "this",
    ],
    brackets: [
        { token: "delimiter.bracket", open: "{", close: "}" },
        { token: "delimiter.array", open: "[", close: "]" },
        { token: "delimiter.parenthesis", open: "(", close: ")" },
    ],
    operators: [
        "+",
        "-",
        "*",
        "/",
        "%",
        "^",
        "#",
        "==",
        "~=",
        "<=",
        ">=",
        "<",
        ">",
        "=",
        ";",
        ":",
        ",",
        ".",
    ],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*/^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            [/\b(segment|segments|linking|binding|mapping|udp|tcp_server|tcp_client|serial_ttl|serial_232|serial_422|serial_485|serial_usb|can|di|do|ai|ao)\b/, 'regexp'],
            [/\b(and|or|not)\b/, 'operators'],
            [/\b^[a-zA-Z_$][a-zA-Z0-9_]*(?=[;(])/, 'number.binary'],
            // identifiers and keywords
            [
                /[a-zA-Z_]\w*/,
                {
                    cases: {
                        "@keywords": { token: "keyword.$0" },
                        "@default": "attribute.name",
                    },
                },
            ],
            // whitespace
            { include: "@whitespace" },
            // keys
            [
                /(,)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/,
                ["delimiter", "", "key", "", "delimiter"],
            ],
            [
                /({)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/,
                ["@brackets", "", "key", "", "delimiter"],
            ],
            // Multiline string, needs to be added before brackets
            // [/\[(=*)\[/, "string", "@string_multiline"],
            // delimiters and operators
            [/[{}()[\]]/, "@brackets"],
            [
                /@symbols/,
                {
                    cases: {
                        "@operators": "delimiter",
                        "@default": "",
                    },
                },
            ],
            // numbers
            [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
            [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
            [/\d+?/, "number"],
            // delimiter: after number because of .\d floats
            [/[;,.]/, "delimiter"],
            // strings: recover on non-terminated strings
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/'([^'\\]|\\.)*$/, "string.invalid"],
            [/"/, "string", '@string."'],
            [/'/, "string", "@string.'"],
        ],
        whitespace: [
            [/[ \t\r\n]+/, ""],
            [/\/\/.*$/, "comment"],
        ],
        string: [
            [/[^\\"']+/, "string"],
            [/@escapes/, "string.escape"],
            [/\\./, "string.escape.invalid"],
            [
                /["']/,
                {
                    cases: {
                        "$#==$S2": { token: "string", next: "@pop" },
                        "@default": "string",
                    },
                },
            ],
        ],
    },
};

export default {conf, language}