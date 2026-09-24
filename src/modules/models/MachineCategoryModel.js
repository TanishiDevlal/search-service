import AbstractModel from "./AbstractModel.js";
import { DataTypes } from "sequelize";

class MachineCategoryModel extends AbstractModel {
    static initialize(sequelize) {
        const modelDefinition = {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subcategory: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            variant: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            label: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isAllowed: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            }
        };

        const modelOptions = {
            tableName: "machine_category",
        };

        return this.initModel(sequelize, modelDefinition, modelOptions);
    }
}

export default MachineCategoryModel;