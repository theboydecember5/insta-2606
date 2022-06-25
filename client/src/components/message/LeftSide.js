import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { addUser, getConversations } from "../../redux/actions/messageAction";
import { getDataAPI } from "../../utils/fetchData";
import Avatar from "../Avatar";
import UserCard from "../UserCard";

const LeftSide = () => {
    const [search, setSearch] = useState("");
    const [searchUsers, setSearchUsers] = useState([]);
    const { auth, message } = useSelector((state) => state);
    const dispatch = useDispatch();
    const history = useHistory()
    const { id } = useParams()
    const pageEnd = useRef()
    const [page, setPage] = useState(0)

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search) return setSearchUsers([]);
        try {
            const res = await getDataAPI(`search?username=${search}`, auth.token);
            setSearchUsers(res.data.users);
            console.log(res);
        } catch (error) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: error.response.data.msg },
            });
        }
    };

    const handleAddUser = (user) => {
        setSearchUsers('')
        setSearchUsers([])
        dispatch(addUser({ user, message }))
        return history.push(`/message/${user._id}`)
    };

    const isActive = (user) => {
        if (id === user._id) return 'active'
        return ''
    }

    useEffect(() => {
        if (message.firstLoad) return
        dispatch(getConversations({ auth }))
    }, [dispatch, auth, message.firstLoad])

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(p => p + 1)
            }
        }, {
            threshold: 1
        })
        observer.observe(pageEnd.current)
    }, [setPage])

    useEffect(() => {
        if (message.resultUsers >= (page - 1) * 9 && page > 1) {
            dispatch(getConversations({ auth, page }))
        }
    }, [message.resultUsers, page, auth, dispatch])

    return (
        <>
            <form className="message_header" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={search}
                    placeholder="Enter to search !"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" style={{ display: 'none' }}>
                    Search
                </button>
            </form>
            <div className="message_chat_list">
                {searchUsers.length !== 0 ? (
                    <>
                        {searchUsers.map((user) => (
                            <div key={user._id} onClick={() => handleAddUser(user)} className={`message_user ${isActive(user)}`}>

                                <div className={`d-flex p-2 align-items-center justify-content-between`} style={{ cursor: 'pointer' }}>
                                    <div to={`/profile/${user._id}`} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textDecoration: 'none' }}>
                                        <div className='d-flex'>
                                            <Avatar src={user.avatar} size='big-avatar' />
                                            <div className='ml-1' style={{ transform: 'translateY(-2px)' }}>
                                                <span className='d-block'>{user.username}</span>
                                                <small style={{ opacity: 0.7 }}>
                                                    {user.fullname}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {
                            message.users.map(user => (
                                <div key={user._id} onClick={() => handleAddUser(user)} >

                                    <div className={`d-flex p-2 align-items-center justify-content-between message_user ${isActive(user)}`} style={{ cursor: 'pointer' }} >
                                        <div to={`/profile/${user._id}`} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textDecoration: 'none' }}>
                                            <div className='d-flex'>
                                                <Avatar src={user.avatar} size='big-avatar' />
                                                <div className='ml-1' style={{ transform: 'translateY(-2px)' }}>
                                                    <span className='d-block'>{user.username}</span>
                                                    <small style={{ opacity: 0.7 }}>
                                                        {
                                                            user.text || user.media
                                                                ?
                                                                <>
                                                                    <div>{user.text}</div>
                                                                    {
                                                                        user.media.length > 0 &&
                                                                        <div>
                                                                            {user.media.length}
                                                                            <i className="fa-solid fa-image"></i>
                                                                        </div>
                                                                    }
                                                                </>
                                                                : user.fullname
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <i className='fas fa-circle' />
                                    </div>

                                </div>

                            ))
                        }
                    </>
                )}

                <button ref={pageEnd} style={{ opacity: 0 }} >Load More</button>
            </div>
        </>
    );
};

export default LeftSide;
