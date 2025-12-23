const mongoose = require('mongoose');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.connection = null;
    Database.instance = this;
  }

  /**
   * Get the singleton instance of the Database.
   * @returns {Database}
   */
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Connect to MongoDB.
   * @param {string} uri 
   */
  async connect(uri) {
    if (this.connection) {
      console.log('Using existing database connection.');
      return;
    }

    try {
      this.connection = await mongoose.connect(uri);
      console.log('Database connected successfully (Singleton).');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  }
}

module.exports = Database;
