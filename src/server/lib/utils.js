"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes new line characters and trailing whitespace
 * @param text
 */
exports.strip = function (text) {
    if (text === null || text === undefined || text === "")
        return text;
    return text
        .replace('\n', '')
        .trim();
};
