import React from 'react'
import Halmet from 'react-helmet'

const MetaData = ({title}) => {
  return (
    <Halmet>
        <title>{title}</title>
    </Halmet>
  )
}

export default MetaData