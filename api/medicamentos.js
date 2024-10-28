// api/medicamentos.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://pjuliandvargas:0S1fAYbY08bXqijB@cluster0.sa9c5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const medicamentoSchema = new mongoose.Schema({
    nombre: String,
    valor: Number,
    stock: String,
    imagen: String
});

const Medicamento = mongoose.model('Medicamento', medicamentoSchema);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const medicamentos = await Medicamento.find();
            res.status(200).json(medicamentos);
        } catch (error) {
            res.status(500).json({ error: 'Error al cargar medicamentos' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}



// routes/medicamentos.js
const express = require('express');
const router = express.Router();
const Medicamento = require('../models/Medicamento');

// Crear un nuevo medicamento
router.post('/', async (req, res) => {
  const medicamento = new Medicamento(req.body);
  try {
    await medicamento.save();
    res.status(201).send(medicamento);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Leer todos los medicamentos
router.get('/', async (req, res) => {
  try {
    const medicamentos = await Medicamento.find();
    res.send(medicamentos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Leer un medicamento por ID
router.get('/:id', async (req, res) => {
  try {
    const medicamento = await Medicamento.findById(req.params.id);
    if (!medicamento) {
      res.status(404).send({ message: 'Medicamento no encontrado' });
    } else {
      res.send(medicamento);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Actualizar un medicamento
router.put('/:id', async (req, res) => {
  try {
    const medicamento = await Medicamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicamento) {
      res.status(404).send({ message: 'Medicamento no encontrado' });
    } else {
      res.send(medicamento);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// Eliminar un medicamento
router.delete('/:id', async (req, res) => {
  try {
    await Medicamento.findByIdAndRemove(req.params.id);
    res.send({ message: 'Medicamento eliminado' });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;