// 案件类型
enum MatterItemType {
  judicial = "司法鉴定",
  decryption = "破译解密"
}
// 性别类型
enum SexType {
  male = "男",
  female = "女"
}
// 证件类型
enum IdType {
  idCard = "身份证",
  passport = "护照"
}
// 操作类型
enum OperType {
  add = 1,
  update = 2,
  delete = 3,
  query = 4,
  other = 5
}
// 是否破解
enum CrackedType {
  yes = "是",
  no = "否"
}

export {
  MatterItemType,
  SexType,
  IdType,
  OperType,
  CrackedType
}