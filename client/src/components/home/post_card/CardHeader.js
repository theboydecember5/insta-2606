import React from 'react'
import Avatar from '../../Avatar'
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import '../../../styles/home.css'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import { deletePost } from '../../../redux/actions/postAction'
import { BASE_URL } from '../../../utils/config'

const CardHeader = ({ post }) => {
  const { auth, socket } = useSelector(state => state)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleEdit = () => {
    console.log(post)
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } })
  }

  const handleDeletePost = () => {
    if (window.confirm('Are u want to delete this post ?')) {
      dispatch(deletePost({ post, auth, socket }))
      return history.push('/')
    }
  }

  // Copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
  }

  return (
    <div className='card_header' >
      <div className='d-flex' >
        <Avatar src={post.user.avatar} alt='avatar' size='big-avatar' />

        <div className='card_name'>
          <h6 className='m-0'>
            <Link to={`/profile/${post.user._id}`} className='text-dark'>
              {post.user.username}
            </Link>
          </h6>
          <small className='text-muted'>
            {moment(post.createdAt).fromNow()}
          </small>
        </div>
      </div>

      <div className='nav-item dropdown'>
        <span className='test_edit' id='moreLink' data-toggle='dropdown'>
          More Menu
        </span>

        <div className='dropdown-menu'>

          {
            auth.user._id === post.user._id &&
            <>
              <div className='dropdown-item' onClick={handleEdit}>
                <span>
                  Edit Post
                </span>
              </div>
              <div className='dropdown-item' onClick={handleDeletePost}>
                <span>
                  Delete Post
                </span>
              </div>
            </>
          }

          <div className='dropdown-item' onClick={handleCopyLink}>
            <span>
              Copy Link
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default CardHeader