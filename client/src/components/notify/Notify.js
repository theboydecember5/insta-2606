import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Loading from './Loading'
import Toast from './Toast'

const Notify = () => {

    const state = useSelector(state => state)
    const { auth, notify } = state
    const dispatch = useDispatch()
    return (
        <div>

            {notify.loading && <Loading />}
            {notify.error && <Toast msg={{ title: 'Error', body: notify.error }}
                handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
                bgColor='bg-danger' />}
            {notify.success && <Toast msg={
                {
                    title: 'Success',
                    body: notify.success
                }}
                handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
                bgColor='bg-success' />}

        </div>
    )
}

export default Notify