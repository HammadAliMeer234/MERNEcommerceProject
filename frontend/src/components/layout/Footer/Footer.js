import "./footer.css"
import React from 'react'
import playstore from '../../../images/playstore.png'
import appstore from '../../../images/appstore.png'
const Footer = () => {
  return (
    <div className='footer'>

        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Downlaod App for Android and IOS mobile phone</p>
            <img src= {playstore} alt="playstore" />
            <img src= {appstore} alt="appstore" />
        </div>

        <div className="midFooter">
            <h1>ECOMMERCE</h1>
            <p>High quality is out dirst peiority</p>
            <p>Copyright 2022 &copy; MeHammadAli</p>
        </div>

        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/hammadalimeer2004/" rel="noreferrer" target="_blank">Instagram</a>
            <a href="https://twitter.com/HammadAliMeer" rel="noreferrer" target="_blank">Twitter</a>
            <a href="https://www.facebook.com/profile.php?id=100076016401154/" rel="noreferrer" target="_blank">Facebook</a>
        </div>
    </div>
  )
}

export default Footer