const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all routes
router.get('/', async (req, res) => {
  try {
    const { district, difficulty, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM routes WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (district) {
      paramCount++;
      query += ` AND district ILIKE $${paramCount}`;
      params.push(`%${district}%`);
    }

    if (difficulty) {
      paramCount++;
      query += ` AND difficulty = $${paramCount}`;
      params.push(difficulty);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get route by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM routes WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new route (admin only - simplified for demo)
router.post('/', [
  body('name').notEmpty().withMessage('Route name is required'),
  body('description').optional(),
  body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('elevation_gain').isInt({ min: 0 }).withMessage('Elevation gain must be a positive integer'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('district').notEmpty().withMessage('District is required'),
  body('coordinates').isObject().withMessage('Coordinates must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, distance, elevation_gain, difficulty, district, coordinates } = req.body;

    const result = await pool.query(
      `INSERT INTO routes (name, description, distance, elevation_gain, difficulty, district, coordinates)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, distance, elevation_gain, difficulty, district, JSON.stringify(coordinates)]
    );

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start a run
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if route exists
    const routeResult = await pool.query(
      'SELECT * FROM routes WHERE id = $1',
      [id]
    );

    if (routeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Create new run record
    const runResult = await pool.query(
      `INSERT INTO user_runs (user_id, route_id, start_time)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       RETURNING *`,
      [userId, id]
    );

    res.status(201).json({
      success: true,
      message: 'Run started successfully',
      data: {
        run_id: runResult.rows[0].id,
        route: routeResult.rows[0],
        start_time: runResult.rows[0].start_time
      }
    });

  } catch (error) {
    console.error('Start run error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// End a run
router.post('/:id/end', authenticateToken, [
  body('run_id').isInt().withMessage('Run ID is required'),
  body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { run_id, distance } = req.body;
    const userId = req.user.id;

    // Get the run record
    const runResult = await pool.query(
      'SELECT * FROM user_runs WHERE id = $1 AND user_id = $2 AND route_id = $3',
      [run_id, userId, id]
    );

    if (runResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Run not found'
      });
    }

    const run = runResult.rows[0];

    if (run.end_time) {
      return res.status(400).json({
        success: false,
        message: 'Run has already ended'
      });
    }

    // Calculate duration and pace
    const endTime = new Date();
    const startTime = new Date(run.start_time);
    const duration = Math.floor((endTime - startTime) / 1000); // Duration in seconds
    const pace = distance > 0 ? duration / (distance / 1000) : 0; // Pace in seconds per km

    // Update run record
    const updateResult = await pool.query(
      `UPDATE user_runs 
       SET end_time = CURRENT_TIMESTAMP, duration = $1, distance = $2, pace = $3
       WHERE id = $4
       RETURNING *`,
      [duration, distance, pace, run_id]
    );

    // Update leaderboard
    await pool.query(
      `INSERT INTO leaderboard (user_id, route_id, best_time, total_runs, total_distance)
       VALUES ($1, $2, $3, 1, $4)
       ON CONFLICT (user_id, route_id)
       DO UPDATE SET
         best_time = CASE WHEN leaderboard.best_time IS NULL OR $3 < leaderboard.best_time 
                          THEN $3 ELSE leaderboard.best_time END,
         total_runs = leaderboard.total_runs + 1,
         total_distance = leaderboard.total_distance + $4,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, id, duration, distance]
    );

    res.json({
      success: true,
      message: 'Run completed successfully',
      data: {
        run: updateResult.rows[0],
        stats: {
          duration,
          distance,
          pace: Math.round(pace * 100) / 100
        }
      }
    });

  } catch (error) {
    console.error('End run error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's run history
router.get('/user/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT ur.*, r.name as route_name, r.difficulty, r.district
       FROM user_runs ur
       JOIN routes r ON ur.route_id = r.id
       WHERE ur.user_id = $1
       ORDER BY ur.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
