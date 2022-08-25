import React, { Fragment  , useState} from 'react'
import { useNavigate } from "react-router-dom";
import MetaData from '../layout/MetaData';

import './search.css'

const Search = () => {
    const navigate = useNavigate()
     const [keyword, setKeyword] = useState()

    const onSubmitHandler = (e)=>{
        e.preventDefault()
        if (keyword) {
            navigate(`/products/${keyword.trim()}`)            
        }else{
            navigate('/products')
        }
    }
    return (
        <Fragment>
            <MetaData title="Search A Product -- ECOMMERCE" />
            <form className='searchBox' onSubmit={onSubmitHandler}>
                <input type="text" placeholder='Search a Product...' onChange={(e) => setKeyword(e.target.value)} />
                <input type="submit" value="Submit" />
            </form>
        </Fragment>
    )
}

export default Search