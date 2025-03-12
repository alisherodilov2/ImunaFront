import logo from '../assets/logo.svg'
import lang from '../assets/lang.svg'

const Header = () => {
    return (
        <header>
            <h1>
                <span>Tursunboyev</span>
                <span>Abdurasul</span>
                <span>web developer</span>
            </h1>
            <ul className="nav-menu">
                <li>
                    <a href="">
                        <span>01</span>
                        <span>works</span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <span>01</span>
                        <span>works</span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <span>01</span>
                        <span>works</span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <span>01</span>
                        <span>works</span>
                    </a>
                </li>
            </ul>
            <div className="content">
                <div className="item">
                    <p>Front-End Programmer</p>
                    <p>Front-End Programmer</p>
                    <p>Front-End Programmer</p>
                </div>
                <div className="item">
                    <img src="./boy.png" alt="boy" />
                </div>
                <div className="item">
                    <p>Front-End Programmer</p>
                    <p>Front-End Programmer</p>
                    <p>Front-End Programmer</p>
                </div>
            </div>
        </header>
    )
}

export default Header