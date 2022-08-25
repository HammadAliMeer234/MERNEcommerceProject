import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = () => {
    const { user, loading } = useSelector(state => state.user)

    return (
        <Fragment>
            {!loading &&
                <Fragment>
                    {user.role !== 'admin' ? <Navigate to="/login" /> : <Outlet />}
                </Fragment>
            }
        </Fragment>
    )

}

export default ProtectedRoute