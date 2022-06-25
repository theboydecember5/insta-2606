import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { follow, unfollow } from '../redux/actions/profileActions'

const FollowBtn = ({ user }) => {

    const dispatch = useDispatch()

    const [followed, setFollowed] = useState(false)
    const [load, setLoad] = useState(false)
    const { auth, profile, socket } = useSelector(state => state)

    useEffect(() => {
        if (auth.user.following.find(item => item._id === user._id)) {
            setFollowed(true)
        }
        return () => setFollowed(false)

    }, [auth.user.following, user._id])


    const handleFollow = async () => {
        if (load) return
        setFollowed(true)
        setLoad(true)
        await dispatch(follow({ users: profile.users, user, auth, socket }))
        setLoad(false)

    }

    const handleUnFollow = async () => {
        if (load) return
        setFollowed(false)
        setLoad(true)
        await dispatch(unfollow({ users: profile.users, user, auth, socket }))
        setLoad(false)
    }

    return (
        <>
            {
                followed ?
                    <button className='btn btn-outline-danger'
                        onClick={handleUnFollow}
                    > Unfollow </button> :
                    <button className='btn btn-outline-info'
                        onClick={handleFollow}
                    > Follow </button>

            }
        </>
    )

}

export default FollowBtn