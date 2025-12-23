const Observer = require('./Observer');
const Analysis = require('../models/Analysis');

class HistoryObserver extends Observer {
    /**
     * Updates logic when notified.
     * @param {Object} data - { userId, inputType, content, result }
     */
    async update(data) {
        try {
            console.log('HistoryObserver: Saving analysis to history...');
            const analysis = new Analysis({
                userId: data.userId,
                inputType: data.inputType,
                content: data.content,
                result: data.result
            });
            await analysis.save();
            console.log('HistoryObserver: Analysis saved.');
        } catch (error) {
            console.error('HistoryObserver Error:', error);
        }
    }
}

module.exports = HistoryObserver;
