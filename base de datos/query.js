import pg from 'pg';

// Destructure Client class from the pg module
const { Client } = pg;

// Define the connection string to connect to the PostgreSQL database
const connectionString = 'postgresql://basedatos_postgresql_user:sqwLhN61zMBl9URhYQEJ18YT7Yu3amhl@dpg-cqkd3prqf0us73c7jgq0-a.oregon-postgres.render.com/basedatos_postgresql?ssl=true';

// Define an asynchronous function to query and display data from the empleados table
async function queryData() {
  const client = new Client({ connectionString });
  try {
    // Establish a connection to the database
    await client.connect();
    console.log('Connected to the database.');

    // Query the empleados table
    const res = await client.query('SELECT * FROM empleados;');

    // Display the results
    console.log('Query Results:', res.rows);
  } catch (error) {
    // Log any errors that occur during querying
    console.error('Error querying data:', error.message);
    console.error('Error details:', error);
  } finally {
    // Close the client connection when done
    await client.end();
  }
}

// Execute the function to query and display data
queryData();
