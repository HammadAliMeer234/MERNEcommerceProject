import React, { Fragment, useState, useEffect, useRef } from 'react'
import './LoginSignUp.css';
import Loader from '../layout/Loader/Loader';
import { Link, useNavigate  , useLocation} from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MailOutLineIcon from '@mui/icons-material/MailOutline';
import FaceIcon from '@mui/icons-material/Face';
import { clearError, login, register } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'

const LoginSignUp = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, isAuthenticated, error } = useSelector(state => state.user)

    const loginTab = useRef(null)
    const registerTab = useRef(null)
    const switcherTab = useRef(null)

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [avatar, setAvatar] = useState('/profile.png');
    const [avatarPreview, setAvatarPreview] = useState('/profile.png');

    const { name, email, password } = user;

    const loginSubmit = (e) => {
        e.preventDefault()
        dispatch(login(loginEmail, loginPassword))
    }
    const registerSubmit = (e) => {
        e.preventDefault();
        const myFunc = new FormData();

        myFunc.set('name', name);
        myFunc.set('email', email);
        myFunc.set('password', password);
        myFunc.set('avatar', avatar);

        dispatch(register(myFunc))

    }

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add('shiftToNeutral')
            switcherTab.current.classList.remove('shiftToRight')

            registerTab.current.classList.remove('shiftToNeutralForm')
            loginTab.current.classList.remove('shiftToLeft')
        }
        if (tab === "register") {
            switcherTab.current.classList.remove('shiftToNeutral')
            switcherTab.current.classList.add('shiftToRight')

            registerTab.current.classList.add('shiftToNeutralForm')
            loginTab.current.classList.add('shiftToLeft')
        }
    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            console.log(e.target.name);
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatar(reader.result)
                    setAvatarPreview(reader.result)
                }
            };

            reader.readAsDataURL(e.target.files[0])
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }

    const redirect = location.search ? location.search.split('=')[1] : "account"
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError)
        }
        if (isAuthenticated) {
            navigate(`/${redirect}`)
        }
    }, [dispatch, alert, error, isAuthenticated, navigate ,redirect])



    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>

                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <div>
                                <div className="login_signUp_toggle">
                                    <p onClick={(e) => switchTabs(e, "login")}>Login</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>Register</p>
                                </div>
                                <button ref={switcherTab}></button>
                            </div>
                            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                                <div className="loginEmail">
                                    <MailOutLineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Link to="/password/forgot">Forgot Password</Link>
                                <input type="submit" value="Login" className='loginBtn' />
                            </form>

                            <form
                                className="signUpForm"
                                ref={registerTab}
                                encType="multipart/form-data"
                                onSubmit={registerSubmit}
                            >

                                <div className="signUpName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder='Name'
                                        required
                                        name='name'
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpEmail">
                                    <MailOutLineIcon />
                                    <input
                                        type="email"
                                        placeholder='Email'
                                        required
                                        name='email'
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div className="signUpPassword">
                                    <MailOutLineIcon />
                                    <input
                                        type="password"
                                        placeholder='Password'
                                        required
                                        name='password'
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept='image/*'
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <input type="submit" value="Register" className='signUpBtn' />

                            </form>
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

export default LoginSignUp