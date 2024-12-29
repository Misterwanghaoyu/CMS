import request from "./index"

// 请求中： 请求参数和返回值的类型都需要进行约束
export const login = (params:LoginAPIReq):Promise<LoginAPIRes> =>request.post("/api/sysUser/login",params);



export const getAllCase = ():Promise<any> =>request.get("/getAllCase");
export const updateCase = (params:any):Promise<any> =>request.post("/updateCase",params);
export const addJudicialCase = (params:any):Promise<any> =>request.post("//api/judicial/save",params);
export const addDecryptionCase = (params:any):Promise<any> =>request.post("/api/decryption/save",params);

export const searchCase =(params:any):Promise<any> =>request.post("/searchCase",params);
export const deleteJudicialCase =(params:any):Promise<any> =>request.post("/deleteCase",params);
export const deleteDecryptionCase =(params:any):Promise<any> =>request.post("/deleteCase",params);

export const deleteCaseMultiple =(params:any):Promise<any> =>request.post("/deleteCaseMultiple",params);


export const getAllUser = ():Promise<any> =>request.get("/api/sysUser/list");
export const updateUser =(params:any):Promise<any> =>request.post("/api/sysUser/update",params);
export const addUser =(params:any):Promise<any> =>request.post("/api/sysUser/save",params);
export const searchUserById = (params:any):Promise<any> =>request.post("/api/sysUser/info",params);
export const deleteUser =(params:any):Promise<any> =>request.post("/api/user/delete",params);

