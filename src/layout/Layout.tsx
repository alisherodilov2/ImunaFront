import { useDispatch, useSelector } from "react-redux"
import Navbar from "./Navbar"
import Saidbar from "./Saidbar"
import { ReducerType } from "../interface/interface"
import Config from "../service/config/Config"
import Loader from "../componets/api/Loader"
import { AppDispatch } from "../service/store/store"
import { isMenuFunction } from "../service/reducer/MenuReducer"


const Layout = () => {
    const { menu } = useSelector((state: ReducerType) => state.MenuReducer)
    const { isLoading } = useSelector((state: ReducerType) => state.ProfileReducer)
    const dispatch = useDispatch<AppDispatch>();
    return (
        <>
            <Loader loading={isLoading} />
            {/* <div className="layout-container"> */}
            <Config />
            <Saidbar />
            <div className="w-100 left-0 h-100 top-0 position-fixed  " style={
                {
                    background: '#435971',
                    opacity: 0.5,
                    display:menu ? '' :'none',
                    zIndex:999
                }
            }
                onClick={() => {
                    dispatch(isMenuFunction())
                }}
            ></div>
            {/* <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container"></div>
                <div className="layout-overlay layout-menu-toggle"></div>
            </div> */}
            {/* Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem nulla cum cumque dicta perferendis reiciendis nobis repellat, reprehenderit perspiciatis aliquid debitis! Voluptatibus quas deserunt laboriosam fuga, veritatis ducimus fugit accusamus a officia quidem tenetur praesentium, eveniet nobis consequatur obcaecati. Expedita culpa hic voluptatem, illo at reiciendis quia repellat aperiam architecto magni. Ullam earum ducimus, exercitationem commodi, fuga deserunt sint nobis reiciendis in molestias cupiditate veniam sunt eum quo pariatur voluptatum saepe praesentium. Maiores voluptates esse, enim laudantium possimus, praesentium officia aut vitae omnis in nulla? Laborum sunt natus quibusdam magnam inventore, accusantium eligendi! Libero voluptas deserunt animi saepe quibusdam at neque, iure inventore nesciunt laudantium eius accusantium exercitationem a perferendis unde nobis reprehenderit recusandae labore dicta esse tempore quo. Sapiente tenetur reiciendis, quidem quia dolorum ipsam esse numquam rerum hic maxime labore. Aspernatur dolores itaque mollitia reiciendis, officia quibusdam ducimus quisquam pariatur nesciunt deleniti facilis quos saepe, dicta necessitatibus perspiciatis, architecto nemo quam tempora ratione rem minima delectus assumenda ipsa. Ipsam blanditiis eaque, a porro dignissimos cumque quaerat, quisquam reprehenderit, labore possimus voluptatem magni. Ipsum consequuntur libero cum cupiditate. Tempora eius deserunt nostrum nobis hic dolorum, nihil, rerum magnam quo in voluptas. Et error corrupti praesentium adipisci iusto repudiandae, unde, quidem soluta nulla reprehenderit cupiditate eligendi ea! Error optio, deleniti ipsa ad asperiores consequuntur quasi at aperiam sapiente accusantium iusto nihil ab sit repellendus laboriosam odio possimus ipsam repellat fugit tempore nemo necessitatibus. Eaque molestias alias sequi, impedit ratione ut laudantium libero, natus vero repellat, optio cum unde dolorum. Animi officiis nesciunt repellat error molestias quos placeat voluptas quasi, dolor, quia quas commodi recusandae vitae ex voluptate aperiam omnis atque vero repellendus. Possimus deserunt, quam minus reiciendis quod, tenetur voluptate iste exercitationem architecto consectetur non voluptatibus unde placeat harum ea modi laborum quasi. Exercitationem odio pariatur recusandae eum reiciendis sapiente eos unde libero quidem quod facere totam qui doloribus adipisci maiores nesciunt omnis nemo, quisquam impedit, ex similique suscipit. Autem ut repellat id quod in a numquam mollitia ea dolorem necessitatibus maiores tempora alias, dolor beatae nisi exercitationem odit, aliquid repellendus cumque fuga. Tempora numquam asperiores voluptatum ducimus incidunt hic. Autem architecto iusto pariatur velit culpa laudantium ipsa quo non necessitatibus iste, aperiam ex sed aliquid exercitationem dignissimos, est tempore cum a nesciunt. Odio, fuga enim! Expedita ducimus magni modi a sequi veniam quia doloribus tempore. Labore itaque deserunt corrupti similique nesciunt odit commodi, sint quam tempore. Delectus blanditiis, iusto nisi eos maxime assumenda ipsa consequuntur autem molestias exercitationem, minus at ad ipsum ab voluptatum quo cum velit accusamus sit. Laboriosam quisquam iste commodi sapiente nihil ipsa temporibus voluptatibus illo, eveniet minus atque dolorum quod a, nisi tenetur quae molestias. Libero, modi. Natus vel sunt aspernatur fuga quod architecto earum accusantium debitis eos corporis numquam, commodi voluptatum consectetur voluptates tenetur laborum nulla labore cum eligendi sequi porro explicabo ratione quam enim! Id dolorem exercitationem dicta praesentium perferendis, cumque ipsam assumenda, aliquam iusto, autem ea enim adipisci obcaecati placeat ex esse beatae tempore corporis doloremque quas suscipit. Ad, velit commodi. Expedita? */}
            {/* <div className={`layout-page`}>
                        <div>
                            {children}
                        </div>
                    </div> */}
            {/* </div> */}
            {/* </div> */}
        </>
    )
}

export default Layout