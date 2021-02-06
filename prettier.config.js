module.exports = {
    jsxBracketSameLine: false,
    printWidth: 80,
    proseWrap: 'always',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,

    overrides: [
        {
            files: ['*.md'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
