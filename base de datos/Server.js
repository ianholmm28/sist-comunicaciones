import express from 'express';
import pg from 'pg';

const { Client } = pg;

const connectionString = 'postgresql://basedatos_postgresql_user:sqwLhN61zMBl9URhYQEJ18YT7Yu3amhl@dpg-cqkd3prqf0us73c7jgq0-a.oregon-postgres.render.com/basedatos_postgresql?ssl=true';

const app = express();
const port = 3000;

// Middleware para analizar cuerpos JSON
app.use(express.json());

async function readData() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM empleados');
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

// Ruta para servir el HTML y CSS junto con los datos
app.get('/read-data', async (req, res) => {
    try {
        const data = await readData();
        
        // HTML con CSS embebido
        const html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tabla de Empleados</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        text-align: center;
                        padding: 20px;
                    }
                    h1 {
                        color: #555;
                    }
                    table {
                        width: 80%;
                        margin: 20px auto;
                        border-collapse: collapse;
                        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                    }
                    th, td {
                        padding: 10px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h1>Lista de Empleados</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Puesto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(emp => `
                        <tr>
                            <td>${emp.id}</td>
                            <td>${emp.nombre}</td>
                            <td>${emp.edad}</td>
                            <td>${emp.puesto}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/read-data`);
});
