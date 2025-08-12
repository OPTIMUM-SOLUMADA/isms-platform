module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript"
    ],
    settings: {
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json"
            }
        }
    },
    rules: {
        // Disallow relative imports when an alias exists
        "no-restricted-imports": [
            "error",
            {
                patterns: ["../*", "./../*"]
            }
        ]
    }
}
