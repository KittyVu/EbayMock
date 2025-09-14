import "./Footer.css"
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
        <ul className="footer-menu">
            <li><NavLink className="footer-no-underline">Purchase</NavLink></li>
            <li><NavLink className="footer-no-underline">Sell</NavLink></li>
            <li><NavLink className="footer-no-underline">Community</NavLink></li>
            <li><NavLink className="footer-no-underline">About us</NavLink></li>
            <li><NavLink className="footer-no-underline">Help</NavLink></li>
        </ul>
    </footer>
  )
}
