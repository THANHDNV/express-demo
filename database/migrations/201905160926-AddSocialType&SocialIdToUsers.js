'use strict'

const columnsAndTypes = [
    {
        name: 'SocialType',
        type: Sequelize => {
            return {
                type: Sequelize.STRING,
                allowNull: true
            }
        }
    },
    {
        name: 'SocialId',
        type: Sequelize => {
            return {
                type: Sequelize.STRING,
                allowNull: true
            }
        }
    }
]

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            columnsAndTypes.map(c => {
                return queryInterface.addColumn(
                    'Users',
                    c.name,
                    c.type(Sequelize)
                )
            })
        )
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all(
            columnsAndTypes.map(c => {
                return queryInterface.removeColumn(
                    'Users',
                    c.name(Sequelize)
                )
            })
        )
    }
}