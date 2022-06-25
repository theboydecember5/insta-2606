import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { getDataAPI } from '../utils/fetchData'
import { Link } from 'react-router-dom'
import UserCard from './UserCard'
import LoadIcon from '../images/loading.gif'

const Search = () => {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const [load, setLoad] = useState(false)

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        if (search) {
            setLoad(true)
            getDataAPI(`search?username=${search}`, auth.token)
                .then(res => setUsers(res.data.users))
                .catch(err => {
                    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
                })
            setLoad(false)
        } else {
            setUsers([])
        }
    }, [search, auth.token, dispatch])

    const handleClose = (e) => {
        e.preventDefault()
        setSearch('')
        setUsers([])
    }

    // const handleSearch = async (e) => {
    //     e.preventDefault()
    //     if (!search) return
    //     try {
    //         const res = await getDataAPI(`search?username=${search}`, auth.token)
    //         setUsers(res.data.users)
    //     } catch (error) {
    //         dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg } })
    //     }
    // }

    return (
        <form className='search_form'
        // onSubmit={handleSearch}
        >
            <input type='text' name='search'
                id='search'
                value={search}
                title='Enter to search !'
                onChange={(e) => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
            />
            <div className='search_icon'>
                <span style={{ opacity: 0.5 }}>{search ? '' : 'Search'}</span>
            </div>

            <button className='close_search' style={{ zIndex: 200, opacity: search ? 1 : 0 }}
                onClick={handleClose}
            >
                Cancel Search
            </button>

            {load && <img className='loading' src={LoadIcon} alt='loading' />}

            <div className='users'>
                {
                    search && users.map(user => (
                        <Link key={user._id} to={`/profile/${user._id}`}>
                            <UserCard key={user._id} user={user} border='border' />
                        </Link>
                    ))
                }
            </div>

        </form>
    )
}

export default Search