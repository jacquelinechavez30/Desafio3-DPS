'use strict';
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// settings
const app = express();
const port = process.env.PORT || 3001;
app.set('json spaces', 2); // Para mejorar la legibilidad del JSON

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse incoming requests with JSON payloads

// routes
app.use("/api", require("./routes/index")); // Rutas habilitadas

// mongodb connection
const uri = process.env.MONGODB_URI; // Asegúrate de que esta variable de entorno esté definida
  mongoose.connect(uri)
  .then(() => console.log("Conexión a la base de datos exitosa"))
  .catch((error) => console.error(error));

// starting the server
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Esta ocurriendo un error" });
});
