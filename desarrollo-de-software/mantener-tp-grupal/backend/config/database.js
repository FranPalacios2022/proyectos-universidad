import { Sequelize } from 'sequelize';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
export function crearConexion(storage = process.env.DB_PATH || './data/mantenimiento.sqlite') {
  if (storage !== ':memory:') mkdirSync(dirname(resolve(storage)), {
    recursive: true
  });
  return new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false,
    retry: {
      max: 3
    }
  });
}
