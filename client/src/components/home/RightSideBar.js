import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserCard from '../UserCard'
import LoadIcon from '../../images/loading.gif'
import FollowBtn from '../FollowBtn'
import { getSuggestions } from '../../redux/actions/suggestionAction'
const RightSideBar = () => {

    const { auth, suggestion } = useSelector(state => state)
    const dispatch = useDispatch()

    return (
        <div className='my-4'>
            <UserCard user={auth.user} />
            <div className='d-flex justify-content-between align-items-center my-2'>
                <h5 className='text-danger' >
                    Someone you can know!
                </h5>
                {
                    !suggestion.loading &&
                    <i className='fas fa-redo' style={{ cursor: 'pointer' }}
                        onClick={() => dispatch(getSuggestions(auth.token))}
                    />

                }
            </div>
            {
                suggestion.loading ? <img src={LoadIcon} alt='loading' className='d-block mx-auto my-4' />
                    :
                    <div className='suggestions'>
                        {
                            suggestion.users.map(user => (
                                <div key={user._id}>
                                    <UserCard user={user}   >
                                        <FollowBtn user={user} />
                                    </UserCard>
                                </div>
                            ))
                        }
                    </div>
            }
            <div style={{ textAlign: 'center' }}>
                <a href='http://google.com.vn'>
                    VinhdevCV
                </a>
                <small className='d-block'>Welcome to my network ! Vinhdev-VN</small>
            </div>
        </div>
    )
}

export default RightSideBar