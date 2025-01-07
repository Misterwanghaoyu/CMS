import request from "./index"

// 请求中： 请求参数和返回值的类型都需要进行约束
export const login = (params: LoginAPIReq): Promise<LoginAPIRes> => request.post("/api/sysUser/login", params);


const caseApi = {
  // 查询 
  getAll: (): Promise<any> => request.get("/api/matter/list"),
  getByMatterNo: (query: string): Promise<any> => request.get("/api/matter/getByMatterNo?" + query),
  getJudicialById: (query: string): Promise<any> => request.get("/api/matter/getJudicialInfo?" + query),
  getDecryptionById: (query: string): Promise<any> => request.get("/api/matter/getDecryptionInfo?" + query),
  getJudicialMatterNo: (query: string): Promise<any> => request.get("/api/matter/getJudicialMatterNo?" + query),
  getDecryptionMatterNo: (query: string): Promise<any> => request.get("/api/matter/getDecryptionMatterNo?" + query),
  // 新增
  addJudicial: (params: any): Promise<any> => request.post("/api/matter/saveJudicial", params),
  importJudicialExcel: (params: any): Promise<any> => request.post("/api/matter/importJudicial", params),
  addDecryption: (params: any): Promise<any> => request.post("/api/matter/saveDecryption", params),
  importDecryptionExcel: (params: any): Promise<any> => request.post("/api/matter/importDecryption", params),
  // 组合查询
  combinationQuery: (params: any): Promise<any> => request.post("/api/matter/listByCondition", params),
  // 删除
  delete: (params: number[]): Promise<any> => request.post("/api/matter/delMatter", params),
  // 批量删除
  deleteMultiple: (params: number[]): Promise<any> => request.post("/deleteCaseMultiple", params),
  // 更新
  updateJudicial: (params: any): Promise<any> => request.post("/api/matter/updateJudicial", params),
  updateDecryption: (params: any): Promise<any> => request.post("/api/matter/updateDecryption", params),
}
const userApi = {
  // 查询
  getAll: (): Promise<UserDataType[]> => request.get("/api/sysUser/list"),
  // 更新
  update: (params: any): Promise<any> => request.post("/api/sysUser/update", params),
  getAllRole: (): Promise<any> => request.get("/api/sysRole/list"),
  // 新增
  add: (params: any): Promise<any> => request.post("/api/sysUser/save", params),
  // 删除
  delete: (params: number[]): Promise<any> => request.post("/api/sysUser/delete", params),
  // 查询
  searchById: (userId: string): Promise<any> => request.get(`/api/sysUser/info?userId=${userId}`),
}
const logsApi = {
  insertExportMatterLog: (params: number[]): Promise<any> => request.post("/api/matter/exportMatter", params),
  getLogs: (): Promise<any> => request.get("/api/sysLog/list"),
}
const mainApi = {
  // 查询
  getTotalData: (query?: string): Promise<any> => request.get("/api/statistics/countMatter?" + query),
  getSampleData: (query: string): Promise<any> => request.get("/api/statistics/countSample?" + query),
  getCrackedData: (query: string): Promise<any> => request.get("/api/statistics/countCracked?" + query),
  getDirectionDataByDirection: (query: string): Promise<any> => request.get("/api/statistics/countByDirection?" + query),
  getCombinationDataById: (query: string): Promise<any> => request.get("/api/statistics/countByMatterNo?" + query),
}
export {
  caseApi,
  userApi,
  logsApi,
  mainApi
}

