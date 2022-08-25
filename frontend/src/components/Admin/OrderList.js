import React, { Fragment, useEffect } from 'react';
import './css/OrderList.css';
import { DataGrid } from '@mui/x-data-grid';
import { clearError, getAllOrders, deleteOrder } from '../../actions/orderAction';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from './Sidebar';
import { DELETE_ORDER_RESET } from '../../constents/orderConstent';



const ProductList = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { orders, error } = useSelector(state => state.myOrders);
  const { isDeleted, error: deleteError } = useSelector(state => state.order);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id))
  }

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 200,
      flex: 0.5
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 350,
      flex: 1
    },
    {
      field: "itemQty",
      headerName: "Item Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5
    },
    {
      field: "action",
      headerName: "Action",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      sirtable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/order/${params.getValue(params.id, 'id')}`}>
              <EditIcon />
            </Link>
            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, 'id'))}
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        )
      },
    },

  ]

  const rows = []

  orders && orders.forEach((order) => {
    rows.push({
      id: order._id,
      status: order.orderStatus,
      itemQty: order.orderItems.length,
      amount: order.totalPrice
    })
  });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError);
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearError);
    }

    if (isDeleted) {
      alert.success('Order Deleted Successfully');
      navigate('/admin/orders');
       dispatch({
        type: DELETE_ORDER_RESET
      });
    }

    dispatch(getAllOrders());

  }, [dispatch, error, alert, isDeleted, deleteError , navigate])




  return (
    <Fragment>
      <MetaData title="All Products - Admin" />

      <div className="dashboard">

        <Sidebar />

        <div className="orderListContainer">
          <h1 id="orderListHeading"> ALL ORDERS </h1>

          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            disableSelectionOnClick
            className='orderListTable'
            autoHeight
          />
        </div>

      </div>
    </Fragment>
  )
}

export default ProductList