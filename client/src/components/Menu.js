import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../redux/actions/authAction'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import Avatar from './Avatar'
import NotifyModal from './home/comments/NotifyModal'

const Menu = () => {

    const { auth, theme, notify } = useSelector(state => state)
    const dispatch = useDispatch()
    const navLinks = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Message', icon: 'near_me', path: '/message' },
        { label: 'Discover', icon: 'explore', path: '/discover' },
    ]

    const { pathname } = useLocation()
    const isActive = (pn) => {
        if (pn === pathname) {
            return 'active'
        }
    }



    return (
        <div className="menu" id="navbarSupportedContent">

            <ul className="navbar mr-auto">

                {
                    navLinks.map((link, index) => (
                        <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                            <Link className="nav-link" to={link.path}>
                                <span className='material-icons' style={{ fontWeight: 'bolder' }}>{link.label}</span>
                            </Link>
                        </li>
                    ))
                }


                <li className="nav-item dropdown" style={{ opacity: 1 }}>

                    <span className="nav-link position-relative" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className='material-icons'
                            style={{
                                fontWeight: 'bolder',
                                color: notify.data.length > 0 ? 'crimson' : '' 
                            }}>
                            <i className="fa-solid fa-bell" style={{ fontSize: '2.3rem' }}></i>
                        </span>
                        <span className='notify_length' style={{color: 'blue'}}>{notify.data.length}</span>

                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <NotifyModal />
                    </div>

                </li>


                <li className="nav-item dropdown" style={{ opacity: 1 }}>

                    <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Avatar src={auth.user.avatar} theme={theme} size='medium-avatar' />
                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>

                        <label htmlFor='theme' className='dropdown-item'
                            onClick={() => dispatch({ type: GLOBALTYPES.THEME, payload: !theme })}
                        >

                            {theme ? 'Light Mode' : 'Dark Mode'}
                        </label>
                        <Link className="dropdown-item" to='/'> </Link>

                        <div className="dropdown-divider"></div>

                        <Link className="dropdown-item" to='/'
                            onClick={() => dispatch(logout())}
                        >Đăng Xuất
                        </Link>

                    </div>
                </li>

            </ul>

        </div>
    )
}

export default Menu