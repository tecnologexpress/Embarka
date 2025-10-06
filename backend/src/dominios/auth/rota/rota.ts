import { Router } from 'express';

const AUTH_ROTA = Router();


AUTH_ROTA.post('/', (req, res) =>
    res.json({ message: 'Rota de autenticação' })
);

export default AUTH_ROTA;