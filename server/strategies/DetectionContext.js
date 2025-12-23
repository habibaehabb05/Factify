/**
 * Strategy Pattern: Context
 * Defines the interface of interest to clients and maintains
 * a reference to a Strategy object.
 */
class DetectionContext {
    constructor() {
        this.strategy = null;
    }

    /**
     * Set the strategy dynamically at runtime.
     * @param {DetectionStrategy} strategy 
     */
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async executeStrategy(input) {
        if (!this.strategy) {
            throw new Error("Strategy not set");
        }
        return await this.strategy.analyze(input);
    }
}

module.exports = DetectionContext;
