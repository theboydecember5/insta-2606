import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getProfileUsers } from '../../redux/actions/profileActions'
import Avatar from '../Avatar'
import FollowBtn from '../FollowBtn'
import EditProfile from './EditProfile'
import Followers from './Followers'
import Following from './Following'

const Info = ({ id, auth, profile, dispatch }) => {


    const [userData, setUserData] = useState([])
    const [onEdit, setOnEdit] = useState(false)

    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)



    useEffect(() => {
        if (id === auth.user._id) {
            setUserData([auth.user])
        } else {
            const newData = profile.users.filter(user => user._id === id)
            setUserData(newData)
        }
    }, [id, auth, dispatch, profile.users])


    return (
        <div className='info'>
            {
                userData.map(user => (
                    <div className='info_container' key={user._id}>
                        <Avatar src={user.avatar} size='supper-avatar' />
                        <div className='info_content'>
                            <div>
                                <div className='info_content_title'>
                                    <h2>{user.username}</h2>
                                </div>
                                <span className='mr-4' style={{ cursor: 'pointer' }}
                                    onClick={() => setShowFollowers(true)}
                                >
                                    {user.followers.length}  Followers
                                </span>
                                <span style={{ cursor: 'pointer' }}
                                    onClick={() => setShowFollowing(true)}
                                >
                                    {user.following.length}  Following
                                </span>
                                <h6>{user.fullname}</h6>
                                <h6>{user.mobile}</h6>
                                <p>{user.address}</p>
                                <h6>{user.email}</h6>
                                <a href={user.website} target='_blank' rel='noreferrer'>{user.website}</a>
                                <p>{user.story}</p>
                            </div>
                            {
                                user._id === auth.user._id ?
                                    <button className='btn btn-outline-info'
                                        onClick={() => setOnEdit(true)}
                                    >
                                        Edit Profile
                                    </button> : <FollowBtn user={user} />
                            }


                            {
                                onEdit && <EditProfile user={user} setOnEdit={setOnEdit} />
                            }

                            {
                                showFollowers &&
                                <Followers
                                    users={user.followers}
                                    setShowFollowers={setShowFollowers} />
                            }

                            {
                                showFollowing &&
                                <Following
                                    users={user.following}
                                    setShowFollowing={setShowFollowing} />
                            }

                        </div>

                    </div>
                ))
            }
        </div >
    )
}

export default Info