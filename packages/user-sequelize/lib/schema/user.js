const { plusModelHook } = require('../utils')

module.exports = function (sequelize, DataTypes) {
  const modelName = 'user'
  const { config: {
    table_name: tableName = 'wechat_user',
    table_name_prefix: prefix = ''
  } = {} } = sequelize

  const model = sequelize.define(modelName,
    {
      id: { type: DataTypes.STRING(50), primaryKey: true },
      unionid: { type: DataTypes.STRING(50), unique: true },
      mpOpenid: { type: DataTypes.STRING(50), unique: true },
      weappOpenid: { type: DataTypes.STRING(50), unique: true }
    },
    {
      tableName: `${prefix}${tableName}`,
      createdAt: 'crtime',
      updatedAt: 'moditime',
      deletedAt: 'deltime'
    })

  plusModelHook(model)

  return model
}
