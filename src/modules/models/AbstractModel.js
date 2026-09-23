import { DataTypes } from 'sequelize';

class AbstractModel {
    static getModelDefinition() {
        return {
            uuid: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updatedBy: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: 'User ID who last updated this record',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        };
    }

    static getModelOptions() {
        return {
            timestamps: false,
            underscored: true,
            hooks: {
                beforeUpdate: (instance) => {
                    instance.updatedAt = new Date();
                },
            },
        };
    }

    static initModel(sequelize, modelDefinition = {}, modelOptions = {}) {
        const definition = {
            ...this.getModelDefinition(),
            ...modelDefinition,
        };

        const options = {
            ...this.getModelOptions(),
            ...modelOptions,
            sequelize,
            modelName: this.name.replace('Model', '').toLowerCase(),
        };

        return sequelize.define(this.name, definition, options);
    }
}

export default AbstractModel;