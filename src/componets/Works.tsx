import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const Works = () => {
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    return (
        <div className="work">
            <div className="_all">
                <h1 className="title">Works</h1>
                <p>Pretium cursus gravida lorem scelerisque ultricies <br /> viverra velit dui. Sit mi risus  ultricies faucibus et risus <br /> vulputate. Vulputate mauris donec consectetur augue. <br /> In tristique et pulvinar diam posuere ipsum non a <br /> vivamus.</p>
            </div>
            <div className="work_">
                <Slider {...settings}>
                    <div className="work__">
                        <div>
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                        </div>
                    </div>
                    <div className="work__">
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                    </div>
                    <div className="work__">
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                    </div>
                    <div className="work__">
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                    </div>
                    <div className="work__">
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                    </div>
                    <div className="work__">
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                    </div>
                    <div className="work__">
                        <img src="./works.png" alt="" />
                        <h1>2023</h1>
                        <h1>2 projects.</h1>
                    </div>
                </Slider>
            </div>
        </div>
    )
}

export default Works