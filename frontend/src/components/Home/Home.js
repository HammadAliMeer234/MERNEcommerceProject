import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/all'
import "./Home.css"
import ProductCard from './ProductCard.js'
import MeraData from '../layout/MetaData.js'
import Loader from '../layout/Loader/Loader'
import { clearError, getProducts } from "../../actions/productAction"
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'


const Home = () => {
  const alert = useAlert()
  const dispatch = useDispatch()
  const { products, error, loading } = useSelector(state => state.products)

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError)
    }
    dispatch(getProducts())
  }, [dispatch, error, alert])


  return (
    <Fragment>
      { loading ? <Loader /> :
          <Fragment>
            <MeraData title="ECOMMERCE" />
            <div className="banner">

              <p>Welcome to Ecommerce</p>
              <h1>FIND AMAZING PRODUCT BELOW</h1>

              <a href="#container">
                <button>
                  Scroll <CgMouse />
                </button>
              </a>
            </div>

            <h2 className="homeHeading">Future Products</h2>

            <div className="container" id="container">
              {products && products.map((product) => <ProductCard product={product} key={product._id}/>)}
            </div>

          </Fragment>
      }
    </Fragment>

  )
}

export default Home