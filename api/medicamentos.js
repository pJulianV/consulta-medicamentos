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
    } else if (req.method === 'POST') {
        // Crear un nuevo medicamento
        const medicamento = new Medicamento(req.body);
        try {
            await medicamento.save();
            res.status(201).json(medicamento);
        } catch (error) {
            res.status(400).json({ error: 'Error al crear medicamento' });
        }
    } else if (req.method === 'PUT') {
        // Actualizar un medicamento
        try {
            const medicamento = await Medicamento.findByIdAndUpdate(req.body.id, req.body, { new: true });
            if (!medicamento) {
                res.status(404).json({ message: 'Medicamento no encontrado' });
            } else {
                res.status(200).json(medicamento);
            }
        } catch (error) {
            res.status(400).json({ error: 'Error al actualizar medicamento' });
        }
    } else if (req.method === 'DELETE') {
        // Eliminar un medicamento
        try {
            await Medicamento.findByIdAndRemove(req.body.id);
            res.status(200).json({ message: 'Medicamento eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar medicamento' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}