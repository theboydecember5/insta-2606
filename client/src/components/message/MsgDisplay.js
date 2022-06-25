import React from 'react'
import Avatar from '../Avatar'
import { imageShow, videoShow } from './RightSide'



const MsgDisplay = ({ user, msg }) => {
    return (
        <div className='chat_title'>
            <div>
                <Avatar src={user.avatar} size='small-avatar' />
                <span>{user.username}</span>
            </div>

            {msg.text && <div className='chat_text'>{msg.text}</div>}

            {
                msg.media.map((item, index) => (
                    <div key={index}>

                        {
                            item.url.match(/video/i) ?
                                videoShow(item.url) :
                                imageShow(item.url)
                        }

                    </div>
                ))
            }

            <div className='chat_time'>
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        </div>
    )
}

export default MsgDisplay