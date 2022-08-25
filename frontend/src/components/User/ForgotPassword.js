import React, { Fragment, useState, useEffect } from 'react'
import './ForgotPassword.css';
import Loader from '../layout/Loader/Loader';
import MailOutLineIcon from '@mui/icons-material/MailOutline';
import { clearError, forgotPassword } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData';

const ForgotPassword = () => {

    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, error, message } = useSelector(state => state.forgotPassword)

    const [email, setEmail] = useState("")

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        const myFunc = new FormData();

        myFunc.set('email', email);

        dispatch(forgotPassword(myFunc))
    }

    useEffect(() => {
      
        if (error) {
            alert.error(error)
            dispatch(clearError)

        }
        if (message) {
            alert.success(message)    
        }
    }, [dispatch , alert , error  ,message])
    


    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title="Forgot Password" />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                            <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                            >
                                <div className="forgotPasswordEmail">
                                    <MailOutLineIcon />
                                    <input
                                        type="email"
                                        placeholder='Email'
                                        required
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <input type="submit" value="Send" className='forgotPasswordBtn' />

                            </form>
                        </div>
                    </div>

                </Fragment>
            }

        </Fragment>

    )
}

export default ForgotPassword