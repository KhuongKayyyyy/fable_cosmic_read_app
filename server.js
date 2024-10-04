import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

// routes import
import {bookRouter,genreRouter,chapterRouter} from './routes/index.js';

import connect from './database/database.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/books', bookRouter);
app.use('/genres', genreRouter);
app.use('/chapters', chapterRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, async () => {
    await connect();
    console.log(`Server is running on port ${PORT}`);
});