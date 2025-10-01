import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

/* ---------------- Conexión a MongoDB Atlas ---------------- */
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

/* ---------------- Definición del esquema ---------------- */
const formSchema = new mongoose.Schema({
  dni: String,
  nombres: String,
  apellidos: String,
  fechaNacimiento: String,
  genero: String,
  ciudad: String
});

const Form = mongoose.model('Form', formSchema);

/* ---------------- Rutas del CRUD ---------------- */

// Guardar un nuevo formulario
app.post('/api/form', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(200).json({ message: 'Formulario guardado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos los registros
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un registro por ID
app.put('/api/form/:id', async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un registro por ID
app.delete('/api/form/:id', async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Formulario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- Servidor ---------------- */
app.listen(5000, () => console.log('Servidor backend corriendo en http://localhost:5000'));
