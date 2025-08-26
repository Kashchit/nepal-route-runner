# Nepal Route Runner Backend

A Node.js/Express backend API for the Nepal Route Runner application, connecting to a Neon PostgreSQL database.

## Features

- **Authentication**: JWT-based user registration and login
- **Route Management**: CRUD operations for running routes
- **Run Tracking**: Start/end runs with timing and statistics
- **Leaderboards**: Rankings by route, district, and overall performance
- **User Statistics**: Personal performance tracking and history
- **Security**: Rate limiting, CORS, helmet, input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to Neon PostgreSQL database

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   The database connection is already configured in `config.env` with your Neon database credentials.

3. **Database Setup**:
   The application will automatically create the necessary tables on startup.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Routes
- `GET /api/routes` - Get all routes (with filters)
- `GET /api/routes/:id` - Get specific route
- `POST /api/routes` - Create new route
- `POST /api/routes/:id/start` - Start a run (protected)
- `POST /api/routes/:id/end` - End a run (protected)
- `GET /api/routes/user/history` - Get user run history (protected)

### Leaderboard
- `GET /api/leaderboard/route/:routeId` - Route-specific leaderboard
- `GET /api/leaderboard/district/:district` - District leaderboard
- `GET /api/leaderboard/overall` - Overall leaderboard
- `GET /api/leaderboard/user/:userId` - User statistics
- `GET /api/leaderboard/recent-runs` - Recent activity feed
- `GET /api/leaderboard/difficulty/:difficulty` - Difficulty-based rankings

### Health Check
- `GET /health` - API health status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Routes Table
```sql
CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  distance DECIMAL(10,2),
  elevation_gain INTEGER,
  difficulty VARCHAR(20),
  district VARCHAR(50),
  coordinates JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Runs Table
```sql
CREATE TABLE user_runs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  route_id INTEGER REFERENCES routes(id),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration INTEGER,
  distance DECIMAL(10,2),
  pace DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Leaderboard Table
```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  route_id INTEGER REFERENCES routes(id),
  best_time INTEGER,
  total_runs INTEGER,
  total_distance DECIMAL(10,2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: All inputs validated with express-validator
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT**: Secure token-based authentication

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # Database configuration
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── routes.js        # Route management
│   │   └── leaderboard.js   # Leaderboard routes
│   └── index.js             # Main server file
├── config.env               # Environment variables
├── package.json
└── README.md
```

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Import and use in `src/index.js`
3. Follow the existing pattern for error handling and validation

### Database Queries

Use the `pool` from `src/config/database.js` for all database operations:

```javascript
const { pool } = require('../config/database');

const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your Neon database credentials in `config.env`
   - Ensure the database is accessible from your IP

2. **CORS Errors**
   - Verify the frontend URL in `config.env`
   - Check that the frontend is running on the correct port

3. **Port Already in Use**
   - Change the PORT in `config.env`
   - Or kill the process using the port

### Logs

The application uses Morgan for HTTP logging. Check the console for:
- Request/response logs
- Database connection status
- Error messages

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2
3. Set up proper SSL/TLS certificates
4. Configure environment-specific database URLs
5. Set a strong JWT_SECRET

## API Documentation

For detailed API documentation, test the endpoints using tools like:
- Postman
- Insomnia
- curl

Example curl commands:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Get routes
curl http://localhost:5000/api/routes
```
