import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser } from '../../redux/actions/profileActions'
import { checkImage } from '../../utils/imageUpload'

const EditProfile = ({ user, setOnEdit }) => {

    const initState = {
        fullname: '',
        mobile: '',
        address: '',
        website: '',
        story: '',
        gender: '',
    }

    const [userData, setUserData] = useState(initState)

    const { fullname, mobile, address, website, story, gender } = userData

    const [avatar, setAvatar] = useState('')

    const { auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        const err = checkImage(file)
        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setAvatar(file)
    }

    useEffect(() => {
        setUserData(auth.user)
    }, [auth.user])

    const handleInput = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateProfileUser({ userData, avatar, auth }))
    }

    return (
        <div className='edit_profile'>
            <button className='btn btn-danger btn-close'
                onClick={() => setOnEdit(false)}
            >
                Close
            </button>

            <form onSubmit={handleSubmit}>
                <div className='info_avatar'>
                    <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt='avatar'
                        style={{ filter: theme ? 'invert(1)' : 'invert(0)', width: '150px' }}
                    />
                </div>

                <span>
                    <p>Change</p>
                    <input type='file' name='file' id='file_up'
                        accept='image/*' onChange={changeAvatar}
                    />
                </span>

                <div className='form_group'>
                    <label htmlFor='fullname'>Full Name</label>
                    <div className='position-relative'>
                        <input type='text' className='form-control' id='fullname' name='fullname'
                            value={fullname} onChange={handleInput}
                        />
                        <small className='text-danger position-absolute' style={{ top: '50%', right: '5px', transform: 'translateY(-50%)' }}>
                            {fullname.length}/25
                        </small>
                    </div>
                </div>

                <div className='form_group'>
                    <label htmlFor='mobile'>Mobile</label>
                    <div className='position-relative'>
                        <input type='number' className='form-control' id='mobile' name='mobile'
                            value={mobile} onChange={handleInput}
                        />
                    </div>
                </div>

                <div className='form_group'>
                    <label htmlFor='address'>Address</label>
                    <div className='position-relative'>
                        <input type='text' className='form-control' id='address' name='address'
                            value={address} onChange={handleInput}
                        />
                    </div>
                </div>

                <div className='form_group'>
                    <label htmlFor='website'>Website</label>
                    <div className='position-relative'>
                        <input type='text' className='form-control' id='website' name='website'
                            value={website} onChange={handleInput}
                        />
                    </div>
                </div>

                <div className='form_group'>
                    <label htmlFor='story'>Story</label>
                    <div className='position-relative'>
                        <textarea type='text' className='form-control' id='story' name='story'
                            cols='30' rows='4' value={story} onChange={handleInput}
                        />
                    </div>
                    <small className='text-danger d-block text-right' >
                        {story.length}/200
                    </small>
                </div>

                <label htmlFor='gender'>Gender</label>
                <div className='input-group-prepend px-0 mb-4'>
                    <select name='gender' id='gender'
                        className='custom-select text-capitalize'
                        value={gender}
                        onChange={handleInput}>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='other'>Others</option>
                    </select>
                </div>

                <button className='btn btn-info w-100' type='submit'>Save</button>
            </form>

        </div>
    )
}

export default EditProfile