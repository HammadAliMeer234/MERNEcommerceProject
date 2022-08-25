import React, { useEffect, Fragment } from 'react';
import './OrderDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, getOrderDetails } from '../../actions/orderAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { useAlert } from 'react-alert';
import { Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

const OrderDetails = () => {

  const alert = useAlert();
  const params = useParams();
  const dispatch = useDispatch();

  const { error, order, loading } = useSelector(state => state.orderDetails);

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError)
    }

    dispatch(getOrderDetails(params.id))
  }, [dispatch, alert, error, params.id])
  return (
    <Fragment>
      <MetaData title="Order Details" />
      {loading ? <Loader /> :
        <div className="orderDetailsPage">
          <div className="orderDetailsContainer">

            <Typography component='h1'> Order #{order && order._id} </Typography>

            <Typography> Shipping info </Typography>
            <div className="orderDetailsContainerBox">
              <div>
                <p>Name:</p>
                <span>{order.user && order.user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{order.shippingInfo &&
                  `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} , ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`
                }</span>
              </div>
            </div>

            <Typography> Payment Info </Typography>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                  className={order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                    ? 'greenColor'
                    : "redColor"
                  }
                >
                  {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                    ? 'PAID'
                    : "NOT PAID"
                  }
                </p>
              </div>
              <div>
                <p>Amount:</p>
                <span> {order.shippingInfo && order.shippingInfo.totolPrice} </span>
              </div>
            </div>

            <Typography> Order Status </Typography>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                  className={order.orderStatus &&
                    order.shippingInfo.status === "Delivered"
                    ? 'greenColor'
                    : "redColor"
                  }
                >
                  {order.orderStatus && order.orderStatus}
                </p>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Order Items</Typography>
              <div className="orderDetailsCartItemsContainer">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>{item.name} </Link>
                      <span>
                        {item.quantity} X {item.price} =
                        <b>{item.quantity * item.price}</b>
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

          </div>

        </div>
      }
    </Fragment>
  )
}

export default OrderDetails