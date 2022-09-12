module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:vue/essential", "plugin:prettier/recommended"],
    parserOptions: {
        ecmaVersion: 12,
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["vue", "@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": "error",
    },
};
