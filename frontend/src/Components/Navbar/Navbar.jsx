import React from "react";
import AvatarImg from "../../Assets/images/Avatar.png";
import AuthUser from "../../Services/AuthUser";
import LogoImg from '../../Assets/images/logo.png'
import {Link} from 'react-router-dom'
function Navbar() {
  const { logout } = AuthUser();
  const { getToken, user } = AuthUser();
  const authToken = getToken();
  const authUser = user;

  return (
    <div className="navbar bg-base-200 shadow-md fixed">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to='/'> <img src={LogoImg} className='max-w-[5rem]' alt="" /> </Link>
      </div>
      <div className="flex-none gap-2">
      <ul className="menu menu-horizontal px-1">
      <li> <Link to='/'>Home</Link> </li>
      <li> <Link to='/ask-me-anything'>Ask me anything</Link> </li>
      </ul>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-24 rounded-full ring ring-[#000000] ring-offset-base-100 ring-offset-2">
              <img src={AvatarImg} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
            

              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
