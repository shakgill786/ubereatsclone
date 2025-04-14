import { Link } from 'react-router-dom';
import LoginFormRedirectToOrdersModal from '../LoginFormRedirectToOrdersModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';
import { useSelector } from 'react-redux';
import './Footer.css';

export default function Footer() {

  const sessionUser = useSelector(state => state.session.user)

  return (
    <>
      <div id="footer">
        {/* <h1>footer</h1> */}
        <div id='footer-col-1'>
          <Link exact to="/">
            <div id='footer-logo-text'>
              Luxury<span id='logo-eats-text'>Eats</span>
            </div>
          </Link>
        </div>
        <div className='footer-right'>
          <div id='footer-col'>
            <div className='footer-right-header'>Features</div>
            <div className='footer-list'>
              <Link exact to="/restaurants">
                <div>Restaurants</div>
              </Link>
              <Link exact to="/restaurants/1/menu">
                <div>Menu Items</div>
              </Link>
              <Link exact to="/restaurants/1/menu">
                <div>Reviews</div>
              </Link>
              {sessionUser ?
                <Link exact to="/past-orders">
                  <div>Orders</div>
                </Link>
                :
                <div id='footerModal'>
                  <OpenModalButton
                    buttonText='Orders'
                    modalComponent={<LoginFormRedirectToOrdersModal />}
                  />
                </div>
              }
              {!sessionUser && (<div id='footerModal'><OpenModalButton
                buttonText='Create an Account'
                modalComponent={<SignupFormModal />} />
              </div>)}
            </div>
          </div>
          <div id='footer-col'>
            <div className='footer-right-header'>Contact Us</div>
            <div className='footer-list'>
                  <div>Shakeel Gillani</div>
                <div className='footer-links'>
                  <a href="www.linkedin.com/in/shakeel-gillani-4a11515b" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
                  <div>Wyldeliz Santos</div>
                <div className='footer-links'>
                  <a href="https://www.linkedin.com/in/wyldeliz/" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
                  <div>Raihan Hasan</div>
                <div className='footer-links'>
                  <a href="" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
              <div className='footer-name'>
                <div>Chris Park</div>
                <div className='footer-links'>
                  <a href="https://www.linkedin.com/in/chris-p-554226153/" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-linkedin"></i>
                  </a>
                </div>
              </div>
              </div>
      <div id='footer-copyright'>
        @ 2025 Luxury Eats
      </div>
    </>
  )
};
