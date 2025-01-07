// 这个文件专门定义请求参数的类型，和响应的类型
// 登录请求参数类型约束
interface LoginAPIReq {
  username: string;
  password: string;
}
// 登录的响应类型约束
interface LoginAPIRes {
  token: string
  username: string
}
// interface UserListAPIRes {
//   code: number;
//   message: string;
//   data:
// }

// // 登录的响应类型约束
// interface LoginAPIRes{
//   msg: string;
//   code: number;
//   token: string;
// }
