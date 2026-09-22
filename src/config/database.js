import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelize = new Sequelize(
    env.database.name,
    env.database.user,
    env.database.password,
    {
        host: env.database.host,
        port: env.database.port,
        dialect: 'postgres',
        schema: env.database.schema || 'commerce',
        searchPath: env.database.schema || 'commerce',
        logging: env.nodeEnv === 'development' ? console.log : false,
        dialectOptions: {
            statement_timeout: 10000,
            idle_in_transaction_session_timeout: 10000,
            ...(env.database.ssl
                ? { ssl: { require: true, rejectUnauthorized: false } }
                : {})
        },
        pool: {
            max: 15,
            min: 2,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
            schema: env.database.schema || 'commerce'
        }
    }
);

export { sequelize };
export default sequelize;
