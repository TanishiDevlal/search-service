import { sequelize } from '../../config/database.js';
import FleetModel from './FleetModel.js';
import MachineModel from './MachineModel.js';
import CategoryModel from './CategoryModel.js';
import MachineCategoryModel from './MachineCategoryModel.js';

const db = {
    sequelize,
    Fleet: FleetModel.initialize(sequelize),
    Machine: MachineModel.initialize(sequelize),
    Category: CategoryModel.initialize(sequelize),
    MachineCategory: MachineCategoryModel.initialize(sequelize)
};

db.Machine.belongsTo(db.Category, {
    foreignKey: 'machineCategoryId',
    targetKey: 'uuid',
    as: 'categoryDetail'
});
db.Category.hasMany(db.Machine, {
    foreignKey: 'machineCategoryId',
    sourceKey: 'uuid',
    as: 'dimensions'
});

export default db;