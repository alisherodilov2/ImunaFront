import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { AppDispatch } from '../../service/store/store';
import { isOrderGet } from '../../service/reducer/OrderReducer';
function Pagination({ total, count, url = '', api = false, getApi = function () { }, setPageLimit = function () { }, pageLmit = 5, current = 1 }: { total: number, count: Function, url?: string, api?: boolean, getApi?: Function, current?: number, setPageLimit?: Function, pageLmit?: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const [index, setIndex] = useState(() => current)
  const path = useNavigate()
  let location = useLocation();
  const { search } = useLocation();
  // const { id } = useParams()
  // const pageRes = () => {
  //   if (id?.length ?? 0 > 0) {
  //     if (parseFloat(`${id}`)) {
  //       setIndex(parseFloat(`${id}`))
  //     } else {
  //       setIndex(1)
  //     }
  //   }

  // }
  const fetchApi = async (url: string) => {
    try {
      let result = await axios.get(url)
      return result.data.result
      // return result.data.result
    } catch (e: any) {

    } finally {

    }
  }
  const getApiStart = (target?: number) => {
    if (api) {
      (getApi(target))
    }
  }
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();
  let [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {

    // dispatch(count(index))
    // pageRes()b     
    // setSearchParams('?page=' + index);
    // setIndex(current)
    if (current == 1) {
      setIndex(1)
    }
  }, [location, index, current])

  const send = async (index: number) => {
    dispatch(count(index))
    // path(location.pathname + "/" + index)
  }


  const read = (start: number, end: number) => {

    let res = []
    for (let i = start; i <= end; i++) {
      res.push(
        <li className={`  ${index === i ? 'active' : ''}  page-item `} key={i} >
          <button className={`page-link`} onClick={() => {
            setIndex(i)
            getApiStart(i)
            send(i)
          }}>
            {i}
          </button>
        </li>
      )
    }
    return res;
  }
  const dots = (countDot: number, resIcon?: boolean, iconRule?: boolean) => {
    let res = []
    for (let i = 0; i < countDot; i++) {
      res.push(
        <li className=' page-item ' key={i} >
          <button className='page-link' onClick={() => {
            if (resIcon) {
              setIndex(index => index > 1 ? index - 1 : 1)
              send(index)
            } else {
              setIndex(index => index < total ? index + 1 : index)
              send(index)
            }
            getApiStart(index)
          }}>
            <span className='dots_'>...</span>
            <span className='dots_icon'>
              {
                iconRule ?
                  < FaAngleDoubleLeft /> : < FaAngleDoubleRight />
              }
            </span>
          </button>
        </li>
      )
    }
    return res;
  }
  const container = () => {
    if (total > 5) {
      if (index <= 4) {
        return [...read(1, 4), ...dots(1), ...read(total, total)]
      }
      else if (index >= 5 && index + 4 <= total) {
        return [...read(1, 1), ...dots(1, true, true), ...read(index - 2, index + 2), ...dots(1), read(total - 1, total - 1)]
      }
      else if (total - 3 > index) {
        return [...read(1, 1), ...dots(1, true), ...read(index, total)]
      }
      else {
        return [...read(1, 1), ...dots(1, true, true), ...read(total - 3, total)]
      }
    }
    else {
      return [...read(1, total)]
    }
  }

  return (

    <>
      {total === 0 ? '' :
        <div className='d-flex justify-content-between align-items-center'>


          <select id="defaultSelect" className="form-select" style={{ width: '75px' }}
            onChange={(e: any) => {
              send(1)
              setIndex(1)
              setPageLimit(e.target.value)
            }}
            value={pageLmit}
          >
            <option value={50}>50</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
          </select>

          <nav aria-label='Page navigation' className='my-0'>
            <ul className='pagination pagination-md m-0'>
              <li className='page-item first'>
                <button className='page-link' onClick={() => {
                  setIndex(index => index > 1 ? index - 1 : 1)
                  send(index > 1 ? index - 1 : 1)
                  getApiStart(index > 1 ? index - 1 : 1)
                }}>
                  <FaAngleLeft />
                </button>
              </li>
              {container()}
              <li className='last page-item '>
                <button className=' page-link' onClick={() => {
                  setIndex(index => index < total ? index + 1 : index)
                  send(index < total ? index + 1 : index)
                  getApiStart(index < total ? index + 1 : index)
                }}>
                  <FaAngleRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>

      }
    </>
  );
}

export default Pagination;
