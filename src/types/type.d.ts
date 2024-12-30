interface RouteDataItemType{
  key:string,
  path:string,
  component:JSX.Element,
  meta: {
    title: string,
    icon?: JSX.Element,
    disabled?:boolean
  },
  children?:RouteDataItemType[]
}
interface NavMenuItemType{
  label:string,
  key:string,
  theme?: string,
  icon?: ReactElement,
  children?:NavMenuItemType[]
}
interface RouteItemType{
  path:string,
  element: ReactElement,
  children?:RouteItemType[]
}
interface CaseDataType {
  case_id: string
  judicial_id?: string
  decryption_id?:string
  commission_unit: string
  enemy_direction: string
  commission_matters: string
  submit_person: string
  create_date: string
  // operation: ReactElement
}
interface UserDataType {
  userId: number;
  username: string;
  mobile: string;
  realName: string; 
  deptId: number
  avatar: string 
  sex: number;
  email: string 
  remark: string 
  roleId: number
}

interface CaseSearchType {
  case_id: string
  commission_unit: string
  enemy_direction: string
  commission_matters: string
  submit_person: string
  commission_date: string
}