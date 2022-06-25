import React from 'react'
import { useSelector } from 'react-redux'



const LikeButton = ({ isLike, handleLike, handleUnLike }) => {

    const { theme } = useSelector(state => state)

    return (
        <>
            {
                isLike ?

                    <i className='fas fa-heart text-danger'
                        onClick={handleUnLike}
                        style={{
                            fontSize: '25px', marginRight: '10px', paddingTop: '10px',
                            filter: theme ? 'invert(1)' : 'invert(0)'
                        }} /> :

                    <i className='far fa-heart'
                        onClick={handleLike}
                        style={{ fontSize: '25px', marginRight: '10px', paddingTop: '10px' }} />

            }
        </>
    )
}

export default LikeButton