import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Send from '../../../images/send.svg'
import { likePost, savePost, unLikePost, unSavePost } from '../../../redux/actions/postAction'
import { BASE_URL } from '../../../utils/config'
import LikeButton from '../../LikeButton'
import ShareModal from '../../ShareModal'

const CardFooter = ({ post }) => {

    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)
    const { auth, theme, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const [isShare, setIsShare] = useState(false)
    const [saved, setSaved] = useState(false)
    const [saveLoad, setSaveLoad] = useState(false)


    // Like Post
    useEffect(() => {
        if (post.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true)
        } else {
            setIsLike(false)
        }
    }, [post.likes, auth.user._id])

    const handleLike = async () => {
        if (loadLike) return;
        setIsLike(true)
        setLoadLike(true)
        await dispatch(likePost({ post, auth, socket }))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if (loadLike) return;
        setIsLike(false)
        setLoadLike(true)
        await dispatch(unLikePost({ post, auth, socket }))
        setLoadLike(false)
    }



    // Saved Post
    useEffect(() => {
        if (auth.user.saved.find(id => id === post._id)) {
            setSaved(true)
        } else {
            setSaved(false)
        }
    }, [post._id, auth.user.saved])

    const handleSavePost = async () => {
        if (saveLoad) return;
        setSaveLoad(true)
        await dispatch(savePost({ post, auth }))
        setSaveLoad(false)
    }

    const handleUnSavePost = async () => {
        if (saveLoad) return;
        setSaveLoad(true)
        await dispatch(unSavePost({ post, auth }))
        setSaveLoad(false)
    }

    return (
        <div className='card_footer'>

            <div className='card_icon_menu'>
                <div>

                    <LikeButton
                        isLike={isLike}
                        handleLike={handleLike}
                        handleUnLike={handleUnLike}
                    />

                    <Link to={`/post/${post._id}`} className='text-dark'>
                        <i className='far fa-comment' style={{ fontSize: '25px', marginRight: '10px' }} />
                    </Link>

                    <img src={Send} alt='send' onClick={() => setIsShare(!isShare)} />
                </div>

                {
                    saved ?
                        <span style={{ fontWeight: 'bolder', fontSize: '25px', marginRight: '10px' }}
                            onClick={handleUnSavePost}>
                            <i className='fas fa-bookmark text-danger' />
                        </span> :
                        <span style={{ fontWeight: 'bolder', fontSize: '25px', marginRight: '10px' }}
                            onClick={handleSavePost}>
                            <i className='far fa-bookmark' />
                        </span>
                }


            </div>

            <div className='d-flex justify-content-between mx-0'>

                <h6 style={{ padding: '0 25px', cursor: 'pointer', fontWeight: 'bolder' }}>
                    {post.likes.length} Likes
                </h6>

                <h6 style={{ padding: '0 25px', cursor: 'pointer', fontWeight: 'bolder' }}>
                    {post.comments.length} Comments
                </h6>

            </div>
            {
                isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} />
            }
        </div>
    )
}

export default CardFooter