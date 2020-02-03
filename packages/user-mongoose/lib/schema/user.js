const { Schema } = require('mongoose')

let schemaDefine = {
  unionid: { type: String, unique: true, sparse: true, index: true }, // unionid
  mpOpenid: { type: String, unique: true, sparse: true, index: true }, // mp openid
  weappOpenid: { type: String, unique: true, sparse: true, index: true } // weapp openid
}

module.exports = function () {
  const schema = new Schema()
  schema.add(schemaDefine)
  return schema
}
