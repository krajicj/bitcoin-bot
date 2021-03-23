/**
 * Check if string json or not
 * 
 * @param {string} str string to test json syntax
 * @returns true if json false otherwise
 */
exports.isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}