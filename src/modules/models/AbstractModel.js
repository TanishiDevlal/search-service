import { DataTypes } from 'sequelize';

/**
 * AbstractModel - Base class with common fields and hooks for all models
 */
class AbstractModel {
    /**
     * Returns common field definitions
     */
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

    /**
     * Returns default model options including hooks
     */
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

    /**
     * Initialize model with custom fields and options
     */
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