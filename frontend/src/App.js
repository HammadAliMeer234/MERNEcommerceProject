import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from 'webfontloader';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './components/Home/Home';
import ProductDetails from './components/Product/ProductDetails'
import Products from './components/Product/Products';
import Search from './components/Product/Search';
import LoginSignUp from './components/User/LoginSignUp';
import Profile from './components/User/Profile.js';
import ProtectedRoute from './components/Route/ProtectedRoute';
import AdminProtectedRoute from './components/Route/AdminProtectedRoute';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from './components/Cart/Payment';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrderList from './components/Admin/OrderList';
import ProcessOrder from './components/Admin/ProcessOrder';
import UsersList from './components/Admin/UsersList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReviews from './components/Admin/ProductReviews';
import Contact from './components/layout/Contact/Contact'
import About from './components/layout/About/About'
import NotFound from './components/layout/NotFount/NotFound'

import store from './store'
import { loadUser } from './actions/userAction';
import UserOptions from './components/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'


function App() {

  const { user, isAuthenticated } = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = useState()

  const getStripeApiKey = async () => {
    const { data } = await axios.get('/api/v1//stripeapikey')
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {

    WebFont.load({
      google: {
        families: ["Roboto", "Driod Sans", "Chilanks"]
      }
    })
    store.dispatch(loadUser())

    getStripeApiKey()
  }, [])

  // window.addEventListener('contextmenu', (e) => e.preventDefault())


  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        {/* Home Route */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />

        {/* Product Routes */}
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/products/:keyword" element={<Products />} />

        <Route exact path="/search" element={<Search />} />

        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path='/password/forgot' element={<ForgotPassword />} />
        <Route exact path='/password/reset/:token' element={<ResetPassword />} />

        {/* Ptotected routes Only Authenticated user can access */}
        <Route exact path='/' element={<ProtectedRoute />}>

          {/* User Routes */}
          <Route exact path='/account' element={<Profile />} />
          <Route exact path='/me/update' element={<UpdateProfile />} />
          <Route exact path='/password/update' element={<UpdatePassword />} />

          {/* 4 Order Routes  */}
          <Route exact path='/shipping' element={<Shipping />} />
          <Route exact path='/order/confirm' element={<ConfirmOrder />} />
          <Route exact path='/process/payment' element={stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}> <Payment /> </Elements>} />
          <Route exact path='/success' element={<OrderSuccess />} />
          <Route exact path='/orders' element={<MyOrders />} />
          <Route exact path='/order/:id' element={<OrderDetails />} />

          {/* Admin Routes Only Admin can access this Routes */}
          <Route exact path='/admin' element={<AdminProtectedRoute />}>

            {/* Admin product Routes for Get, Create, Update and Delete Product */}
            <Route exact path='/admin/dashboard' element={<Dashboard />} />
            <Route exact path='/admin/products' element={<ProductList />} />
            <Route exact path='/admin/product' element={<NewProduct />} />
            <Route exact path='/admin/product/:id' element={<UpdateProduct />} />

            {/* Admin Order Routes for Get All Orders , Update and Delete Orders*/}
            <Route exact path='/admin/order/:id' element={<ProcessOrder />} />
            <Route exact path='/admin/orders' element={<OrderList />} />

            {/* Admin Users Routes for Get All Orders , Update and Delete Orders*/}
            <Route exact path='/admin/users' element={<UsersList />} />
            <Route exact path='/admin/user/:id' element={<UpdateUser />} />

            {/* Admin Reviews Routes for Get All Reviews , Update and Delete Reviews*/}
            <Route exact path='/admin/reviews' element={<ProductReviews />} />

          </Route>

        </Route>

        <Route path='/cart' element={<Cart />} />

        <Route path="*" element={<NotFound />} />


      </Routes>


      <Footer />
    </Router>
  );
}

export default App;
