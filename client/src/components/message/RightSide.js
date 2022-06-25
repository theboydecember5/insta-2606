import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { addMessage, getMessages, MESS_TYPES } from '../../redux/actions/messageAction'
import { imageUpload } from '../../utils/imageUpload'
import Icons from '../Icons'
import UserCard from '../UserCard'
import MsgDisplay from './MsgDisplay'
import LoadIcon from '../../images/loading.gif'
import SocketClient from '../../SocketClient'

export const imageShow = (src) => {

    return (
        <img
            src={src}
            alt='images'
            className='img-thumbnail'
        />
    )
}

export const videoShow = (src) => {
    return (
        <video
            controls
            src={src}
            alt='images'
            className='img-thumbnail'
        />
    )
}

const RightSide = () => {

    const { auth, message, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const { id } = useParams()
    const [user, setUser] = useState([])
    const [text, setText] = useState('')
    const [media, setMedia] = useState([])
    const [loadMedia, setLoadMedia] = useState(false)
    const [page, setPage] = useState(0)
    const refDisplay = useRef()
    const pageEnd = useRef()
    const [data, setData] = useState([])

    useEffect(() => {
        const newData = message.data.filter(item =>
            item.sender === auth.user._id || item.sender === id)
        setData(newData)
    }, [message.data, auth.user._id, id])

    useEffect(() => {
        const newUser = message.users.find(user => user._id === id)
        if (newUser) {
            setUser(newUser)
        }
    }, [message.users, id])

    const handleChangeMedia = (e) => {
        const files = [...e.target.files]

        let err = ''
        let newMedia = []

        files.forEach(file => {
            if (!file) return err = 'Files does not exist'
            if (file.size > 1024 * 1024 * 5) {
                return err = 'The image or video largest is 5MB'
            }
            return newMedia.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setMedia([...media, ...newMedia])
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media]
        newArr.splice(index, 1)
        setMedia(newArr)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!text.trim() && media.length === 0) return
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArr = []
        if (media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: auth.user._id,
            recipients: id,
            text,
            media: newArr,
            createdAt: new Date().toISOString()
        }

        setLoadMedia(false)
        await dispatch(addMessage({ msg, auth, socket, refDisplay }))

        if (refDisplay.current) {
            refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }

    useEffect(() => {
        if (id) {
            const getMessagesData = async () => {
                dispatch({ type: MESS_TYPES.GET_MESSAGES, payload: { messages: [] } })
                setPage(1)
                await dispatch(getMessages({ auth, id }))
                if (refDisplay.current) {
                    refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
                }
            }
            getMessagesData()
        }
    }, [auth, id, dispatch])

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
        if (message.resultData >= (page - 1) * 9 && page > 1) {
            dispatch(getMessages({ auth, id, page }))
        }
    }, [message.resultData, page, auth, id, dispatch])


    useEffect(() => {
        if (refDisplay.current) {
            refDisplay.current.scrollIntoView(false)
        }
    }, [text])

    console.log(page)
    return (
        <>
            <div className='message_header'>

                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <i className='fas fa-trash text-danger' />
                    </UserCard>
                }



            </div>

            <div className='chat_container'
                style={{ height: media.length > 0 ? 'calc(100% - 180px)' : '' }}>
                <div className='chat_display' ref={refDisplay}>
                    <button ref={pageEnd} style={{ opacity: 0 }}>Loadmore</button>
                    {
                        data.map((msg, index) => (
                            <div key={index}>
                                {
                                    msg.sender !== auth.user._id &&
                                    <div className='chat_row other_message'>
                                        <MsgDisplay user={user} msg={msg} />
                                    </div>
                                }

                                {
                                    msg.sender === auth.user._id &&
                                    <div className='chat_row you_message'>
                                        <MsgDisplay user={auth.user} msg={msg} />
                                    </div>
                                }

                            </div>
                        ))
                    }

                    {
                        loadMedia &&
                        <div className='chat_row you_message'>
                            <img src={LoadIcon} alt='loading' />
                        </div>
                    }

                </div>
            </div>

            <div className='show_media' style={{ display: media.length > 0 ? 'grid' : 'none' }}>
                {
                    media.map((item, index) => (
                        <div key={index} id='file_media'>
                            {
                                item.type.match(/video/i) ? videoShow(URL.createObjectURL(item))
                                    : imageShow(URL.createObjectURL(item))
                            }
                            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
                        </div>
                    ))
                }
            </div>


            <form className='chat_input' onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter your message ...' value={text}
                    onChange={e => setText(e.target.value)} />

                <Icons setContent={setText} content={text} />

                <div className='file_upload'>
                    <i className='fas fa-image text-danger' />
                    <input type='file' name='file' id='file'
                        multiple accept='image/*, video/*'
                        onChange={handleChangeMedia} />
                </div>

                <button disabled={(text || media.length > 0) ? false : true} className="btn btn-warning"
                    type='submit'>
                    Send
                </button>
            </form>
        </>
    )
}

export default RightSide