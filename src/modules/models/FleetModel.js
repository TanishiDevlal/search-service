import AbstractModel from "./AbstractModel.js";
import { DataTypes } from "sequelize";
class FleetModel extends AbstractModel {
    static initialize(sequelize) {
        const modelDefinition = {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            machineType: DataTypes.STRING,
            category: DataTypes.STRING,
            machineCategory: DataTypes.STRING,
            primaryFunction: DataTypes.TEXT,
            secondaryFunction: DataTypes.TEXT,
            additionalSpecs: DataTypes.ARRAY(DataTypes.JSON),
            additionalConfig: DataTypes.ARRAY(DataTypes.JSON),
            brand: { type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true },
            fuelType: { type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true },
            dimensions: { type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true },
            combineWith: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            imageUrl: DataTypes.STRING,
        };
        const modelOptions = {
            sequelize,
            modelName: "Fleet",
            tableName: "fleet",
        }

        return super.initModel(sequelize, modelDefinition, modelOptions);
    }
}

export default FleetModel;
