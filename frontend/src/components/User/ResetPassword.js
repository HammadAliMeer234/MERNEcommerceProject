import React, { Fragment, useState, useEffect } from 'react'
import './ResetPassword.css.css';
import { useNavigate , useParams} from 'react-router-dom'
import Loader from '../layout/Loader/Loader';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import { clearError, resetPassword } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData';

const ResetPassword = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()

    const { error, success, loading } = useSelector(state => state.forgotPassword)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        const myFunc = new FormData();

        myFunc.set('password', password);
        myFunc.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(myFunc , params.token))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError)
        }
        if (success) {
            alert.success("Passwor Reset Successfully")
            navigate('/login')

        }

    }, [dispatch, alert, error, success, navigate])



    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title="Reset Password" />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className='resetPasswordHeading'>Reset Password</h2>
                            <form
                                className="resetPasswordForm"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div className="newPassword">
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='New Password'
                                        name="newPassword"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="confirmPassword">
                                    <LockIcon />
                                    <input
                                        type='password'
                                        placeholder='Confirm Password'
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <input type="submit" value="Update" className='resetPasswordBtn' />

                            </form>
                        </div>
                    </div>

                </Fragment>
            }

        </Fragment>

    )
}

export default ResetPassword