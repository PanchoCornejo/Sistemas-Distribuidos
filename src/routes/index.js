const { Router } = require('express');
const router = new Router();
const { getItems, getItemsID } = require('../controllers/index.controller');

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '172.25.0.2',
    password: 'marihuana',
    database: 'tiendita',
    port: '5432'
});


router.get('/', async (req, res) => {
    const data = {
        name: 'Estas en el main',
        website: 'Utiliza /items/TuBusqueda'
    };
    res.json(data);
});  

router.get('/items', getItems);
router.get('/items/:id', getItemsID);


router.get('/prueba', async (req, res) => {
    const datos = await pool.query('SELECT * FROM items');
    res.json(datos.rows);
});  


module.exports = router;