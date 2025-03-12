import logo from '../assets/logo.svg'
import lang from '../assets/lang.svg'

const Navbar = () => {
    return (
        <nav>
            <div className="nav-logo">
                <a href="">
                    <img src={logo} alt="logo" />
                </a>
            </div>
            <p>Abdurasul</p>
            <ul className="tool">
                <li>
                    <button>
                        <img src={lang} alt="lang" />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar