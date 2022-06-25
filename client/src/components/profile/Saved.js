import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { getDataAPI, postDataAPI } from '../../utils/fetchData'
import LoadMoreBtn from '../LoadMoreBtn'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'

const Saved = ({ auth, dispatch }) => {

    const [savePosts, setSavePosts] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(2)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        setLoad(true)
        getDataAPI('getSavePost', auth.token)
            .then(res => {
                setSavePosts(res.data.savePosts)
                setResult(res.data.result)
                setLoad(false)
            })
            .catch(err => {
                dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
            })
        return () => {
            console.log('remove save post in memory')
            setSavePosts([])
        }
    }, [auth.token, dispatch])

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`getSavePost?limit=${page * 9}`, auth.token)
        setSavePosts(res.data.savePosts)
        setResult(res.data.result)
        setPage(page + 1)
        setLoad(false)
    }


    return (
        <div>
            <PostThumb posts={savePosts} result={result} />


            {load && <img src={LoadIcon} alt='loading' className='d-block mx-auto' />}

            <LoadMoreBtn result={result} page={page} load={load}
                handleLoadMore={handleLoadMore}
            />

        </div>
    )
}

export default Saved