import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { GLOBALTYPES } from "./globalTypes";
import { createNotify, removeNotify } from "./notifyAction";

export const PROFILE_TYPES = {
    LOADING: "LOADING",
    GET_USER: "GET_USER",
    FOLLOW: "FOLLOW",
    UNFOLLOW: "UNFOLLOW",
    GET_ID: "GET_PROFILE_ID",
    GET_POSTS: "GET_PROFILE_POSTS",
    UPDATE_POST: "UPDATE_PROFILE_POSTS",
};

export const getProfileUsers =
    ({ users, id, auth }) =>
        async (dispatch) => {
            dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });

            try {
                dispatch({ type: PROFILE_TYPES.LOADING, payload: true });

                const res = getDataAPI(`/user/${id}`, auth.token);
                const res1 = getDataAPI(`/user_posts/${id}`, auth.token);

                const users = await res;
                const posts = await res1;

                dispatch({
                    type: PROFILE_TYPES.GET_USER,
                    payload: users.data,
                });

                dispatch({
                    type: PROFILE_TYPES.GET_POSTS,
                    payload: { ...posts.data, _id: id, page: 2 },
                });

                dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
            } catch (error) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: error.response.data.msg },
                });
            }
        };

export const updateProfileUser =
    ({ userData, avatar, auth }) =>
        async (dispatch) => {
            if (!userData.fullname)
                return dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: "Plz add your fullname" },
                });
            if (userData.fullname.length > 25)
                return dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: "Your fullname is so long" },
                });
            if (userData.story.length > 200)
                return dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: "Your story is so long" },
                });

            try {
                let media;
                dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
                if (avatar) media = await imageUpload([avatar]);

                const res = await patchDataAPI(
                    "user",
                    { ...userData, avatar: avatar ? media[0].url : auth.user.avatar },
                    auth.token
                );

                dispatch({
                    type: GLOBALTYPES.AUTH,
                    payload: {
                        ...auth,
                        user: {
                            ...auth.user,
                            ...userData,
                            avatar: avatar ? media[0].url : auth.user.avatar,
                        },
                    },
                });

                dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
            } catch (error) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: error.response.data.msg },
                });
            }
        };

export const follow =
    ({ users, user, auth, socket }) =>
        async (dispatch) => {
            let newUser = { ...user, followers: [...user.followers, auth.user] };

            dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser });
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: { ...auth.user, following: [...auth.user.following, newUser] },
                },
            });

            try {
                const res = await patchDataAPI(
                    `user/${user._id}/follow`,
                    null,
                    auth.token
                );

                // Socket
                socket.emit("follow", res.data.newUser);

                const msg = {
                    id: auth.user._id,
                    text: "has started follow you !",
                    recipients: [newUser._id],
                    url: `/profile/${auth.user._id}`,
                };

                dispatch(createNotify({ msg, auth, socket }));
            } catch (error) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: error.response.data.msg },
                });
            }
        };

export const unfollow =
    ({ users, user, auth, socket }) =>
        async (dispatch) => {
            let newUser = {
                ...user,
                followers: user.followers.filter((item) => item._id !== auth.user._id),
            };
            dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser });
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: {
                        ...auth.user,
                        following: auth.user.following.filter(
                            (item) => item._id !== newUser._id
                        ),
                    },
                },
            });

            // Socket

            try {
                const res = await patchDataAPI(
                    `user/${user._id}/unfollow`,
                    null,
                    auth.token
                );

                socket.emit("unFollow", res.data.newUser);

                const msg = {
                    id: auth.user._id,
                    text: "has stopped follow you !",
                    recipients: [newUser._id],
                    url: `/profile/${auth.user._id}`,
                };

                dispatch(removeNotify({ msg, auth, socket }));

            } catch (error) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { error: error.response.data.msg },
                });
            }
        };
