import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import MenuItemFormUpdate from '../MenuItemFormUpdate/MenuItemFormUpdate';
import './MenuItemCard.css';

export default function MenuItemCard({ menuItem, onDelete }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="menu-item-card-container">
      <Link to={`/menu-items/${menuItem.id}`} className="menu-item-card-link">
        <div className="menu-item-card">
          <img
            src={menuItem.image_url}
            alt={menuItem.name}
            className="menu-item-image"
          />
          <div className="menu-item-name">{menuItem.name}</div>
          <div className="menu-item-price">${menuItem.price}</div>
        </div>
      </Link>

      {sessionUser?.id === menuItem.user_id && (
        <div className="menu-item-owner-actions" onClick={(e) => e.stopPropagation()}>
          <OpenModalButton
            buttonText="Edit"
            modalComponent={<MenuItemFormUpdate menuItem={menuItem} />}
            className="menu-item-edit-btn"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(menuItem.id);
            }}
            className="menu-item-delete-btn"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
