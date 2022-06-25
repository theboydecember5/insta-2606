const valid = ({ email, password, fullname, username, cf_password }) => {
    const err = {}
    if (!fullname) {
        err.fullname = 'Plz add your full name !'
    } else if (fullname.length > 25) {
        err.fullname = 'Full Name is up to 25 characters long'
    }

    if (!username) {
        err.username = 'Plz add your username !'
    } else if (username.replace(/ /g, '').length > 25) {
        err.username = 'username is up to 25 characters long'
    }

    if (!email) {
        err.email = 'Plz add your email !'
    } else if (!validateEmail(email)) {
        err.email = 'Email format is in correct'
    }

    if (!password) {
        err.password = 'Plz add your password !'
    } else if (password.length < 6) {
        err.password = 'Mật khẩu ít nhất 6 kí tự !!!'
    }

    if (password !== cf_password) {
        err.cf_password = 'Confirm password again !!!'
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }

}

function validateEmail(email) {
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    return re.test(email)
}

export default valid