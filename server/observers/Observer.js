/**
 * Observer Pattern Interface
 */
class Observer {
    async update(data) {
        throw new Error("Observer.update() must be implemented");
    }
}

module.exports = Observer;
