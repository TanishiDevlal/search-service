import AbstractModel from "./AbstractModel.js";
import { DataTypes } from "sequelize";
class MachineModel extends AbstractModel {
    static initialize(sequelize) {
        const modelDefinition = {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            dimensionLabel: { type: DataTypes.STRING, allowNull: false, field: "dimension_label" },
            dimensionName: { type: DataTypes.TEXT, allowNull: false, field: "dimension_name", unique: true },
            dimensionDetails: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            machineCategoryId: { type: DataTypes.STRING, allowNull: false },
            imageUrl: { type: DataTypes.STRING, allowNull: true },
        };
        const modelOptions = {
            sequelize,
            modelName: "Machine",
            tableName: "machine",
        }

        return super.initModel(sequelize, modelDefinition, modelOptions);
    }
}

export default MachineModel;
