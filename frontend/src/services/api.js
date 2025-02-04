const handleTokenExpiration = async (error) => {
  if (error.response?.status === 401) {
    try {
      //refresh token endpoint
      await axios.post('/api/auth/refresh');
      
      //retry original request
      return true;
    } catch (refreshError) {
      //redirect to login if refresh fails
      window.location.href = '/login';
      return false;
    }
  }
  return false;
};

//axios interceptor to handle expired tokens
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const canRetry = await handleTokenExpiration(error);
    if (canRetry) {
      //retry the original request
      return axios(error.config);
    }
    return Promise.reject(error);
  }
); 