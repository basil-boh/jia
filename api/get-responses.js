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
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Optional: Add authentication here if you want to protect this endpoint
    // For now, we'll just return all responses
    
    const query = `
      SELECT id, response, timestamp, created_at
      FROM responses
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    const result = await getPool().query(query);

    return res.status(200).json({ 
      success: true, 
      responses: result.rows 
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch responses',
      message: error.message 
    });
  }
}

