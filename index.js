import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import request from 'request';
import postRoutes from './Routes/posts.js';

const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
const corsOptions = {
    origin:'*',
    credentials: true,
};
app.use(cors(corsOptions));
dotenv.config();
app.use('/search', postRoutes);

app.get('/', async (req, res) => {
  try {
      res.status(200).json("Welcome to the server!");
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});



const PORT = process.env.PORT|| 5000;
app.listen(PORT, () => {
  console.log(`Weather app listening on port ${PORT}`)
})
