import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  
  console.log('HTTP Interceptor - Request URL:', req.url);
  console.log('HTTP Interceptor - Token:', token ? 'Present' : 'Missing');
  
  if (token && req.url.includes('graphql')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('HTTP Interceptor - Added Authorization header');
    return next(clonedRequest);
  }
  
  return next(req);
};

