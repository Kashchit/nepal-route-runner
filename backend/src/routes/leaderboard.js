const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get leaderboard for a specific route
router.get('/route/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT 
        l.*,
        u.username,
        r.name as route_name,
        r.difficulty,
        r.district
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       JOIN routes r ON l.route_id = r.id
       WHERE l.route_id = $1
       ORDER BY l.best_time ASC NULLS LAST, l.total_runs DESC
       LIMIT $2 OFFSET $3`,
      [routeId, parseInt(limit), parseInt(offset)]
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
    console.error('Get route leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get leaderboard by district
router.get('/district/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT 
        l.*,
        u.username,
        r.name as route_name,
        r.difficulty,
        r.district
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       JOIN routes r ON l.route_id = r.id
       WHERE r.district ILIKE $1
       ORDER BY l.best_time ASC NULLS LAST, l.total_runs DESC
       LIMIT $2 OFFSET $3`,
      [`%${district}%`, parseInt(limit), parseInt(offset)]
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
    console.error('Get district leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get overall leaderboard (all routes combined)
router.get('/overall', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT 
        u.id as user_id,
        u.username,
        COUNT(DISTINCT l.route_id) as routes_completed,
        SUM(l.total_runs) as total_runs,
        SUM(l.total_distance) as total_distance,
        AVG(l.best_time) as avg_best_time,
        MIN(l.best_time) as fastest_run
       FROM users u
       LEFT JOIN leaderboard l ON u.id = l.user_id
       GROUP BY u.id, u.username
       HAVING COUNT(l.route_id) > 0
       ORDER BY routes_completed DESC, total_distance DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
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
    console.error('Get overall leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's leaderboard entries
    const leaderboardResult = await pool.query(
      `SELECT 
        l.*,
        r.name as route_name,
        r.difficulty,
        r.district
       FROM leaderboard l
       JOIN routes r ON l.route_id = r.id
       WHERE l.user_id = $1
       ORDER BY l.best_time ASC`,
      [userId]
    );

    // Get user's total statistics
    const statsResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT l.route_id) as routes_completed,
        SUM(l.total_runs) as total_runs,
        SUM(l.total_distance) as total_distance,
        AVG(l.best_time) as avg_best_time,
        MIN(l.best_time) as fastest_run,
        MAX(l.best_time) as slowest_run
       FROM leaderboard l
       WHERE l.user_id = $1`,
      [userId]
    );

    // Get user info
    const userResult = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: userResult.rows[0],
        leaderboard: leaderboardResult.rows,
        stats: statsResult.rows[0] || {
          routes_completed: 0,
          total_runs: 0,
          total_distance: 0,
          avg_best_time: null,
          fastest_run: null,
          slowest_run: null
        }
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get recent runs (for activity feed)
router.get('/recent-runs', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(
      `SELECT 
        ur.id,
        ur.start_time,
        ur.end_time,
        ur.duration,
        ur.distance,
        ur.pace,
        u.username,
        r.name as route_name,
        r.difficulty,
        r.district
       FROM user_runs ur
       JOIN users u ON ur.user_id = u.id
       JOIN routes r ON ur.route_id = r.id
       WHERE ur.end_time IS NOT NULL
       ORDER BY ur.end_time DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Get recent runs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get top performers by difficulty
router.get('/difficulty/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    const { limit = 10 } = req.query;

    const result = await pool.query(
      `SELECT 
        l.*,
        u.username,
        r.name as route_name,
        r.difficulty,
        r.district
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       JOIN routes r ON l.route_id = r.id
       WHERE r.difficulty = $1
       ORDER BY l.best_time ASC NULLS LAST
       LIMIT $2`,
      [difficulty, parseInt(limit)]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Get difficulty leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
