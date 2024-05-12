import dotenv from 'dotenv'
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `/src/config.env.${environment}` });

require('./server');
