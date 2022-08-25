import React, { Fragment, useState, useEffect } from 'react'
import './UpdatePassword.css.css';
import { useNavigate } from 'react-router-dom'
import Loader from '../layout/Loader/Loader';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { clearError, loadUser, updatePassword } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { UPDATE_PASSWORD_RESET } from '../../constents/userConstent';
import MetaData from '../layout/MetaData';

const UpdatePassword = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const { oldPassword, newPassword, confirmPassword } = password

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const myFunc = new FormData();

        myFunc.set('oldPassword', oldPassword);
        myFunc.set('newPassword', newPassword);
        myFunc.set('confirmPassword', confirmPassword);

        dispatch(updatePassword(myFunc))
    }

    const updatePasswordDataChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError)
        }
        if (isUpdated) {
            alert.success("Password Updated Successfully")
            dispatch(loadUser())
            navigate('/account')

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

    }, [dispatch, alert, error, isUpdated, navigate])



    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title="Update Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className='updatePasswordHeading'>Update Password</h2>
                            <form
                                className="updatePasswordForm"
                                onSubmit={updatePasswordSubmit}
                            >
                                <div className="oldPassword">
                                    <VpnKeyIcon />
                                    <input
                                        type='password'
                                        placeholder='Old Password'
                                        value={oldPassword}
                                        onChange={updatePasswordDataChange}
                                        name="oldPassword"
                                        required
                                    />
                                </div>
                                <div className="newPassword">
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='New Password'
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={updatePasswordDataChange}
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
                                        onChange={updatePasswordDataChange}
                                        required
                                    />
                                </div>

                                <input type="submit" value="Update" className='updatePasswordBtn' />

                            </form>
                        </div>
                    </div>

                </Fragment>
            }

        </Fragment>

    )
}

export default UpdatePassword