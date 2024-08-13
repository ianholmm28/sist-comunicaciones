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
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f0f4f8;
                    color: #333;
                    text-align: center;
                    padding: 20px;
                }
                h1 {
                    color: #444;
                    margin-bottom: 20px;
                }
                .table-container {
                    width: 90%;
                    margin: 0 auto;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    overflow: hidden;
                    background-color: #fff;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #ddd;
                    text-align: left;
                }
                th {
                    background-color: #007bff;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
                input[type="text"] {
                    margin: 20px 0;
                    padding: 10px;
                    width: 50%;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.1);
                }
            </style>
        </head>
        <body>
            <h1>Lista de Empleados</h1>
            <input type="text" id="search" placeholder="Buscar empleado por nombre..." onkeyup="filterTable()">
        
            <div class="table-container">
                <table id="employeeTable">
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
            </div>
        
            <script>
                function filterTable() {
                    const input = document.getElementById('search');
                    const filter = input.value.toLowerCase();
                    const table = document.getElementById('employeeTable');
                    const trs = table.querySelectorAll('tbody tr');
        
                    trs.forEach(tr => {
                        const td = tr.querySelectorAll('td')[1];
                        const txtValue = td.textContent || td.innerText;
                        if (txtValue.toLowerCase().indexOf(filter) > -1) {
                            tr.style.display = '';
                        } else {
                            tr.style.display = 'none';
                        }
                    });
                }
            </script>
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
