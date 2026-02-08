import { GoHomeFill } from "react-icons/go";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (<div>
        <h1>Just Join It - Job Board</h1>
        <nav>
            <NavLink to="/">
                <GoHomeFill size={30} />
            </NavLink>
        </nav>
    </div>)
};

export default Navbar;