const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

class DataSeeder {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  async seedUsers() {
    console.log('👥 Seeding users...');
    
    const users = [
      {
        username: 'sherpa_runner',
        email: 'sherpa@example.com',
        password: 'password123',
        first_name: 'Tenzing',
        last_name: 'Sherpa',
        bio: 'Mountain runner from Solukhumbu. Love exploring high-altitude trails.',
        location: 'Solukhumbu, Nepal',
        gender: 'male',
        date_of_birth: '1990-05-15'
      },
      {
        username: 'kathmandu_jogger',
        email: 'jogger@example.com',
        password: 'password123',
        first_name: 'Priya',
        last_name: 'Shrestha',
        bio: 'City runner exploring Kathmandu Valley heritage trails.',
        location: 'Kathmandu, Nepal',
        gender: 'female',
        date_of_birth: '1988-12-03'
      },
      {
        username: 'pokhara_trail',
        email: 'trail@example.com',
        password: 'password123',
        first_name: 'Raj',
        last_name: 'Gurung',
        bio: 'Trail runner from Pokhara. Expert in Annapurna region routes.',
        location: 'Pokhara, Nepal',
        gender: 'male',
        date_of_birth: '1992-08-22'
      },
      {
        username: 'demo_user',
        email: 'demo@example.com',
        password: 'password123',
        first_name: 'Demo',
        last_name: 'User',
        bio: 'Demo account for testing the application.',
        location: 'Nepal',
        gender: 'other',
        date_of_birth: '1995-01-01'
      }
    ];

    const createdUsers = [];
    
    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      const result = await this.pool.query(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, bio, location, gender, date_of_birth)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (username) DO NOTHING
         RETURNING id, username, email`,
        [user.username, user.email, passwordHash, user.first_name, user.last_name, user.bio, user.location, user.gender, user.date_of_birth]
      );
      
      if (result.rows.length > 0) {
        createdUsers.push(result.rows[0]);
        console.log(`✅ Created user: ${user.username}`);
      } else {
        console.log(`⏭️  User already exists: ${user.username}`);
      }
    }
    
    return createdUsers;
  }

  async seedRoutes() {
    console.log('🏃‍♂️ Seeding routes...');
    
    const routes = [
      {
        name: 'Annapurna Base Camp Trek',
        description: 'A classic trek to the base camp of Annapurna I, the 10th highest mountain in the world. This route offers stunning views of the Annapurna massif and passes through traditional Gurung villages.',
        distance: 115.0,
        elevation_gain: 4130,
        elevation_loss: 4130,
        difficulty: 'hard',
        district: 'Kaski',
        region: 'Gandaki',
        coordinates: {
          start: { lat: 28.3949, lng: 83.8566 },
          end: { lat: 28.5964, lng: 83.8203 },
          waypoints: [
            { lat: 28.3949, lng: 83.8566, name: 'Nayapul' },
            { lat: 28.4567, lng: 83.8234, name: 'Ghandruk' },
            { lat: 28.5234, lng: 83.8123, name: 'Chhomrong' },
            { lat: 28.5964, lng: 83.8203, name: 'Annapurna Base Camp' }
          ]
        },
        surface_type: 'trail',
        route_type: 'trek',
        estimated_time: 1440, // 24 hours
        best_season: 'March-May, September-November',
        highlights: ['Annapurna massif views', 'Gurung culture', 'Rhododendron forests', 'Hot springs'],
        warnings: ['High altitude', 'Weather changes', 'Permit required']
      },
      {
        name: 'Everest Base Camp Trek',
        description: 'The ultimate trek to the base of the world\'s highest mountain. Experience the unique Sherpa culture and breathtaking Himalayan views.',
        distance: 130.0,
        elevation_gain: 5364,
        elevation_loss: 5364,
        difficulty: 'expert',
        district: 'Solukhumbu',
        region: 'Sagarmatha',
        coordinates: {
          start: { lat: 27.7172, lng: 86.7144 },
          end: { lat: 28.0026, lng: 86.8528 },
          waypoints: [
            { lat: 27.7172, lng: 86.7144, name: 'Lukla' },
            { lat: 27.8234, lng: 86.7456, name: 'Namche Bazaar' },
            { lat: 27.9123, lng: 86.7890, name: 'Dingboche' },
            { lat: 28.0026, lng: 86.8528, name: 'Everest Base Camp' }
          ]
        },
        surface_type: 'trail',
        route_type: 'trek',
        estimated_time: 1680, // 28 hours
        best_season: 'March-May, September-November',
        highlights: ['Mount Everest views', 'Sherpa culture', 'Namche Bazaar', 'Kala Patthar'],
        warnings: ['Extreme altitude', 'Acute mountain sickness risk', 'Permit required', 'Weather dependent']
      },
      {
        name: 'Pokhara Lakeside Run',
        description: 'A scenic run around the beautiful Phewa Lake in Pokhara. Perfect for beginners and those looking for a relaxing run with mountain views.',
        distance: 8.5,
        elevation_gain: 150,
        elevation_loss: 150,
        difficulty: 'easy',
        district: 'Kaski',
        region: 'Gandaki',
        coordinates: {
          start: { lat: 28.2096, lng: 83.9856 },
          end: { lat: 28.2096, lng: 83.9856 },
          waypoints: [
            { lat: 28.2096, lng: 83.9856, name: 'Lakeside Start' },
            { lat: 28.2156, lng: 83.9912, name: 'Barahi Temple' },
            { lat: 28.2096, lng: 83.9856, name: 'Lakeside End' }
          ]
        },
        surface_type: 'paved',
        route_type: 'road',
        estimated_time: 60, // 1 hour
        best_season: 'Year-round',
        highlights: ['Phewa Lake views', 'Machapuchare views', 'Barahi Temple', 'Peaceful atmosphere'],
        warnings: ['Tourist area', 'Crowded during peak season']
      },
      {
        name: 'Kathmandu Valley Heritage Trail',
        description: 'Explore the ancient temples and heritage sites of Kathmandu Valley. This route takes you through UNESCO World Heritage sites.',
        distance: 12.0,
        elevation_gain: 300,
        elevation_loss: 300,
        difficulty: 'medium',
        district: 'Kathmandu',
        region: 'Bagmati',
        coordinates: {
          start: { lat: 27.7172, lng: 85.3240 },
          end: { lat: 27.7172, lng: 85.3240 },
          waypoints: [
            { lat: 27.7172, lng: 85.3240, name: 'Durbar Square' },
            { lat: 27.7234, lng: 85.3456, name: 'Swayambhunath' },
            { lat: 27.7123, lng: 85.3567, name: 'Pashupatinath' },
            { lat: 27.7172, lng: 85.3240, name: 'Boudhanath' }
          ]
        },
        surface_type: 'mixed',
        route_type: 'urban',
        estimated_time: 120, // 2 hours
        best_season: 'October-June',
        highlights: ['UNESCO World Heritage sites', 'Ancient temples', 'Cultural experience', 'City views'],
        warnings: ['Traffic', 'Air pollution', 'Entry fees for some sites']
      },
      {
        name: 'Chitwan Jungle Trail',
        description: 'A unique running experience through the Terai lowlands of Chitwan National Park. Spot wildlife while running through beautiful landscapes.',
        distance: 15.0,
        elevation_gain: 100,
        elevation_loss: 100,
        difficulty: 'medium',
        district: 'Chitwan',
        region: 'Narayani',
        coordinates: {
          start: { lat: 27.5234, lng: 84.3456 },
          end: { lat: 27.5234, lng: 84.3456 },
          waypoints: [
            { lat: 27.5234, lng: 84.3456, name: 'Sauraha' },
            { lat: 27.5345, lng: 84.3567, name: 'Jungle Trail' },
            { lat: 27.5234, lng: 84.3456, name: 'Riverside' }
          ]
        },
        surface_type: 'trail',
        route_type: 'wildlife',
        estimated_time: 90, // 1.5 hours
        best_season: 'October-March',
        highlights: ['Wildlife spotting', 'Jungle atmosphere', 'Rapti River views', 'Tharu culture'],
        warnings: ['Wildlife encounters', 'Guide recommended', 'Park fees']
      },
      {
        name: 'Lumbini Peace Run',
        description: 'A spiritual running experience through the birthplace of Buddha. Run through peaceful gardens and ancient monasteries.',
        distance: 6.0,
        elevation_gain: 50,
        elevation_loss: 50,
        difficulty: 'easy',
        district: 'Rupandehi',
        region: 'Lumbini',
        coordinates: {
          start: { lat: 27.4567, lng: 83.2345 },
          end: { lat: 27.4567, lng: 83.2345 },
          waypoints: [
            { lat: 27.4567, lng: 83.2345, name: 'Maya Devi Temple' },
            { lat: 27.4678, lng: 83.2456, name: 'World Peace Pagoda' },
            { lat: 27.4567, lng: 83.2345, name: 'Monastery Gardens' }
          ]
        },
        surface_type: 'paved',
        route_type: 'spiritual',
        estimated_time: 45, // 45 minutes
        best_season: 'October-March',
        highlights: ['Buddhist heritage', 'Peaceful atmosphere', 'International monasteries', 'Sacred gardens'],
        warnings: ['Respectful behavior required', 'Entry fees']
      }
    ];

    const createdRoutes = [];
    
    for (const route of routes) {
      const result = await this.pool.query(
        `INSERT INTO routes (name, description, distance, elevation_gain, elevation_loss, difficulty, district, region, coordinates, surface_type, route_type, estimated_time, best_season, highlights, warnings)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT DO NOTHING
         RETURNING id, name, district`,
        [
          route.name,
          route.description,
          route.distance,
          route.elevation_gain,
          route.elevation_loss,
          route.difficulty,
          route.district,
          route.region,
          JSON.stringify(route.coordinates),
          route.surface_type,
          route.route_type,
          route.estimated_time,
          route.best_season,
          route.highlights,
          route.warnings
        ]
      );
      
      if (result.rows.length > 0) {
        createdRoutes.push(result.rows[0]);
        console.log(`✅ Created route: ${route.name} (${route.district})`);
      } else {
        console.log(`⏭️  Route already exists: ${route.name}`);
      }
    }
    
    return createdRoutes;
  }

  async seedAchievements() {
    console.log('🏆 Seeding achievements...');
    
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete your first run',
        icon: '👟',
        criteria: { type: 'first_run' },
        points: 10
      },
      {
        name: 'Mountain Goat',
        description: 'Complete 5 high-altitude routes',
        icon: '🏔️',
        criteria: { type: 'altitude_runs', count: 5, min_elevation: 3000 },
        points: 50
      },
      {
        name: 'Heritage Explorer',
        description: 'Run through 3 UNESCO World Heritage sites',
        icon: '🏛️',
        criteria: { type: 'heritage_sites', count: 3 },
        points: 30
      },
      {
        name: 'Distance Master',
        description: 'Run a total of 100km',
        icon: '📏',
        criteria: { type: 'total_distance', distance: 100 },
        points: 100
      },
      {
        name: 'Speed Demon',
        description: 'Complete a run with pace under 5:00/km',
        icon: '⚡',
        criteria: { type: 'fast_pace', pace: 300 },
        points: 75
      }
    ];

    for (const achievement of achievements) {
      await this.pool.query(
        `INSERT INTO achievements (name, description, icon, criteria, points)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [
          achievement.name,
          achievement.description,
          achievement.icon,
          JSON.stringify(achievement.criteria),
          achievement.points
        ]
      );
      console.log(`✅ Created achievement: ${achievement.name}`);
    }
  }

  async seedChallenges() {
    console.log('🎯 Seeding challenges...');
    
    const challenges = [
      {
        name: 'Annapurna Challenge',
        description: 'Complete all routes in the Annapurna region within 30 days',
        start_date: '2025-09-01',
        end_date: '2025-09-30',
        target_distance: 200.0,
        target_runs: 5,
        district: 'Kaski',
        difficulty: 'hard'
      },
      {
        name: 'Heritage Explorer',
        description: 'Visit all UNESCO World Heritage sites in Kathmandu Valley',
        start_date: '2025-08-01',
        end_date: '2025-12-31',
        target_runs: 3,
        district: 'Kathmandu',
        difficulty: 'medium'
      },
      {
        name: 'Altitude Training',
        description: 'Complete high-altitude routes with total elevation gain of 10,000m',
        start_date: '2025-10-01',
        end_date: '2025-11-30',
        target_elevation: 10000,
        difficulty: 'expert'
      }
    ];

    for (const challenge of challenges) {
      await this.pool.query(
        `INSERT INTO challenges (name, description, start_date, end_date, target_distance, target_runs, target_elevation, district, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT DO NOTHING`,
        [
          challenge.name,
          challenge.description,
          challenge.start_date,
          challenge.end_date,
          challenge.target_distance,
          challenge.target_runs,
          challenge.target_elevation,
          challenge.district,
          challenge.difficulty
        ]
      );
      console.log(`✅ Created challenge: ${challenge.name}`);
    }
  }

  async seedSampleRuns(users, routes) {
    console.log('🏃‍♂️ Seeding sample runs...');
    
    const sampleRuns = [
      {
        user: 'sherpa_runner',
        route: 'Everest Base Camp Trek',
        start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        duration: 7200, // 2 hours
        distance: 15.5,
        pace: 278.7, // 4:38/km
        average_speed: 7.75,
        max_speed: 12.0,
        calories_burned: 1200,
        elevation_gain: 800,
        weather_conditions: { temperature: 15, weather: 'sunny', humidity: 60 }
      },
      {
        user: 'kathmandu_jogger',
        route: 'Kathmandu Valley Heritage Trail',
        start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 5400, // 1.5 hours
        distance: 12.0,
        pace: 270.0, // 4:30/km
        average_speed: 8.0,
        max_speed: 10.5,
        calories_burned: 850,
        elevation_gain: 300,
        weather_conditions: { temperature: 22, weather: 'partly_cloudy', humidity: 70 }
      },
      {
        user: 'pokhara_trail',
        route: 'Pokhara Lakeside Run',
        start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        duration: 3600, // 1 hour
        distance: 8.5,
        pace: 254.1, // 4:14/km
        average_speed: 8.5,
        max_speed: 11.0,
        calories_burned: 600,
        elevation_gain: 150,
        weather_conditions: { temperature: 18, weather: 'clear', humidity: 65 }
      },
      {
        user: 'demo_user',
        route: 'Annapurna Base Camp Trek',
        start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        duration: 6000, // 1.67 hours
        distance: 20.0,
        pace: 300.0, // 5:00/km
        average_speed: 6.0,
        max_speed: 8.5,
        calories_burned: 1400,
        elevation_gain: 1200,
        weather_conditions: { temperature: 12, weather: 'cloudy', humidity: 80 }
      }
    ];

    for (const run of sampleRuns) {
      const user = users.find(u => u.username === run.user);
      const route = routes.find(r => r.name === run.route);
      
      if (user && route) {
        const end_time = new Date(run.start_time.getTime() + run.duration * 1000);
        
                 await this.pool.query(
           `INSERT INTO user_runs (user_id, route_id, start_time, end_time, duration, distance, pace, average_speed, max_speed, calories_burned, weather_conditions)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT DO NOTHING`,
           [
             user.id,
             route.id,
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
        
        console.log(`✅ Created run: ${run.user} on ${run.route}`);
      }
    }
  }

  async updateLeaderboards() {
    console.log('📊 Updating leaderboards...');
    
    // This will be handled by triggers, but we can also run it manually
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
    
    console.log('✅ Leaderboards updated');
  }

  async seed() {
    try {
      console.log('🌱 Starting comprehensive data seeding...');
      
      const users = await this.seedUsers();
      const routes = await this.seedRoutes();
      await this.seedAchievements();
      await this.seedChallenges();
      await this.seedSampleRuns(users, routes);
      await this.updateLeaderboards();
      
      console.log('\n🎉 Data seeding completed successfully!');
      
      // Show summary
      const userCount = await this.pool.query('SELECT COUNT(*) FROM users');
      const routeCount = await this.pool.query('SELECT COUNT(*) FROM routes');
      const runCount = await this.pool.query('SELECT COUNT(*) FROM user_runs');
      const achievementCount = await this.pool.query('SELECT COUNT(*) FROM achievements');
      const challengeCount = await this.pool.query('SELECT COUNT(*) FROM challenges');
      
      console.log('\n📊 Database Summary:');
      console.log(`   Users: ${userCount.rows[0].count}`);
      console.log(`   Routes: ${routeCount.rows[0].count}`);
      console.log(`   Runs: ${runCount.rows[0].count}`);
      console.log(`   Achievements: ${achievementCount.rows[0].count}`);
      console.log(`   Challenges: ${challengeCount.rows[0].count}`);
      
    } catch (error) {
      console.error('❌ Error seeding data:', error);
      throw error;
    } finally {
      await this.pool.end();
    }
  }
}

// Run seeder if called directly
if (require.main === module) {
  const seeder = new DataSeeder();
  seeder.seed().catch(console.error);
}

module.exports = DataSeeder;
