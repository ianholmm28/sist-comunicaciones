import pg from 'pg';

// Destructure Client class from the pg module
const { Client } = pg;

// Define the connection string to connect to the PostgreSQL database
const connectionString = 'postgresql://basedatos_postgresql_user:sqwLhN61zMBl9URhYQEJ18YT7Yu3amhl@dpg-cqkd3prqf0us73c7jgq0-a.oregon-postgres.render.com/basedatos_postgresql?ssl=true';

// Define an asynchronous function to insert data into the empleados table
async function insertData() {
  const client = new Client({ connectionString });
  try {
    // Establish a connection to the database
    await client.connect();
    console.log('Connected to the database.');

    // Insert data into the empleados table
    await client.query(`
      INSERT INTO empleados (nombre, edad, puesto) VALUES
      ('Nicolas castaño', 18 , 'Editor');
    `);

    console.log('Data inserted successfully.');
  } catch (error) {
    // Log any errors that occur during data insertion
    console.error('Error inserting data:', error.message);
    console.error('Error details:', error);
  } finally {
    // Close the client connection when done
    await client.end();
  }
}

// Execute the function to insert data
insertData();
