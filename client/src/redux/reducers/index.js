import { combineReducers } from 'redux'
import auth from './authReducer'
import notify from './notifyReducer'
import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import homePosts from './postReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestion from './suggestionReducer'
import socket from './socketReducer'
import message from './messageReducer'


export default combineReducers({
    auth,
    notify,
    theme,
    profile,
    status,
    homePosts,
    detailPost,
    discover,
    suggestion,
    socket,
    message
})