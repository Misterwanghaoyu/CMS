import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { Input, Space, Button, message } from 'antd';
import styles from "./login.module.scss"
import initLoginBg from "./init"
// import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './login.less'
import { useNavigate } from "react-router-dom"
import { login } from "@/request/api"
import { debounce } from "lodash";
const view = () => {
  let navigateTo = useNavigate();
  // 加载完这个组件之后，加载背景
  useEffect(() => {
    initLoginBg();
    window.onresize = function () { initLoginBg() };

    // getCaptchaImg();
  }, []);
  // 获取用户输入的信息
  const [usernameVal, setUsernameVal] = useState(""); // 定义用户输入用户名这个变量
  const [passwordVal, setPasswordVal] = useState(""); // 定义用户输入密码这个变量
  // const [captchaVal,setCaptchaVal] = useState(""); // 定义用户输入验证码这个变量
  // // 定义一个变量保存验证码图片信息
  // const [captchaImg,setCaptchaImg] = useState(""); 

  // const usernameChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   // 获取用户输入的用户名
  //   // console.log(e.target.value);
  //   // 修改usernameVal这个变量为用户输入的那个值。 以后拿到usernameVal这个变量就相当于拿到用户输入的信息。
  //   setUsernameVal(e.target.value);
  // }
  // const passwordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setPasswordVal(e.target.value);
  // }
  // const captchaChange = (e:ChangeEvent<HTMLInputElement>)=>{
  //   setCaptchaVal(e.target.value);
  // }
  // 点击登录按钮的事件函数

  const gotoLogin = async () => {
    // 验证是否有空值
    if (!usernameVal.trim() || !passwordVal.trim()) {
      message.warning("请完整输入信息！")
      return
    }
    const res = await login({
      username: usernameVal,
      password: passwordVal
    })
    message.success("登录成功")
    localStorage.setItem("userInfo", JSON.stringify(res))
    localStorage.setItem("token", res.token)
    navigateTo("/main")
    // })  
    // // 发起登录请求
    // let loginAPIRes = await LoginAPI({
    //   username:usernameVal,
    //   password:passwordVal,
    //   code:captchaVal,   
    //   uuid:localStorage.getItem("uuid") as string    
    // })

    // console.log(loginAPIRes);
    // if(loginAPIRes.code===200){
    //   // 1、提示登录成功
    //   notification.success("登录成功！")
    //   // 2、保存token
    //   localStorage.setItem("lege-react-management-token",loginAPIRes.token)
    //   // 3、跳转到/main
    //   navigateTo("/main")
    //   // 4、删除本地保存中的uuid
    //   localStorage.removeItem("uuid")
    // }
    // if (usernameVal==="Admin" && passwordVal==="Admin_114514") {
    //   localStorage.setItem("userInfo", JSON.stringify({code:"202410240001",id:1,name:"Admin",username:"Admin",permissions:"Admin"}))
    //   localStorage.setItem("token","202410240001")
    //   navigateTo("/main")
    // }else if (usernameVal==="User" && passwordVal==="User_114514"){
    //   localStorage.setItem("userInfo", JSON.stringify({code:"202410240002",id:2,name:"User1",username:"User1",permissions:"User"}))
    //   localStorage.setItem("token","202410240002")
    //   navigateTo("/main")
    // }
  }
  const debounceGotoLogin = useCallback(debounce(gotoLogin, 300), [usernameVal, passwordVal]);

  // 在这里替换原有的 gotoLogin 调用


  // // 点击验证码图片盒子的事件函数
  // const getCaptchaImg = async ()=>{
  //   // 做验证码的请求
  //   // CaptchaAPI().then((res)=>{
  //   //   console.log(res);
  //   // })
  //   let captchaAPIRes = await CaptchaAPI();
  //   console.log(captchaAPIRes);
  //   if(captchaAPIRes.code===200){
  //     // 1、把图片数据显示在img上面
  //     setCaptchaImg("data:image/gif;base64,"+captchaAPIRes.img)
  //     // 2、本地保存uuid，给登录的时候用
  //     localStorage.setItem("uuid",captchaAPIRes.uuid)
  //   }


  // }
  const handleKeyDown = (e: KeyboardEvent) => {
    e.key === 'Enter' && debounceGotoLogin()
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [usernameVal, passwordVal])
  return (
    <div className={styles.loginPage}>
      {/* 存放背景 */}
      <canvas id="canvas" style={{ display: "block" }}></canvas>
      {/* 登录盒子 */}
      <div className={styles.loginBox + " loginbox"}>
        {/* 标题部分 */}
        <div className={styles.title}>
          <h1>案件管理系统</h1>
          <p>Case Management System</p>
        </div>
        {/* 表单部分 */}
        <div className="form">
          <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Input placeholder="用户名" onChange={(e) => setUsernameVal(e.target.value)} value={usernameVal} />
            <Input.Password placeholder="密码" onChange={(e) => setPasswordVal(e.target.value)} value={passwordVal} />
            <Button type="primary" className="loginBtn" block onClick={debounceGotoLogin}>登录</Button>
          </Space>
        </div>
      </div>
    </div>
  )
}
export default view