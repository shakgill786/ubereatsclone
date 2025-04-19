import { Link } from 'react-router-dom';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../OpenModalButton';
import { useSelector } from 'react-redux';
import './Footer.css';

export default function Footer() {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id="footer">
      <div id="footer-col-1">
        <Link to="/">
          <div id="footer-logo-text">ForkYeah</div>
        </Link>
      </div>

      <div className="footer-right">
        <div id="footer-col">
          <div className="footer-right-header">Features</div>
          <div className="footer-list">
            <Link to="/restaurants"><div>Restaurants</div></Link>
            <Link to="/restaurants/1/menu"><div>Menu Items</div></Link>
            <Link to="/restaurants/1/menu"><div>Reviews</div></Link>
            {!sessionUser && (
              <div id="footerModal">
                <OpenModalButton
                  buttonText="Create an Account"
                  modalComponent={<SignupFormModal />}
            />
          </div>
          )}
            {!sessionUser && (
              <div id="footerModal">
                <OpenModalButton
                  buttonText="Create an Account"
                  modalComponent={<SignupFormModal />}
                />
              </div>
            )}
          </div>
        </div>

        <div id="footer-col">
          <div className="footer-right-header">Contact Us</div>
          <div className="footer-list">
            <div className="footer-name">
              <div>Shakeel Gillani</div>
              <div className="footer-links">
                <a href="https://www.linkedin.com/in/shakeel-gillani-4a11515b" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="footer-name">
              <div>Wyldeliz Santos</div>
              <div className="footer-links">
                <a href="https://www.linkedin.com/in/wyldeliz/" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="footer-name">
              <div>Raihan Hasan</div>
              <div className="footer-links">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="footer-name">
              <div>Chris Park</div>
              <div className="footer-links">
                <a href="https://www.linkedin.com/in/chris-p-554226153/" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="footer-copyright">
        © 2025 ForkYeah Everywhere
      </div>
    </div>
  );
}
