import React, { Fragment, useState } from 'react'
import './Header.css'
import { SpeedDial, SpeedDialAction, Backdrop } from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  ListAlt as ListAltIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../../actions/userAction'


const UserOptions = ({ user }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const alert = useAlert()

  const { cartItems } = useSelector(state => state.cart)

  const [open, setOpen] = useState(false)

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { 
      icon: <ShoppingCartIcon style={{color:cartItems.length > 0 ? "tomato" : "unset"}} />, 
      name: `Cart(${cartItems.length})`, 
      func: cart,
     },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser }
  ]

  if (user.role === "admin") {
    options.unshift({ icon: <DashboardIcon />, name: "Dashboard", func: dashboard })
  }

  function dashboard() {
    navigate('/admin/dashboard')
  }

  function orders() {
    navigate('/orders')
  }
  function account() {
    navigate('/account')
  }
  function cart() {
    navigate('/cart')
  }

  function logoutUser() {
    dispatch(logout())
    alert.success("Logout Successfully")

  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel='SpeedDail tooltip example'
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
        style={{ zIndex: "11" }}
        direction="down"
        className='speedDail'
        icon={<img
          className='speedDailIcon'
          src={user.avatar.url ? user.avatar.url : '/profile.png'}
          alt="Profile" />}
      >
        {options.map((option, i) =>
          <SpeedDialAction
            icon={option.icon}
            tooltipTitle={option.name}
            onClick={option.func}
            key={i}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        )}

      </SpeedDial>
    </Fragment >
  )
}

export default UserOptions