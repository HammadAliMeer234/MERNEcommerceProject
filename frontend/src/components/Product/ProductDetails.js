import React, { Fragment, useEffect, useState } from 'react';
import "./productDetails.css"
import { useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, getProductDetails, newReview } from "../../actions/productAction";
import { addItemsToCart } from "../../actions/cartAction";
import ReviewCard from './ReviewCard.js';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Rating,
    Button
} from '@mui/material'
import { NEW_REVIEW_RESET } from '../../constents/productConstent';



const ProductDetails = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, error, loading } = useSelector(state => state.productDetails);
    const { success, error: reviewError } = useSelector(state => state.newReview);

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }

    const increaseCuantity = () => {
        if (quantity >= product.stock) return;
        const qty = quantity + 1;
        setQuantity(qty)
    }
    const decreaseCuantity = () => {
        if (quantity <= 1) return;
        const qty = quantity - 1;
        setQuantity(qty)
    }

    const cartItemhandler = () => {
        dispatch(addItemsToCart(params.id, quantity))
        alert.success("Item Added To Cart")
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData()

        myForm.set('rating', rating)
        myForm.set('comment', comment)
        myForm.set('productId', product._id)

        dispatch(newReview(myForm))

        setOpen(false)
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError())
        }
        if (reviewError) {
            alert.error(reviewError)
            dispatch(clearError())
        }
        if (success) {
            alert.success("Review Submited Successfully")
            dispatch({ type: NEW_REVIEW_RESET })
        }
        dispatch(getProductDetails(params.id))
    }, [dispatch, params.id, error, alert, reviewError, success])

    const options = {
        size: 'large',
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    }

    return (
        <Fragment>
            {loading ? (<Loader />) :
                (<Fragment>

                    <MetaData title={`${product.name} -- ECOMMERCE`} />

                    <div className="productDetails">
                        <div className='productDetails_1'>
                            <Carousel>
                                {product.images &&
                                    product.images.map((item, i) => <img className='carousalImage' src={item.url} alt={`${i} slide`} key={i} />)
                                }
                            </Carousel>
                        </div>

                        <div className='productDetails_2'>

                            <div className="detailsBlock_1">
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>

                            <div className="detailsBlock_2">

                                <Rating {...options} />
                                <span className='detailsBlock_2-span'>({product.numOfReviews} Reviews)</span>
                            </div>

                            <div className="detailsBlock_3">
                                <h1>{`$${product.price}`}</h1>
                                <div className="detailsBlock_3-1">
                                    <div className="detailsBlock_3-1-1">
                                        <button onClick={decreaseCuantity}  >-</button>
                                        <input readOnly value={quantity} type="number" />
                                        <button onClick={increaseCuantity}  >+</button>
                                    </div>
                                    <button
                                        disabled={product.stocl < 1 ? true : false}
                                        onClick={cartItemhandler}
                                    >
                                        Add To Cart
                                    </button>
                                </div>

                                <p>
                                    Status:{""}
                                    <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                        {product.stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>

                            <div className="detailsBlock_4">
                                Description: <p>{product.description}</p>
                            </div>

                            <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
                        </div>
                    </div>

                    <Dialog
                        aria-labelledby='simple-dialog-title'
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Product Review</DialogTitle>

                        <DialogContent className='submitDialog'>
                            <Rating
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                            <textarea
                                className='submitDialogTextArea'
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={submitReviewToggle} color='secondary' >Cancel</Button>
                            <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
                        </DialogActions>


                    </Dialog>

                    <h3 className="reviewsHeading">REVIEWS</h3>

                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews.map((review) => <ReviewCard review={review} key={review.user} />)}
                        </div>
                    ) : (
                        <p className='noReviews'>No Review Yet</p>
                    )}
                </Fragment>)}
        </Fragment>
    )
}

export default ProductDetails