import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { register } from '../redux/actions/authAction'

const Register = () => {

    const { auth, notify } = useSelector(state => state)

    const history = useHistory()

    useEffect(() => {
        if (auth.token) {
            history.push('/')
        }
    }, [auth.token, history])


    // Register

    const [typePass, setTypePass] = useState(false)
    const [typePass1, setTypePass1] = useState(false)
    const dispatch = useDispatch()
    const initialState = { email: '', password: '', fullname: '', username: '', cf_password: '', gender: 'male' }
    const [userData, setUserData] = useState(initialState)
    const { email, password, fullname, username, cf_password, gender } = userData


    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(register(userData))
    }

    return (
        <div className='auth_page'>
            <form onSubmit={handleSubmit}>
                <h3 className='text-uppercase text-center mb-2'>Đăng Ký</h3>
                <h3 className='text-uppercase text-center mb-2'>V - Social</h3>

                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <input type="" className="form-control" id="fullname"
                        onChange={handleChangeInput}
                        value={fullname}
                        name='fullname'
                        style={{ background: `${notify.fullname ? '#fd2d6a14' : ''}` }}
                    />
                    <small className='form-text' text-danger>
                        {notify.fullname ? notify.fullname : ''}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="" className="form-control" id="email"
                        onChange={handleChangeInput}
                        value={email}
                        name='email'
                        style={{ background: `${notify.email ? '#fd2d6a14' : ''}` }}
                    />
                    <small className='form-text' text-danger>
                        {notify.email ? notify.email : ''}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <input type="" className="form-control" id="username"
                        onChange={handleChangeInput}
                        value={username.toLowerCase().replace(/ /g, '')}
                        name='username'
                        style={{ background: `${notify.username ? '#fd2d6a14' : ''}` }}
                    />
                    <small className='form-text' text-danger>
                        {notify.username ? notify.username : ''}
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type={typePass ? 'text' : 'password'} className="form-control" id="password"
                        onChange={handleChangeInput}
                        value={password}
                        name='password'
                        style={{ background: `${notify.password ? '#fd2d6a14' : ''}` }}
                    />

                    <small className='form-text' text-danger>
                        {notify.password ? notify.password : ''}
                    </small>
                    <small onClick={() => setTypePass(!typePass)} style={{ cursor: 'pointer' }}>
                        {typePass ? 'Ẩn Mật Khẩu' : 'Hiện Mật Khẩu'}
                    </small>

                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">Confirm Password</label>

                    <input type={typePass1 ? 'text' : 'password'} className="form-control" id="cf_password"
                        onChange={handleChangeInput}
                        value={cf_password}
                        name='cf_password'
                        style={{ background: `${notify.cf_password ? '#fd2d6a14' : ''}` }}
                    />

                    <small className='form-text' text-danger>
                        {notify.cf_password ? notify.cf_password : ''}
                    </small>
                    <small onClick={() => setTypePass1(!typePass1)} style={{ cursor: 'pointer' }}>
                        {typePass1 ? 'Ẩn Mật Khẩu' : 'Hiện Mật Khẩu'}
                    </small>

                </div>

                <div className='row justify-content-between mx-0 mb-1'>
                    <label htmlFor='male'>
                        Male: <input type='radio' id='male' name='gender' value='male' defaultChecked
                            onChange={handleChangeInput} />
                    </label>
                    <label htmlFor='female'>
                        Female: <input type='radio' id='female' name='gender' value='female'
                            onChange={handleChangeInput} />
                    </label>
                    <label htmlFor='other'>
                        Other: <input type='radio' id='other' name='gender' value='other'
                            onChange={handleChangeInput} />
                    </label>
                </div>

                <button type="submit" className="btn btn-primary w-100"
                    disabled={email && password ? false : true}
                    style={{ cursor: 'pointer' }}
                >Đăng Ký </button>

                <p className='my-2'>Nếu bạn đã có tài khoản ?
                    <Link to='/'> Đăng Nhập Ngay !!!</Link>
                </p>

            </form>
        </div>
    )
}

export default Register