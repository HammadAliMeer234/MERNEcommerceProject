import React from 'react'
import { Fragment } from 'react'
import profileImg from '../../images/profile.png'
import { Rating } from '@mui/material'

const ReviewCard = ({ review }) => {
  console.log(review.rating);
  const options = {
    size: 'large',
    value: review.rating,
    readOnly: true,
    precision: 0.5
  }

  return (
    <Fragment>
      <div className="reviewCard">
        <img src={profileImg} alt="User" />
        <p>{review.name}</p>
        <Rating {...options} />
        <span>{review.comment}</span>
      </div>
    </Fragment>
  )
}

export default ReviewCard