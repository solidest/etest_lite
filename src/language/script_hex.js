
const language = {
    defaultToken: "",
    tokenPostfix: ".bin",
    tokenizer: {
        root: [
            [/[0-9a-fA-F]/, 'number.binary'],
            [/[^0-9a-fA-F]/, "string.invalid"],
        ],
    },
};

export default {language}