import pg from 'pg';

// Destructure Client class from the pg module
const { Client } = pg;

// Define the connection string to connect to the PostgreSQL database
const connectionString = 'postgresql://basedatos_postgresql_user:sqwLhN61zMBl9URhYQEJ18YT7Yu3amhl@dpg-cqkd3prqf0us73c7jgq0-a.oregon-postgres.render.com/basedatos_postgresql?ssl=true';

// Define an asynchronous function to delete a specific employee by ID from the empleados table
async function deleteEmployeeById(id) {
  const client = new Client({ connectionString });
  try {
    // Establish a connection to the database
    await client.connect();
    console.log('Connected to the database.');

    // Construct the SQL query to delete a specific row by ID
    const deleteQuery = 'DELETE FROM empleados WHERE id = $1;';
    
    // Execute the SQL query to delete the row
    const result = await client.query(deleteQuery, [id]);

    // Display the number of rows affected
    console.log(`${result.rowCount} row(s) deleted.`);

    // Check if the table is empty
    const checkEmptyQuery = 'SELECT COUNT(*) FROM empleados;';
    const checkResult = await client.query(checkEmptyQuery);
    const count = parseInt(checkResult.rows[0].count, 10);

    // If the table is empty, reset the IDs
    if (count === 0) {
      const resetSequenceQuery = 'ALTER SEQUENCE empleados_id_seq RESTART WITH 1;';
      await client.query(resetSequenceQuery);
      console.log('Table is empty. IDs reset to 1.');
    }
  } catch (error) {
    // Log any errors that occur during data deletion
    console.error('Error deleting data:', error.message);
    console.error('Error details:', error);
  } finally {
    // Close the client connection when done
    await client.end();
  }
}

// Define the ID of the employee to delete
const idToDelete = 13; // Change this to the ID of the employee you want to delete

// Execute the function to delete the employee by ID
deleteEmployeeById(idToDelete);
