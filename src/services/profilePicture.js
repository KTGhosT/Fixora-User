import { axiosFileInstance } from './api';

export async function uploadProfilePictureApi(file) {
  const formData = new FormData();
  formData.append('profile_picture', file);
  
  try {
    const response = await axiosFileInstance.post('/api/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Profile picture upload error:', error);
    throw error;
  }
}

export async function deleteProfilePictureApi() {
  try {
    const response = await axiosFileInstance.delete('/api/profile/picture');
    return response.data;
  } catch (error) {
    console.error('Profile picture delete error:', error);
    throw error;
  }
}


export function getProfilePictureUrl(user, forceRefresh = false) {
  // Check for various possible field names for profile picture
  const possibleFields = ['profile_picture', 'avatar', 'image', 'photo', 'picture', 'profile_image', 'user_image'];
  let profilePictureField = null;
  
  for (const field of possibleFields) {
    if (user?.[field]) {
      profilePictureField = user[field];
      break;
    }
  }
  
  if (profilePictureField) {
    // If profile_picture is a full URL, return it
    if (profilePictureField.startsWith('http')) {
      return forceRefresh ? `${profilePictureField}?t=${Date.now()}` : profilePictureField;
    }
    
    // If it's a relative path, prepend the base URL
    const baseUrl = `http://127.0.0.1:8000/storage/${profilePictureField}`;
    return forceRefresh ? `${baseUrl}?t=${Date.now()}` : baseUrl;
  }
  
  // Return default placeholder
  return 'https://via.placeholder.com/150/6366f1/ffffff?text=' + (user?.first_name?.[0] || 'U');
}
