import React, { useEffect, useState } from 'react'
import "./Products.css"
import { useSelector, useDispatch } from 'react-redux';
import { clearError, getProducts } from "../../actions/productAction";
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard';
import { Fragment } from 'react';
import { useAlert } from 'react-alert'
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { Slider, Typography } from '@mui/material';
import MetaData from '../layout/MetaData';

const categories = [
    "machine",
    'Laptop',
    'Footwear',
    'Top',
    'Bottom',
    'SmartPhone',
    "Camera"

]
const Products = () => {
    const { keyword } = useParams()
    const dispatch = useDispatch()
    const alert = useAlert()
    const { products, loading, error, productsCount, resultPerPage, fiteredProductsCount } = useSelector((state) => state.products)

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 25000])
    const [ratings, setRatings] = useState(0)
    const [category, setCategory] = useState("")


    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice)
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError)
        }
        dispatch(getProducts(keyword, currentPage, price, category, ratings))
    }, [dispatch, error, alert, keyword, currentPage, price, category, ratings])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title='PRODUCTS -- ECOMMERCE' />
                    <h2 className="productsHeading">Products</h2>

                    <div className="products">
                        {products &&
                            products.map((product) => <ProductCard key={product._id} product={product} />)
                        }
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChangeCommitted={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby='range-slider'
                            min={0}
                            max={25000}
                        />
                        <Typography>Category</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) =>
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            )}
                        </ul>
                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => { setRatings(newRating) }}
                                aria-labelledby="continuous-slider"
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                            />
                        </fieldset>
                    </div>


                    {resultPerPage < fiteredProductsCount &&
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass='pageItemActive'
                                activeLinkClass='pageLinkAtive'
                            />
                        </div>
                    }

                </Fragment>
            }
        </Fragment>
    )
}

export default Products