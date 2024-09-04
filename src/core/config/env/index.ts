import * as dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_DEV = NODE_ENV === 'development';
export const IS_TEST = NODE_ENV === 'test';
export const IS_PROD = NODE_ENV === 'production';
