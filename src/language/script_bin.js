
const language = {
    defaultToken: "",
    tokenPostfix: ".bin",
    tokenizer: {
        root: [
            [/[01]/, 'number.binary'],
            [/[^01]/, "string.invalid"],
        ],
    },
};

export default {language}