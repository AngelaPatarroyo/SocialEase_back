const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Database Index Management Utility
 * Helps monitor and manage database indexes for optimal performance
 */
class IndexManager {
  /**
   * Get all indexes for a specific collection
   */
  static async getCollectionIndexes(collectionName) {
    try {
      const collection = mongoose.connection.collection(collectionName);
      const indexes = await collection.indexes();
      return indexes;
    } catch (error) {
      logger.error(`Failed to get indexes for ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get index statistics for all collections
   */
  static async getAllIndexStats() {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const stats = {};

      for (const collection of collections) {
        const collectionName = collection.name;
        const indexes = await this.getCollectionIndexes(collectionName);
        
        stats[collectionName] = {
          totalIndexes: indexes.length,
          indexes: indexes.map(index => ({
            name: index.name,
            key: index.key,
            unique: index.unique || false,
            sparse: index.sparse || false
          }))
        };
      }

      return stats;
    } catch (error) {
      logger.error('Failed to get index statistics:', error);
      throw error;
    }
  }

  /**
   * Check if specific indexes exist
   */
  static async checkIndexExists(collectionName, indexKey) {
    try {
      const indexes = await this.getCollectionIndexes(collectionName);
      return indexes.some(index => 
        JSON.stringify(index.key) === JSON.stringify(indexKey)
      );
    } catch (error) {
      logger.error(`Failed to check index existence for ${collectionName}:`, error);
      return false;
    }
  }

  /**
   * Get index usage statistics (requires MongoDB 4.2+)
   */
  static async getIndexUsageStats() {
    try {
      const db = mongoose.connection.db;
      const stats = await db.command({ indexStats: '*' });
      return stats;
    } catch (error) {
      logger.warn('Index usage stats not available (requires MongoDB 4.2+):', error.message);
      return null;
    }
  }

  /**
   * Log index information for debugging
   */
  static async logIndexInfo() {
    try {
      const stats = await this.getAllIndexStats();
      
      logger.info('📊 Database Index Summary:');
      Object.entries(stats).forEach(([collection, info]) => {
        logger.info(`  ${collection}: ${info.totalIndexes} indexes`);
        info.indexes.forEach(index => {
          logger.info(`    - ${index.name}: ${JSON.stringify(index.key)}`);
        });
      });

      // Try to get usage stats
      const usageStats = await this.getIndexUsageStats();
      if (usageStats) {
        logger.info('📈 Index Usage Statistics Available');
      }
    } catch (error) {
      logger.error('Failed to log index information:', error);
    }
  }

  /**
   * Validate critical indexes exist
   */
  static async validateCriticalIndexes() {
    const criticalIndexes = {
      'users': [
        { email: 1 },
        { role: 1 },
        { xp: -1 }
      ],
      'scenarios': [
        { slug: 1 },
        { difficulty: 1 }
      ],
      'feedback': [
        { userId: 1 },
        { scenarioId: 1 }
      ],
      'progress': [
        { userId: 1 }
      ]
    };

    const results = {};
    
    for (const [collection, indexes] of Object.entries(criticalIndexes)) {
      results[collection] = {};
      
      for (const indexKey of indexes) {
        const exists = await this.checkIndexExists(collection, indexKey);
        results[collection][JSON.stringify(indexKey)] = exists;
      }
    }

    return results;
  }
}

module.exports = IndexManager;
