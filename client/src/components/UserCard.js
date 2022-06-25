import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
const UserCard = ({ children, user, border, key }) => {

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between ${border} w-100`}>
            <Link to={`/profile/${user._id}`} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textDecoration: 'none' }}>
                <div className='d-flex'>
                    <Avatar src={user.avatar} size='big-avatar' />
                    <div className='ml-1' style={{ transform: 'translateY(-2px)' }}>
                        <span className='d-block'>{user.username}</span>
                        <small style={{ opacity: 0.7 }}>
                            {user.fullname}
                        </small>
                    </div>
                </div>
                {children}
            </Link>
        </div>
    )
}

export default UserCard