import React, { Fragment, useState, useEffect } from 'react'
import './UpdateProfile.css';
import { useNavigate } from 'react-router-dom'
import Loader from '../layout/Loader/Loader';
import MailOutLineIcon from '@mui/icons-material/MailOutline';
import FaceIcon from '@mui/icons-material/Face';
import { clearError, loadUser, updateProfile } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { UPDATE_PROFILE_RESET } from '../../constents/userConstent';
import MetaData from '../layout/MetaData';

const UpdateProfile = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.user)
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState('/profile.png');

    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myFunc = new FormData();

        myFunc.set('name', name);
        myFunc.set('email', email);
        myFunc.set('avatar', avatar);

        dispatch(updateProfile(myFunc))
    }

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatar(reader.result)
                setAvatarPreview(reader.result)
            }
        };

        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url)
        }
        if (error) {
            alert.error(error)
            dispatch(clearError)
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully")
            dispatch(loadUser())
            navigate('/account')

            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }

    }, [dispatch, alert, error, isUpdated, navigate, user])



    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title="Update Profile" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                            <form
                                className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={updateProfileSubmit}
                            >

                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder='Name'
                                        required
                                        name='name'
                                        value={name}
                                        onChange={(e)=> setName(e.target.value)}
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <MailOutLineIcon />
                                    <input
                                        type="email"
                                        placeholder='Email'
                                        required
                                        name='email'
                                        value={email}
                                        onChange={(e)=> setEmail(e.target.value)}
                                    />
                                </div>

                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept='image/*'
                                        onChange={updateProfileDataChange}
                                    />
                                </div>

                                <input type="submit" value="Update" className='updateProfileBtn' />

                            </form>
                        </div>
                    </div>

                </Fragment>
            }

        </Fragment>

    )
}

export default UpdateProfile