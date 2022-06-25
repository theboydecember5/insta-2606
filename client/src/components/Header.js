import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/actions/authAction'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import Avatar from './Avatar'
import Menu from './Menu'
import Search from './Search'
const Header = () => {



    return (

        <div className='header bg-light'>
            <nav className="navbar navbar-expand-lg navbar-light bg-light 
            justify-content-between">
                <Link to='/' className='logo'
                    onClick={() => window.scroll({ top: 0 })}
                >
                    <h1 className="navbar-brand text-uppercase p-0 m-0">
                        V-Social
                    </h1>
                </Link>

                <Search />

                <Menu />

            </nav>

        </div>

    )
}

export default Header