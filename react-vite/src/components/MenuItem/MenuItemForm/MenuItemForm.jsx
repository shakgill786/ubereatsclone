import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useModal } from "../../../context/Modal";
import { createImageFileAndUrl, deleteImageFileMenuItem } from "../../../redux/image";
import { createMenuItemForRestThunk } from "../../../redux/menuItems";
import { updateMenuItemThunk } from "../../../redux/menuItems";
import './MenuItemForm.css';

export default function MenuItemForm({ formType, menuItem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const restaurantId = menuItem?.restaurantId;

  const [name, setName] = useState(menuItem?.name || "");
  const [type, setType] = useState(menuItem?.type || "");
  const [price, setPrice] = useState(menuItem?.price || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(menuItem?.imageUrl || "");
  const [imageFileUpdated, setImageFileUpdated] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [triggerRerenderToggle, setTriggerRerenderToggle] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /////// 1. CREATE IMAGE + CREATE MENU ITEM
    if (formType === 'Create Menu Item') {
      try { // CREATE IMAGE
        const resCreateImg = await dispatch(createImageFileAndUrl(imageFile));
        { resCreateImg.errors ? setErrors(resCreateImg.errors) : setErrors({}); }

        if (resCreateImg.url) {
          menuItem = {
            ...menuItem,
            name,
            type,
            price,
            description,
            image_url: resCreateImg.url,
            restaurantId
          };
        }
      } catch (resCreateImg) {
        return resCreateImg;
      }

      try {
        const res = await dispatch(createMenuItemForRestThunk(menuItem));
        if (res.id) {
          setErrors({});
          navigate(`/restaurants/${restaurantId}/menu/manage`);
          closeModal();
        } else if (res.errors) {
          setErrors(res.errors);
        }
      } catch (err) {
        console.error("Menu item creation error:", err);
        setErrors({ server: "Failed to create menu item." });
      }
      
      /////// 2. UPDATE IMAGE + UPDATE MENU ITEM
    } else if (formType === 'Update Menu Item' && imageFileUpdated) {
      try { // UPDATE IMAGE
        const resDeleteImg = await dispatch(deleteImageFileMenuItem(menuItem.id));
        { resDeleteImg.errors ? setErrors(resDeleteImg.errors) : setErrors({}); }
        if (resDeleteImg.message) {
          const resCreateImg = await dispatch(createImageFileAndUrl(imageFile));
          { resCreateImg.errors ? setErrors(resCreateImg.errors) : setErrors({}); }

          if (resCreateImg.url) {
            menuItem = {
              ...menuItem,
              name,
              type,
              price,
              description,
              image_url: resCreateImg.url,
              restaurantId
            };
          }
        } else if (resDeleteImg.errors) {
          setErrors(resDeleteImg.errors);
        }
      } catch (resDeleteImg) {
        return resDeleteImg;
      }

      try {
        const res = await dispatch(updateMenuItemThunk(menuItem));
        if (res.id) {
          setErrors({});
          navigate(`/restaurants/${restaurantId}/menu/manage`);
          closeModal();
        } else {
          return res;
        }
      } catch (res) {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }

      /////// 3. UPDATE MENU ITEM *ONLY*
    } else if (formType === 'Update Menu Item' && !imageFileUpdated) {
      menuItem = {
        ...menuItem,
        name,
        type,
        price,
        description,
        image_url
      };

      try {
        const res = await dispatch(updateMenuItemThunk(menuItem));
        if (res.id) {
          setErrors({});
          navigate(`/restaurants/${restaurantId}/menu/manage`);
          closeModal();
        } else {
          return res;
        }
      } catch (res) {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, [dispatch]);

  // ✅ no code changes needed except:
useEffect(() => {
  if (name.length > 25) {
    setErrors((prev) => ({ ...prev, name: "Maximum 25 characters" }));
  } else {
    setErrors((prev) => ({ ...prev, name: "" }));
  }
  setTriggerRerenderToggle(!triggerRerenderToggle);
}, [name, errors, triggerRerenderToggle]);

useEffect(() => {
  if (description.length > 200) {
    setErrors((prev) => ({ ...prev, description: "Maximum 200 characters" }));
  } else {
    setErrors((prev) => ({ ...prev, description: "" }));
  }
  setTriggerRerenderToggle(!triggerRerenderToggle);
}, [description, errors, triggerRerenderToggle]);


  return (
    <>
      {isLoaded && (
        <form onSubmit={handleSubmit}>

          <div className='create-menu-item-form-section'>
            <div className='menu-item-form-top-header'>
              {formType === 'Create Menu Item' ? 'Add Menu Item' : 'Update Menu Item'}
            </div>
          </div>

          <div className='create-menu-item-form-section'>
            <div>
              <input
                size="57"
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder='Name'
                required
              />
            </div>
            {errors.name && (<div className="menu-item-error-text">{errors.name}</div>)}
          </div>

          <div>
            <select
              onChange={(e) => setType(e.target.value)}
              value={type}
              required
            >
              <option value="" disabled>Type</option>
              <option key='appetizer' value='appetizer'>Appetizer</option>
              <option key='entree' value='entree'>Entree</option>
              <option key='dessert' value='dessert'>Dessert</option>
              <option key='beverage' value='beverage'>Beverage</option>
            </select>
          </div>
          {errors.type && (<div className="menu-item-error-text">{errors.type}</div>)}

          <div>
            <input
              size="57"
              type="number"
              step="0.01"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              placeholder='Price'
              required
            />
          </div>
          {errors.price && (<div className="menu-item-error-text">{errors.price}</div>)}

          <div>
            <textarea
              rows="8" cols="56"
              id='comments'
              name='description'
              onChange={e => setDescription(e.target.value)}
              value={description}
              placeholder='Description (optional)'
            />
          </div>
          {errors.description && (<div className="menu-item-error-text">{errors.description}</div>)}

          {formType === 'Create Menu Item' ?
            <>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  name="imageUrl"
                  onChange={(e) => {
                    setImageFile(e.target.files[0])
                  }}
                  required
                />
              </div>
              {errors.imageUrl && (<div className="menu-item-error-text">{errors.imageUrl}</div>)}
            </>
            :
            <>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  name="imageUrl"
                  onChange={(e) => {
                    setImageFile(e.target.files[0])
                    setImageFileUpdated(true)
                  }}
                />
              </div>
              {errors.imageUrl && (<div className="menu-item-error-text">{errors.imageUrl}</div>)}
            </>
          }

          <button
            className={disabled ? "create-menu-item-form-button-disabled" : "create-menu-item-form-button"}
            disabled={disabled}
          >
            {formType === 'Create Menu Item' ? 'Add' : 'Update'}
          </button>

        </form>
      )}
    </>
  )
}
