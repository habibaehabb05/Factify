/**
 * Strategy Pattern Interface (Abstract Class)
 * All detection strategies must implement the analyze method.
 */
class DetectionStrategy {
    constructor() {
        if (this.constructor === DetectionStrategy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * Analyze the input content
     * @param {string} input 
     * @returns {Promise<Object>} Analysis result
     */
    async analyze(input) {
        throw new Error("Method 'analyze()' must be implemented.");
    }
}

module.exports = DetectionStrategy;
