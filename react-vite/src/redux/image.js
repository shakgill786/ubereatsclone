// redux/image.js

export const createImageFileAndUrl = (imageFile) => async () => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    return await res.json();
  } else {
    const data = await res.json();
    return { errors: data.errors || ["Image upload failed."] };
  }
};

export const deleteImageFileMenuItem = (menuItemId) => async () => {
  const res = await fetch(`/api/images/menu-item/${menuItemId}/delete`, {
    method: "DELETE",
  });

  if (res.ok) {
    return await res.json();
  } else {
    const data = await res.json();
    return { errors: data.errors || ["Failed to delete image."] };
  }
};
