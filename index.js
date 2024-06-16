const express = require("express")
const {Pool} = require('pg')
const cors = require('cors')

const pool = new Pool({
    connectionString: `postgres://wbzqenwz:WnjHQkvBFgBVbsHOS8yEF_tEYx_-RRrs@silly.db.elephantsql.com/wbzqenwz`
})

const app = express()

app.use(cors({
    origin: 'https://sequenciarapida.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", async(req, res)=>{
    try {
        const {rows} = await pool.query("SELECT * FROM rank ORDER BY pontos DESC");
        return res.status(200).send(rows);
    } catch (error) {
        console.error('Rank indisponível', error);
        return res.status(500).send('Erro interno do servidor');
    }
})

app.post('/adicionar', async(req, res)=> {
    try {
        const { nome,pontos } = req.body;
        const player = await pool.query(
            'INSERT INTO rank (nome, pontos) VALUES ($1, $2) RETURNING *',
            [nome, pontos]
        );
  
        return res.status(201).json(player.rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar player ao rank:', error);
        return res.status(500).send('Erro interno do servidor');
    }
})


app.listen (3000, ()=>{console.log('porta: 3000')})