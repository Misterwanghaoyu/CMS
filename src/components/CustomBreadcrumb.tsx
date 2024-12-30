import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { convertRoutesToBreadcrumbItems } from '@/utils/convertFunctions';


import { routeData } from '@/router';
const CustomBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs:any[] = [];

  convertRoutesToBreadcrumbItems(routeData, pathnames, breadcrumbs);
  function itemRender(currentRoute: any, params: any, routes: any[], paths: string[]) {
    const isLast = currentRoute?.path === routes[routes.length - 1]?.path;
    return isLast ? (
      <span>{currentRoute.meta.title}</span>
    ) : (
      // <Link to={`/${paths.join("/")}`}>{currentRoute.meta.title}</Link>
      <span>{currentRoute.meta.title}</span>
    );
  }
  
  return (
    <Breadcrumb itemRender={itemRender} items={breadcrumbs} />
    //   {breadcrumbs.map((item, index) => (
    //     <Breadcrumb.Item key={index}>
    //       {index === breadcrumbs.length - 1 ? (
    //         item.meta.title
    //       ) : (
    //         <Link to={item.path}>{item.meta.title}</Link>
    //       )}
    //     </Breadcrumb.Item>
    //   ))}
    // </Breadcrumb>
  );
};

export default CustomBreadcrumb;