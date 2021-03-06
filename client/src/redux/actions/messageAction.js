import { getDataAPI, postDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes"

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATION: 'GET_CONVERSATION',
    GET_MESSAGES: 'GET_MESSAGES',
}

export const addUser = ({ user, message }) => async (dispatch) => {
    if (message.users.every(item => item._id !== user._id)) {
        dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } })
    }
}

export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg })

    socket.emit('addMessage', msg)

    try {
        await postDataAPI('message', msg, auth.token)
    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }
}
export const getConversations = ({ auth, page = 1 }) => async (dispatch) => {

    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token)
        let newArr = []
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if (cv._id !== auth.user._id) {
                    newArr.push({ ...cv, text: item.text, media: item.media })
                }
            })
        })

        dispatch({ type: MESS_TYPES.GET_CONVERSATION, payload: { newArr, result: res.data.result } })

    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }
}
export const getMessages = ({ auth, id, page = 1 }) => async (dispatch) => {

    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, auth.token)
        dispatch({ type: MESS_TYPES.GET_MESSAGES, payload: res.data })

    } catch (error) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    }
}

