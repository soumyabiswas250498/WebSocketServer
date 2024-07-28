import dotenv from 'dotenv';
import connectDB from './src/DB/index.js';
import { httpServer } from './src/app.js';

dotenv.config();
connectDB()
    .then(() => {
        httpServer.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log('MONGO db connection failed !!! ', err);
    });