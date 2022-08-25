import React, { useEffect, Fragment } from 'react';
import './MyOrders.css'
import { useDispatch, useSelector } from 'react-redux';
import { myOrders, clearError } from '../../actions/orderAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { useAlert } from 'react-alert';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LaunchIcon from "@mui/icons-material/Launch";




const MyOrders = () => {

  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, orders, loading } = useSelector(state => state.myOrders)
  const { user } = useSelector(state => state.user)

  const columns = [
    {
      field: "id",
      headerName: "Order Id",
      minWidth: 300,
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === 'Delivered'
          ? 'greenColor'
          : 'redColor'
      }
    },
    {
      field: "itemQty",
      headerName: "Ttem Qty",
      type: 'number',
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: 'number',
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "action",
      headerName: "Amount",
      type: 'number',
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        )
      }
    },
  ]
  
  
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError)
    }
    
    dispatch(myOrders())
  }, [dispatch, alert, error])
  
  const rows = []
  
  orders &&
    orders.forEach((order) => {
      rows.push({
        id: order._id,
        status: order.orderStatus,
        itemQty: order.orderItems.length,
        amount: order.totalPrice
      })
    });

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />

      {loading ? <Loader /> :
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            className="myOrdersTable"
            pageSize={10}
            autoHeight
          />

          <Typography id="myOrdersHeading" >{user.name}'s Orders </Typography>
        </div>
      }


    </Fragment>
  )
}

export default MyOrders