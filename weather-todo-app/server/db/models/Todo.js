
import Sequelize from 'sequelize';

export default function definToDo(connection) {
    const dt = Sequelize.DataTypes;
    connection.define('Todo', {
        id: {
            type: dt.INTEGER(11).UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: dt.UUID,
            allowNull: false,
            defaultValue: dt.UUIDV4,
            unique: true
        },
        title: {
            type: dt.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Title cannot be empty' },
                notNull: { msg: 'Title cannot be empty' }
            }
        },
        description: {
            type: dt.TEXT('medium'),
            allowNull: true
        },
        priority: {
            type: dt.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    });
}
