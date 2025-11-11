const { Pool } = require('pg');

// Initialize connection pool (reused across invocations)
let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { response, timestamp, userAgent } = req.body;

    // Validate required fields
    if (!response) {
      return res.status(400).json({ error: 'Response is required' });
    }

    // Insert response into database
    const query = `
      INSERT INTO responses (response, timestamp, user_agent, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `;

    const result = await getPool().query(query, [
      response,
      timestamp || new Date().toISOString(),
      userAgent || req.headers['user-agent'] || 'Unknown'
    ]);

    return res.status(200).json({ 
      success: true, 
      id: result.rows[0].id 
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Failed to save response',
      message: error.message 
    });
  }
}

