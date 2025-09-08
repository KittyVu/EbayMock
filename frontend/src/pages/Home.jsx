import "./Home.css"
import Products from './Products'

export default function Home() {
  return (
    <div className="products-middle">
       <ul className='banner-category'>
            <li>Electronic</li>
            <li>Jewelery</li>
            <li>Men's Clothing</li>
            <li>Women's Clothing</li>
       </ul>
       <div>
        <img className="banner" src="../ebay-banner.png" alt="banner" />
        <h1 className="products-title">Top sale products</h1>
       </div>
       <Products />
    </div>
  )
}
