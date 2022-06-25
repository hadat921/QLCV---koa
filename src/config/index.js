import {
    config
} from 'dotenv';
config();

export const getEnv = (variable) => {
    return process.env[variable];
}