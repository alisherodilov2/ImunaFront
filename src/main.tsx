import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './service/store/store'
import axios from 'axios'
import Config from './service/config/Config'
// export const domain = 'http://127.0.0.1:8000'
export const domain = 'https://api-test-u-med.tochka24.uz'///// test
// export const domain = 'https://api.tochka24.uz' ///////u-med
// export const domain = 'https://api.immuno-lab.uz'
// export const domain = 'https://api.sino-crm.uz' ///////u-med
axios.defaults.baseURL = `${domain}/api/v3`;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.put['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.common['Accept'] = 'application/json';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
