import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Layout from './layout/Layout';
import { DASHBOARD_SIDEBAR_LINKS } from './lib/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from './interface/interface';
import axios from 'axios';
import { AppDispatch } from './service/store/store';
import { crud, isCrudGet, isCrudGet2, store } from './service/reducer/CrudClass';
import { useEffect } from 'react';
import { NotFound } from './pages/not-found/NotFound';
import SupperAdminLogin from './pages/Auth/SupperAdminLogin';
const App = () => {
  const dispatch = useDispatch<AppDispatch>()
  // useEffect(() => {
  //   dispatch( isCrudGet())
  //   dispatch( isCrudGet2())
  // }, []);
  // (window as typeof globalThis).prototype.dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: ReducerType) => state.ProfileReducer)
  const { user, isLoading } = useSelector((state: ReducerType) => state.ProfileReducer)
  // const { modelClass } = useSelector((state: ReducerType) => state.CrudClass)

  axios.defaults.headers.common['Authorization'] =
    token ?
      'Bearer ' + token : '';
  const router = createBrowserRouter(
    createRoutesFromElements(

      token?.length ?? 0 > 0 ?
        <Route path='' element={<Layout />}>
          {/* <Route path='/' element={<Welcome />} /> */}
          {DASHBOARD_SIDEBAR_LINKS
            ?.filter((item: any) => {
              if (item?.roleCondition) {
                let find = item?.roleCondition?.find((res: any) => res.role == user?.role)
                if (find) {
                  return +user?.[find?.condition]
                }
                return true

              }
              return true
            })
            ?.filter((item: any) => (item?.condition && item?.condition?.length > 0 ? +(user?.department?.[item?.condition] || user?.[item?.condition]) : true) && new Set(item.role).has(user?.role))?.map((route: any, index: any) => (
              <Route path={route.route} element={route?.componet} key={index} />
            ))}
          {DASHBOARD_SIDEBAR_LINKS
            ?.filter((item: any) => {
              if (item?.roleCondition) {
                let find = item?.roleCondition?.find((res: any) => res.role == user?.role)
                if (find) {
                  return +user?.[find?.condition]
                }
                return true

              }
              return true
            })
            ?.filter((item: any) => item?.children).flatMap((item: any) => item.children).map((route: any, index: any) => (
              <Route path={route.route} element={route?.componet} key={index} />
            ))}
          <Route path='*' element={<NotFound />} />
        </Route>
        :
        <>
          <Route path='/admin' element={<SupperAdminLogin />} />
          <Route path='*' element={<Login />} />
        </>
    )
  );
  return (

    <RouterProvider router={router} />
    // <>
    /* <Config />
    <Routes>
      {
        token?.length ?? 0 > 0 ?
          <>
            {DASHBOARD_SIDEBAR_LINKS?.map((route: any, index: any) => (
              <Route path={route.route} element={route?.componet} key={index} />
            ))}
            {DASHBOARD_SIDEBAR_LINKS?.filter((item: any) => item?.children).flatMap((item: any) => item.children).map((route: any, index: any) => (
              <Route path={route.route} element={route?.componet} key={index} />
            ))}
          </> :
          <Route path='*' element={<Login />} />

      }
    </Routes> */
    // </>
  )
}

export default App