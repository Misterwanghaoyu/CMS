import request from "./index"

// 请求中： 请求参数和返回值的类型都需要进行约束
export const login = (params: LoginAPIReq): Promise<LoginAPIRes> => request.post("/api/sysUser/login", params);


const caseApi = {
  // 查询 
  getAll: (): Promise<any> => request.get("/api/matter/list"),
  getByMatterNo: (query: string): Promise<any> => request.get("/api/matter/getByMatterNo?" + query),
  // getJudicialById: (query: string): Promise<any> => request.get("/api/matter/getJudicialInfo?" + query),
  // getDecryptionById: (query: string): Promise<any> => request.get("/api/matter/getDecryptionInfo?" + query),
  getJudicialMatterNo: (query: string): Promise<any> => request.get("/api/matter/getJudicialMatterNo?" + query),
  getDecryptionMatterNo: (query: string): Promise<any> => request.get("/api/matter/getDecryptionMatterNo?" + query),
  // 新增
  addJudicial: (params: any): Promise<any> => request.post("/api/matter/saveJudicial", params),
  addDecryption: (params: any): Promise<any> => request.post("/api/matter/saveDecryption", params),
  importJudicialExcel: (params: any): Promise<any> => request.post("/api/matter/importJudicial", params),
  importDecryptionExcel: (params: any): Promise<any> => request.post("/api/matter/importDecryption", params),
  // 组合查询
  combinationQuery: (params: any): Promise<any> => request.post("/api/matter/listByCondition", params),
  // 删除
  deleteMatter: (params: number[]): Promise<any> => request.post("/api/matter/delMatter", params),
  delJudicial: (params: number[]): Promise<any> => request.post("/api/matter/delJudicial", params),
  delDecryption: (params: number[]): Promise<any> => request.post("/api/matter/delDecryption", params),
  // 更新
  updateJudicialMatter: (params: any): Promise<any> => request.post("/api/matter/updateJudicialMatter", params),
  updateDecryptionMatter: (params: any): Promise<any> => request.post("/api/matter/updateDecryptionMatter", params),
  exportMatter: (params: any,config:any): Promise<any> => request.post("/api/file/exportMatter", params,config),
  updateMatter: (params: any): Promise<any> => request.post("/api/matter/updateMatter", params),
  exportMatterTemplate: (query:any,config:any): Promise<any> => request.get("/api/file/exportMatterTemplate?"+query,config),
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
  searchByUsername: (query: any): Promise<any> => request.get("/api/sysUser/listByUsername?" + query),
  searchByUserId: (query: any): Promise<any> => request.get("/api/sysUser/info?" + query),
}
const logsApi = {
  // insertExportMatterLog: (params: number[]): Promise<any> => request.post("/api/matter/exportMatter", params),
  getLogs: (): Promise<any> => request.get("/api/sysLog/list"),
}
const mainApi = {
  // 查询
  getTotalData: (query?: string): Promise<any> => request.get("/api/statistics/countMatter?" + query),
  getSampleData: (query: string): Promise<any> => request.get("/api/statistics/countSample?" + query),
  getCrackedData: (query: string): Promise<any> => request.get("/api/statistics/countCracked?" + query),
  getDirectionDataByDirection: (query: string): Promise<any> => request.get("/api/statistics/countByDirection?" + query),
  // getCombinationDataById: (query: string): Promise<any> => request.get("/api/statistics/countByMatterNo?" + query),
}
const backupApi = {
  scheduleBackup: (params: any): Promise<any> => request.post("/api/backup/schedule", params),
}
export {
  caseApi,
  userApi,
  logsApi,
  mainApi,
  backupApi
}

