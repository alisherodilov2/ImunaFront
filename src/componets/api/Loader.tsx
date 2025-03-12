import { ClockLoader, ScaleLoader } from 'react-spinners'
const Loader = ({ loading = false }: { loading?: boolean }) => {
    return loading ? (
        <div className='blur w-100 h-100 position-fixed  d-flex justify-content-center align-items-center' style={{ zIndex: 9999, left: 0, top: 0 }}>
            <ScaleLoader color="#36d7b7" />
        </div>
    ) : null
}

export default Loader