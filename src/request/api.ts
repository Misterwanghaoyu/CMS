import request from "./index"

// 请求中： 请求参数和返回值的类型都需要进行约束
export const login = (params: LoginAPIReq): Promise<LoginAPIRes> => request.post("/api/sysUser/login", params);


const caseApi = {
  getAllCase: (): Promise<any> => request.get("/api/matter/list"),
  updateCase: (params: any): Promise<any> => request.post("/updateCase", params),
  addJudicialCase: (params: any): Promise<any> => request.post("/api/judicial/save", params),
  addDecryptionCase: (params: any): Promise<any> => request.post("/api/decryption/save", params),
  searchCase: (params: any): Promise<any> => request.post("/searchCase", params),
  deleteJudicialCase: (params: any): Promise<any> => request.post("/deleteCase", params),
  deleteDecryptionCase: (params: any): Promise<any> => request.post("/deleteCase", params),
  deleteCaseMultiple: (params: any): Promise<any> => request.post("/deleteCaseMultiple", params),
}
const userApi = {
  getAllUser: (): Promise<UserListAPIRes> => request.get("/api/sysUser/list"),
  updateUser: (params: any): Promise<any> => request.post("/api/sysUser/update", params),
  addUser: (params: any): Promise<any> => request.post("/api/sysUser/save", params),
  searchUserById: (userId: string): Promise<any> => request.get(`/api/sysUser/info/${userId}`),
  deleteUser: (params: any): Promise<any> => request.post("/api/sysUser/delete", params),
}
const logsApi = {
  getLogs: (): Promise<any> => request.get("/api/sysLog/listPage"),
}
export {
  caseApi,
  userApi,
  logsApi
}
