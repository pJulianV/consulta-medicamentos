// api/medicamentos.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://pjuliandvargas:0S1fAYbY08bXqijB@cluster0.sa9c5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const medicamentoSchema = new mongoose.Schema({
    nombre: String,
    disponible: Boolean,
    imagen: String,
    info: String,
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