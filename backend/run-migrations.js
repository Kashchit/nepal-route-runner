const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './config.env' });

class MigrationRunner {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    this.migrationsDir = path.join(__dirname, 'migrations');
  }

  async init() {
    try {
      // Create migrations table if it doesn't exist
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Migrations table initialized');
    } catch (error) {
      console.error('❌ Error initializing migrations table:', error);
      throw error;
    }
  }

  async getExecutedMigrations() {
    const result = await this.pool.query('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map(row => row.filename);
  }

  async getMigrationFiles() {
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    return files;
  }

  async runMigration(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      console.log(`🔄 Running migration: ${filename}`);
      
      // Start transaction
      const client = await this.pool.connect();
      await client.query('BEGIN');
      
      // Execute migration
      await client.query(sql);
      
      // Record migration
      await client.query(
        'INSERT INTO migrations (filename) VALUES ($1)',
        [filename]
      );
      
      // Commit transaction
      await client.query('COMMIT');
      client.release();
      
      console.log(`✅ Migration completed: ${filename}`);
    } catch (error) {
      console.error(`❌ Migration failed: ${filename}`, error);
      throw error;
    }
  }

  async runMigrations() {
    try {
      console.log('🚀 Starting database migrations...');
      
      await this.init();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✅ All migrations are up to date');
        return;
      }
      
      console.log(`📋 Found ${pendingMigrations.length} pending migrations:`);
      pendingMigrations.forEach(file => console.log(`   - ${file}`));
      
      for (const migration of pendingMigrations) {
        await this.runMigration(migration);
      }
      
      console.log('🎉 All migrations completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration process failed:', error);
      throw error;
    } finally {
      await this.pool.end();
    }
  }

  async showStatus() {
    try {
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      console.log('\n📊 Migration Status:');
      console.log('==================');
      
      migrationFiles.forEach(file => {
        const status = executedMigrations.includes(file) ? '✅' : '⏳';
        console.log(`${status} ${file}`);
      });
      
      const pendingCount = migrationFiles.length - executedMigrations.length;
      console.log(`\n📈 Summary: ${executedMigrations.length} executed, ${pendingCount} pending`);
      
    } catch (error) {
      console.error('❌ Error showing migration status:', error);
    } finally {
      await this.pool.end();
    }
  }
}

// CLI interface
const command = process.argv[2];

async function main() {
  const runner = new MigrationRunner();
  
  try {
    switch (command) {
      case 'run':
        await runner.runMigrations();
        break;
      case 'status':
        await runner.showStatus();
        break;
      default:
        console.log('Usage: node run-migrations.js [run|status]');
        console.log('  run    - Execute pending migrations');
        console.log('  status - Show migration status');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration process failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MigrationRunner;
