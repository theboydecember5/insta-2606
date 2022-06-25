import React from 'react'

const LoadMoreBtn = ({ result, page, load, handleLoadMore }) => {
    return (
        <>
            {
                result < 9 * (page - 1) ? '' : !load && <button className='btn btn-danger mx-auto d-block'
                    onClick={handleLoadMore}
                >Loadmore</button>
            }

        </>
    )
}

export default LoadMoreBtn