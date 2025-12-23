class AnalysisSubject {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    async notify(data) {
        console.log(`AnalysisSubject: Notifying ${this.observers.length} observers...`);
        for (const observer of this.observers) {
            await observer.update(data);
        }
    }
}

module.exports = AnalysisSubject;
