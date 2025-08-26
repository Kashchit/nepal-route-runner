const { Pool } = require('pg');
require('dotenv').config({ path: './config.env' });

class SampleRunsAdder {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  async addSampleRuns() {
    try {
      console.log('🏃‍♂️ Adding sample runs to populate leaderboards...');
      
      // Get users and routes
      const usersResult = await this.pool.query('SELECT id, username FROM users LIMIT 4');
      const routesResult = await this.pool.query('SELECT id, name, distance FROM routes LIMIT 6');
      
      const users = usersResult.rows;
      const routes = routesResult.rows;
      
      if (users.length === 0 || routes.length === 0) {
        console.log('❌ No users or routes found. Please run seed-data.js first.');
        return;
      }

      const sampleRuns = [
        // User 1 - Multiple runs
        {
          user_id: users[0].id,
          route_id: routes[0].id,
          start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          duration: 7200, // 2 hours
          distance: 15.5,
          pace: 278.7, // 4:38/km
          average_speed: 7.75,
          max_speed: 12.0,
          calories_burned: 1200,
          weather_conditions: { temperature: 15, weather: 'sunny', humidity: 60 }
        },
        {
          user_id: users[0].id,
          route_id: routes[1].id,
          start_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          duration: 5400, // 1.5 hours
          distance: 12.0,
          pace: 270.0, // 4:30/km
          average_speed: 8.0,
          max_speed: 10.5,
          calories_burned: 850,
          weather_conditions: { temperature: 22, weather: 'partly_cloudy', humidity: 70 }
        },
        // User 2 - Multiple runs
        {
          user_id: users[1].id,
          route_id: routes[2].id,
          start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          duration: 3600, // 1 hour
          distance: 8.5,
          pace: 254.1, // 4:14/km
          average_speed: 8.5,
          max_speed: 11.0,
          calories_burned: 600,
          weather_conditions: { temperature: 18, weather: 'clear', humidity: 65 }
        },
        {
          user_id: users[1].id,
          route_id: routes[3].id,
          start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          duration: 6000, // 1.67 hours
          distance: 20.0,
          pace: 300.0, // 5:00/km
          average_speed: 6.0,
          max_speed: 8.5,
          calories_burned: 1400,
          weather_conditions: { temperature: 12, weather: 'cloudy', humidity: 80 }
        },
        // User 3 - One run
        {
          user_id: users[2].id,
          route_id: routes[4].id,
          start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          duration: 4800, // 1.33 hours
          distance: 15.0,
          pace: 288.0, // 4:48/km
          average_speed: 7.5,
          max_speed: 9.0,
          calories_burned: 1100,
          weather_conditions: { temperature: 16, weather: 'overcast', humidity: 75 }
        },
        // User 4 - One run
        {
          user_id: users[3].id,
          route_id: routes[5].id,
          start_time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
          duration: 2700, // 45 minutes
          distance: 6.0,
          pace: 270.0, // 4:30/km
          average_speed: 8.0,
          max_speed: 10.0,
          calories_burned: 450,
          weather_conditions: { temperature: 20, weather: 'sunny', humidity: 55 }
        }
      ];

      for (const run of sampleRuns) {
        const end_time = new Date(run.start_time.getTime() + run.duration * 1000);
        
        await this.pool.query(
          `INSERT INTO user_runs (user_id, route_id, start_time, end_time, duration, distance, pace, average_speed, max_speed, calories_burned, weather_conditions)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT DO NOTHING`,
          [
            run.user_id,
            run.route_id,
            run.start_time,
            end_time,
            run.duration,
            run.distance,
            run.pace,
            run.average_speed,
            run.max_speed,
            run.calories_burned,
            JSON.stringify(run.weather_conditions)
          ]
        );
        
        console.log(`✅ Added run: ${users.find(u => u.id === run.user_id)?.username} on ${routes.find(r => r.id === run.route_id)?.name}`);
      }

      // Update leaderboards
      console.log('📊 Updating leaderboards...');
      await this.pool.query(`
        INSERT INTO leaderboard (user_id, route_id, best_time, total_runs, total_distance, total_duration, average_pace, fastest_pace, last_run_date)
        SELECT 
          ur.user_id,
          ur.route_id,
          MIN(ur.duration) as best_time,
          COUNT(*) as total_runs,
          SUM(ur.distance) as total_distance,
          SUM(ur.duration) as total_duration,
          AVG(ur.pace) as average_pace,
          MIN(ur.pace) as fastest_pace,
          MAX(ur.start_time) as last_run_date
        FROM user_runs ur
        GROUP BY ur.user_id, ur.route_id
        ON CONFLICT (user_id, route_id) DO UPDATE SET
          best_time = CASE WHEN EXCLUDED.best_time < leaderboard.best_time OR leaderboard.best_time IS NULL 
                           THEN EXCLUDED.best_time ELSE leaderboard.best_time END,
          total_runs = EXCLUDED.total_runs,
          total_distance = EXCLUDED.total_distance,
          total_duration = EXCLUDED.total_duration,
          average_pace = EXCLUDED.average_pace,
          fastest_pace = CASE WHEN EXCLUDED.fastest_pace < leaderboard.fastest_pace OR leaderboard.fastest_pace IS NULL 
                             THEN EXCLUDED.fastest_pace ELSE leaderboard.fastest_pace END,
          last_run_date = EXCLUDED.last_run_date,
          updated_at = CURRENT_TIMESTAMP
      `);
      
      console.log('✅ Sample runs added and leaderboards updated!');
      
      // Show summary
      const runCount = await this.pool.query('SELECT COUNT(*) FROM user_runs');
      const leaderboardCount = await this.pool.query('SELECT COUNT(*) FROM leaderboard');
      
      console.log('\n📊 Summary:');
      console.log(`   Total Runs: ${runCount.rows[0].count}`);
      console.log(`   Leaderboard Entries: ${leaderboardCount.rows[0].count}`);
      
    } catch (error) {
      console.error('❌ Error adding sample runs:', error);
      throw error;
    } finally {
      await this.pool.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const adder = new SampleRunsAdder();
  adder.addSampleRuns().catch(console.error);
}

module.exports = SampleRunsAdder;
