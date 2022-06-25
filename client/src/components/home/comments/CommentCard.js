import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../Avatar'
import moment from 'moment'
import LikeButton from '../../LikeButton'
import { useDispatch, useSelector } from 'react-redux'
import CommentMenu from './CommentMenu'
import { likeComment, unLikeComment, updateComment } from '../../../redux/actions/commentAction'
import InputComment from '../InputComment'

const CommentCard = ({ children, comment, post, commentId }) => {
    const { auth, theme } = useSelector(state => state)

    const [content, setContent] = useState('')
    const [readMore, setReadMore] = useState(false)

    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)

    const [onEdit, setOnEdit] = useState(false)
    const [onReply, setOnReply] = useState(false)


    const dispatch = useDispatch()

    useEffect(() => {

        setContent(comment.content)
        setIsLike(false)
        setOnReply(false)
        if (comment.likes.find(like => like._id === auth.user._id)) {
            setIsLike(true)
        }

    }, [comment, auth.user._id])

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }


    const handleLike = async () => {
        if (loadLike) return
        setIsLike(true)
        setLoadLike(true)
        await dispatch(likeComment({ comment, post, auth }))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if (loadLike) return
        setIsLike(false)
        setLoadLike(true)
        await dispatch(unLikeComment({ comment, post, auth }))
        setLoadLike(false)
    }

    const handleUpdate = () => {
        if (comment.content !== content) {
            dispatch(updateComment({ comment, post, content, auth }))
            setOnEdit(false)
        } else {
            setOnEdit(false)
        }
    }

    const handleReply = () => {
        if (onReply) return setOnReply(false)
        setOnReply({ ...comment, commentId })
    }


    return (

        <div className='comment_card mt-2' style={styleCard}>
            <Link to={`/profile/${comment.user._id}`} style={{ display: 'flex' }}>
                <Avatar src={comment.user.avatar} size='small-avatar' />
                <h6 className='mx-1' style={{ paddingLeft: '7px' }}>{comment.user.username}</h6>
            </Link>

            <div className='comment_content'
                style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>

                <div className='flex-fill'>
                    {
                        onEdit
                            ? <textarea rows='5' value={content}
                                onChange={(e) => setContent(e.target.value)} />
                            : <div>
                                {
                                    comment.tag && comment.tag._id !== comment.user._id &&

                                    <Link to={`/profile/${comment.tag._id}`}>
                                        @{comment.tag.username}:
                                    </Link>

                                }
                                <span>
                                    {content.length < 100 ? content :
                                        readMore ? content + ' ' : content.slice(0, 100) + '...'}
                                </span>
                                {
                                    content.length > 100 && <span className='readMore'
                                        onClick={() => setReadMore(!readMore)}
                                        style={{ cursor: 'pointer', color: 'crimson' }}
                                    >
                                        {readMore ? 'Hide Content' : 'Read More'}
                                    </span>
                                }
                            </div>
                    }
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                    <div style={{ cursor: 'pointer' }}>
                        <small className='text-muted mr-3'>
                            {moment(comment.createdAt).fromNow()}
                        </small>
                        <small className='font-weight-bold mr-3'>
                            {comment.likes.length} likes
                        </small>

                        {
                            onEdit
                                ?
                                <>
                                    <small className='font-weight-bold mr-3'
                                        onClick={handleUpdate}>
                                        Update
                                    </small>

                                    <small className='font-weight-bold mr-3' onClick={() => setOnEdit(false)}>
                                        Cancel
                                    </small>
                                </>
                                :
                                <small className='font-weight-bold mr-3'
                                    onClick={handleReply}
                                >
                                    {onReply ? 'Cancel' : 'Reply'}
                                </small>
                        }

                    </div>

                    <div>
                        <LikeButton isLike={isLike}
                            handleLike={handleLike}
                            handleUnLike={handleUnLike}
                        />
                        <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
                    </div>

                </div>

            </div>

            {
                onReply &&
                <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
                    <Link to={`/profile/${onReply.user._id}`} className='mr-1'>
                        @{onReply.user.username}:
                    </Link>
                </InputComment>
            }

            {children}

        </div>
    )
}

export default CommentCard