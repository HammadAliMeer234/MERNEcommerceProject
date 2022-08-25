import React, { Fragment, useEffect, useState } from 'react';
import "./css/UpdateProduct.css"
import { clearError, updateProduct, getProductDetails } from '../../actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import DescriptionIcon from '@mui/icons-material/Description'
import StorageIcon from '@mui/icons-material/Storage'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { UPDATE_PRODUCT_RESET } from '../../constents/productConstent'
import Loader from '../layout/Loader/Loader';



const UpdateProduct = () => {

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { isUpdated, loading, error: updateError } = useSelector(state => state.product);
    const { product, error } = useSelector(state => state.productDetails);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones",
    ];

    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const productId = params.id;

    const updateProductSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image) => {
            myForm.append("images", image);
        });
        dispatch(updateProduct(productId, myForm));
    };


    useEffect(() => {

        if (product && product._id !== productId) {
            dispatch(getProductDetails(productId));
        } else {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.stock);
            setOldImages(product.images);
        }

        if (error) {
            alert.error(error)
            dispatch(clearError)
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearError)
        }

        if (isUpdated) {
            alert.success("Product Updated Successfully");
            navigate("/admin/products");
            dispatch({ type: UPDATE_PRODUCT_RESET });
        }

    }, [dispatch, alert, error, navigate, isUpdated, product, productId, updateError]);
    return (
        <Fragment>

            <MetaData title="Create Product" />

            <div className="dashboard">
                <Sidebar />

                <div className="updateProductContainer">
                    {loading ? <Loader />
                        : <Fragment>
                            <form
                                className="updateProductForm"
                                encType="multipart/form-data"
                                onSubmit={updateProductSubmitHandler}
                            >
                                <h1>Update Product</h1>

                                <div>
                                    <SpellcheckIcon />
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <AttachMoneyIcon />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <DescriptionIcon />

                                    <textarea
                                        placeholder="Product Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        cols="30"
                                        rows="1"
                                    ></textarea>
                                </div>

                                <div>
                                    <AccountTreeIcon />
                                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="">Choose Category</option>
                                        {categories.map((cate) => (
                                            <option key={cate} value={cate}>
                                                {cate}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <StorageIcon />
                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>

                                <div id="updateProductFormFile">
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProductImagesChange}
                                        multiple
                                    />
                                </div>

                                <div id="updateProductFormImage">
                                    {oldImages && oldImages.map((image, index) => (
                                        <img key={index} src={image.url} alt="Old Product Preview" />
                                    ))}

                                    {imagesPreview.map((image, index) => (
                                        <img key={index} src={image} alt="Product Preview" />
                                    ))}
                                </div>

                                <Button
                                    id="updateProductBtn"
                                    type="submit"
                                    disabled={loading ? true : false}
                                >
                                    Update
                                </Button>
                            </form>
                        </Fragment>
                    }
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProduct