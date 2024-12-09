import { useState, useEffect, useCallback } from 'react';
import { useAuth0Client } from './authContext';
import { AuthState, LoginCredentials, SignupCredentials, Auth0User, Auth0DecodedHash } from './auth.types';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null
};

export const useAuth0 = () => {
  const { auth0Client, config } = useAuth0Client();
  const [state, setState] = useState<AuthState>(initialState);

  const handleAuthResult = useCallback(async (authResult: Auth0DecodedHash) => {
    try {
      if (authResult && authResult.accessToken) {
        const expiresAt = JSON.stringify(
          (authResult.expiresIn || 0) * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken || '');
        localStorage.setItem('expires_at', expiresAt);

        const user = await new Promise<Auth0User>((resolve, reject) => {
          auth0Client.client.userInfo(authResult.accessToken!, (err, user) => {
            if (err) reject(err);
            resolve(user);
          });
        });

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error
      }));
    }
  }, [auth0Client]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      auth0Client.login({
        realm: 'Username-Password-Authentication',
        email: credentials.email,
        password: credentials.password
      }, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error
      }));
    }
  }, [auth0Client]);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      auth0Client.signup({
        connection: 'Username-Password-Authentication',
        email: credentials.email,
        password: credentials.password,
        username: credentials.name
      }, (err) => {
        if (err) throw err;
        login(credentials);
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error
      }));
    }
  }, [auth0Client, login]);

  const logout = useCallback(async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    auth0Client.logout({
      returnTo: window.location.origin,
      clientID: config.clientID
    });

    setState({
      ...initialState,
      isLoading: false
    });
  }, [auth0Client, config.clientID]);

  const checkSession = useCallback(async () => {
    return new Promise((resolve, reject) => {
      auth0Client.checkSession({}, (err, authResult) => {
        if (err) reject(err);
        if (authResult) {
          handleAuthResult(authResult);
          resolve(authResult);
        }
      });
    });
  }, [auth0Client, handleAuthResult]);


  const getAccessToken = useCallback((): string | null => {
    const accessToken = localStorage.getItem('access_token');  
    const expiresAt = localStorage.getItem('expires_at');
    if (expiresAt && accessToken) {
      const isValid = new Date().getTime() < JSON.parse(expiresAt);
      return isValid ? accessToken : null;
    }
    return null;
  }, []);


  useEffect(() => {
    let isSubscribed = true;
  
    const handleError = (error: any) => {
      if (isSubscribed) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error(error?.errorDescription || error?.error || 'Authentication failed'),
          isAuthenticated: false
        }));
      }
    };
  
    const initializeAuth = async () => {
      try {
        if (window.location.hash) {
          auth0Client.parseHash((err, authResult) => {
            if (err) {
              handleError(err);
              // Optionally redirect to login on error
              window.location.href = '/'; // Or your login path
              return;
            }
            if (authResult) {
              handleAuthResult(authResult).catch(handleError);
            }
          });
        } else {
          checkSession().catch((error) => {
            // Don't show session check errors to user unless it's a specific error
            // that needs user attention
            if (error?.error !== 'login_required') {
              handleError(error);
            }
            setState(prev => ({
              ...prev,
              isLoading: false,
              isAuthenticated: false
            }));
          });
        }
      } catch (error) {
        handleError(error);
      }
    };
  
    initializeAuth();
  
    return () => {
      isSubscribed = false;
    };
  }, [auth0Client, checkSession, handleAuthResult]);
  return {
    ...state,
    login,
    signup,
    logout,
    checkSession,
    getAccessToken
  };
};