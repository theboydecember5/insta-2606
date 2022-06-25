import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'

const Status = () => {

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    return (
        <div className='status my-3 d-flex'>
            <Avatar src={auth.user.avatar} size='big-avatar' />
            <button className='statusBtn flex-fill'
                onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}
            >
                <span style={{ fontWeight: 'bold' }}>
                    {auth.user.username}
                </span>, what are you thinking?
            </button>
        </div >
    )
}

export default Status