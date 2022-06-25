import { deleteDataAPI, getDataAPI, patchDataAPI, postDataAPI } from "../../utils/fetchData"
import { imageUpload } from "../../utils/imageUpload"
import { DeleteData, EditData } from "../reducers/postReducer"
import { GLOBALTYPES } from "./globalTypes"
import { removeNotify } from "./notifyAction"
import { POST_TYPES } from "./postAction"

export const COMMENT_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST'
}

export const createComment = ({ post, newComment, auth, socket }) => async (dispatch) => {

    const newPost = { ...post, comments: [...post.comments, newComment] }
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {

        const data = { ...newComment, postId: post._id, postUserId: post.user._id }
        const res = await postDataAPI('comment', data, auth.token)

        const newData = { ...res.data.newComment, user: auth.user }
        const newPost = { ...post, comments: [...post.comments, newData] }

        dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

        // Socket Comments
        socket.emit('createComment', newPost)

        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned  you in a comment' : 'has commented on your post!',
            recipients: newComment.reply ? [newComment.tag._id]: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content,
            image: post.images[0].url
        }

        // Create a notify on sever and emit socket to realtime notify
        const resNoti = await postDataAPI('notify', msg, auth.token)

        socket.emit('createNotify', {
            ...resNoti.data.notify, user: {
                username: auth.user.username,
                avatar: auth.user.avatar
            }
        })

    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }

}

export const updateComment = ({ comment, post, content, auth }) => async (dispatch) => {

    const newComment = EditData(post.comments, comment._id, { ...comment, content })

    const newPost = { ...post, comments: newComment }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {
        const res = await patchDataAPI(`comment/${comment._id}`, { content }, auth.token)
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })


    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }

}

export const likeComment = ({ comment, post, auth }) => async (dispatch) => {
    // Xóa người like trong Array Array Likes
    const newComment = { ...comment, likes: [...comment.likes, auth.user] }

    // Cập nhật lại mảng comments
    const newComments = EditData(post.comments, comment._id, newComment)

    // Cập nhật lại post
    const newPost = { ...post, comments: newComments }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {

        await patchDataAPI(`comment/${comment._id}/like`, null, auth.token)

    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }

}

export const unLikeComment = ({ comment, post, auth }) => async (dispatch) => {
    const newComment = { ...comment, likes: DeleteData(comment.likes, auth.user._id) }

    const newComments = EditData(post.comments, comment._id, newComment)

    const newPost = { ...post, comments: newComments }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    try {

        await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token)

    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }

}

export const deleteComment = ({ post, auth, comment, socket }) => async (dispatch) => {
    // Xóa 1 array trong 1 array
    const deleteArr = [...post.comments.filter(cm => cm.reply === comment._id), comment]

    const newComment = [...post.comments]

    const newPost = {
        ...post,
        // Lấy các Object không trùng nhau giữa 2 mảng
        comments: post.comments.filter(cm => !deleteArr.find(da => cm._id === da._id))
    }

    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

    // Realtime Socket
    socket.emit('deleteComment', newPost)

    try {
        deleteArr.forEach( item => {
            deleteDataAPI(`comment/${item._id}`, auth.token)
            const msg = {
                id: item._id,
                text: comment.reply ? 'mentioned  you in a comment' : 'has commented on your post!',
                recipients: comment.reply ? [comment.tag._id]: [post.user._id],
                url: `/post/${post._id}`
            }

            dispatch(removeNotify({msg, auth, socket}))
        })

    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }

}






