import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useSelector(state => state.user)

    return (
        <Fragment>
            {!loading &&
                <Fragment>
                    {isAuthenticated === false ? <Navigate to="/login" /> : isAuthenticated && <Outlet />}
                </Fragment>
            }
        </Fragment>
    )

}

export default ProtectedRoute