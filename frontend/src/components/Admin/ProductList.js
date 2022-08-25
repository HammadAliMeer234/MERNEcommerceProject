import React, { Fragment, useEffect } from 'react';
import './css/ProductList.css';
import { DataGrid } from '@mui/x-data-grid';
import { getAdminProducts, clearError, deleteProduct } from '../../actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../constents/productConstent';



const ProductList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const alert = useAlert();

  const { products, error } = useSelector(state => state.products);
  const { isDeleted, error: deleteError } = useSelector(state => state.product);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id))
  }

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 200,
      flex: 0.5
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3
    },
    {
      field: "price",
      headerName: "price",
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
            <Link to={`/admin/product/${params.getValue(params.id, 'id')}`}>
              <EditIcon />
            </Link>
            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, 'id'))}
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        )
      },
    },

  ]

  const rows = []

  products &&
    products.forEach(product => {
      rows.push({
        id: product._id,
        name: product.name,
        stock: product.stock,
        price: product.price
      })
    })

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearError)
    }
    if (deleteError) {
      alert.error(deleteError)
      dispatch(clearError)
    }

    if (isDeleted) {
      alert.success('Product Deleted Successfully')
      navigate('/admin/products')
      dispatch({
        type: DELETE_PRODUCT_RESET
      })
    }

    dispatch(getAdminProducts())

  }, [dispatch, error, alert, isDeleted, deleteError , navigate])




  return (
    <Fragment>
      <MetaData title="All Products - Admin" />

      <div className="dashboard">

        <Sidebar />

        <div className="productListContainer">
          <h1 id="productListHeading"> ALL PRODUCT </h1>

          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            disableSelectionOnClick
            className='productListTable'
            autoHeight
          />
        </div>

      </div>
    </Fragment>
  )
}

export default ProductList