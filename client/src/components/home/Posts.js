import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadMoreBtn from '../LoadMoreBtn'
import PostCard from '../PostCard'
import LoadIcon from '../../images/loading.gif'

import CardBody from './post_card/CardBody'
import CardFooter from './post_card/CardFooter'
import CardHeader from './post_card/CardHeader'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'


const Posts = () => {

    const { homePosts, auth, theme } = useSelector(state => state)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()
    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token)
        dispatch({ type: POST_TYPES.GET_POSTS, payload: { ...res.data, page: homePosts.page + 1 } })
        setLoad(false)
    }

    return (
        <div className='posts'>
            {
                homePosts.posts.map(post => (
                    <PostCard post={post} key={post._id} theme={theme} />
                ))
            }


            {load && <img src={LoadIcon} alt='loading' className='d-block mx-auto' />}

            <LoadMoreBtn result={homePosts.result} page={homePosts.page} load={load}
                handleLoadMore={handleLoadMore} />


        </div>
    )
}

export default Posts