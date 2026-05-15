// eslint.config.js
import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default [
    // Base recommended config for all files
    js.configs.recommended,

    // Jest plugin config (uses recommended rules from "plugin:jest/recommended")
    {
        files: ["**/*.test.js"], // Apply Jest rules only to test files
        plugins: {
            jest: jest
        },
        languageOptions: {
            globals: {
                ...globals.jest, // Includes 'describe', 'test', 'expect', etc.
                ...globals.node,  // Includes 'require', 'module', etc. (for your test file)
                ...globals.es2021
            }
        },
        rules: {
            // Your custom Jest rules
            "jest/no-disabled-tests": "warn",
            "jest/no-conditional-expect": "error",
            "jest/no-identical-title": "error",
            
            // These are automatically included from 'plugin:jest/recommended',
            // but you can override them here if needed.
            // "jest/valid-expect": "error", 
        }
    },

    // Optional: If your source files (src/*.js) are also Node modules
    {
        files: ["src/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021
            }
        }
    }
];