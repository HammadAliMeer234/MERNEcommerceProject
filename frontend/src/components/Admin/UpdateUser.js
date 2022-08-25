import React, { Fragment, useEffect, useState } from 'react';
import "./css/UpdateUser.css"
import { updateUser, clearError, getUserDetails } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import PersonIcon from '@mui/icons-material/Person'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { UPDATE_ORDER_RESET } from '../../constents/orderConstent';
import Loader from '../layout/Loader/Loader'


const UpdateUser = () => {

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, loading, error } = useSelector(state => state.userDetails);
  const { isUpdated, loading: updateLoading, error: updateError } = useSelector(state => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");


  const userId = params.id

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error) {
      alert.error(error)
      dispatch(clearError)
    }
    if (updateError) {
      alert.error(updateError)
      dispatch(clearError)
    }

    if (isUpdated) {
      alert.success("User Updated Successfully");
      navigate("/admin/users");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

  }, [dispatch, alert, error, navigate, isUpdated, updateError, user, userId]);

  return (
    <Fragment>
      <MetaData title="Update User" />

      <div className="dashboard">
        <Sidebar />

        <div className="updateUserContainer">
          {loading ? <Loader />
            : <form
              className="updateUserForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="updateUserBtn"
                type="submit"
                disabled={updateLoading ? true : false || role === "" ? true : false}
              >
                Update
              </Button>
            </form>}
        </div>
      </div>
    </Fragment>
  )
}

export default UpdateUser