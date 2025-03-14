import * as dotenv from 'dotenv';
import express from 'express'
import Router from './routes'
import Log from './helpers/logger';

dotenv.config();
Log.info('Routes loaded');
const port = process.env.PORT || 3300;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/v1',Router)
export const server = app.listen(port, () => {
    Log.info(`Server is running on port: ${port}`);
});



export default app;