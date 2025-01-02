import { useEffect } from 'react'
import { useRoutes, useLocation,useNavigate } from "react-router-dom"
import router from "./router"
import { message } from "antd"
function ToWhatPage(url:string,warningStr:string){
  const navigateTo = useNavigate()
  // 加载完这个组件之后实现跳转
  useEffect(()=>{
    // 加载完组件之后执行这里的代码
    navigateTo(url);
    message.warning(warningStr);
  },[])
}

// 手写封装路由守卫
function BeforeRouterEnter(){
  const outlet = useRoutes(router);
  const AdminPages=["/user/information","/user/logs"]
  /*
    后台管理系统两种经典的跳转情况：
    1、如果访问的是登录页面， 并且有token， 跳转到首页
    2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    3、其余的都可以正常放行
  */
    const location = useLocation()
    let token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("userInfo")!)
    
    //1、如果访问的是登录页面， 并且有token， 跳转到首页
    if(location.pathname==="/login" && token){
      // 这里不能直接用 useNavigate 来实现跳转 ，因为需要BeforeRouterEnter是一个正常的JSX组件
      ToWhatPage("/main","您已经登录过了！")
    }
    //2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    if(location.pathname!=="/login" && !token){
      ToWhatPage("/login","您还没有登录，请登录后再访问！")

    }
    //2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    
    if(AdminPages.includes(location.pathname) && user.permissions==="User"){
      ToWhatPage("/403","无权访问！")
    }
    return outlet
}


function App() {  
  return (
    <div className="App">

      {/* <Link to="/home">Home</Link> |
      <Link to="/about">About</Link> |
      <Link to="/user">User</Link> */}

      {/* 占位符组件，类似于窗口，用来展示组件的，有点像vue中的router-view */}
      {/* <Outlet></Outlet> */}
      {/* {outlet} */}
      <BeforeRouterEnter />
    </div>
  )
}

export default App
