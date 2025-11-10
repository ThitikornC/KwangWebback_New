import express from 'express'
import solutionRoutes from './routes/solution';
import productRoutes from './routes/product';
import path from 'path'
import 'dotenv/config'

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const app = express()
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use(
  '/video',
  express.static(path.join(__dirname, '../static/video'))
)

// เส้น Solution
app.use('/solutions', solutionRoutes);
app.use('/products', productRoutes);


// Console Base
app.get('/', (req, res) => {
  res.send('Hello Kwang Company LTD!');
})
const server = app.listen(8080, () =>
  console.log(`
  🪶 Kwang Unlimit Company LTD. Ready !!
  🚀 Server ready at: http://localhost:8080
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api
  `),
)
