const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());  
app.use(cors()); 

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' data: https://cdn.jsdelivr.net;"
  );
  next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

const connection = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'jugadores',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a MySQL con ID ' + conn.threadId);
  conn.release();
});

app.post('/register', (req, res) => { 
    const { nombre, equipo, posicion, nDorsal } = req.body; 
    
    if (!nombre || !equipo || !posicion || !nDorsal) { 
      return res.status(400).send('Todos los campos son obligatorios'); 
    } 
    
    const query = 'INSERT INTO jugador (nombre, equipo, posicion, nDorsal) VALUES (?, ?, ?, ?)'; 
    connection.execute(query, [nombre, equipo, posicion, nDorsal], (error, results) => { 
        if (error) { 
            console.error('Error al insertar en la base de datos:', error); 
            return res.status(500).send('Error al registrar jugador'); 
        } 
        res.status(201).send('Jugador registrado correctamente'); 
    }); 
}); 

app.get('/jugadores', (req, res) => { 
    connection.query('SELECT * FROM jugadores', (error, results) => { 
        if (error) { 
            console.error('Error en la consulta:', error); 
            return res.status(500).send('Error en la consulta'); 
        } 
        res.json(results); 
    }); 
});

const PORT = 3000; 
app.listen(PORT, () => { 
    console.log(`Servidor corriendo en el puerto ${PORT}`); 
});
