import { createContext, useContext, useMemo, PropsWithChildren, JSX } from 'react';
import auth0 from 'auth0-js';
import type { Auth0ClientValue, Auth0Config } from './auth.types';

const Auth0Context = createContext<Auth0ClientValue | null>(null);

export const useAuth0Client = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0 must be used within an Auth0Provider');
  }
  return context;
};

interface Auth0ProviderProps {
  config: Auth0Config;
}

export const Auth0Provider = ({ 
  config, 
  children 
}: PropsWithChildren<Auth0ProviderProps>): JSX.Element => {
  const auth0Client = useMemo(() => {
    return new auth0.WebAuth(config);
  }, [config]);

  const value = useMemo(() => ({
    auth0Client,
    config,
    isInitialized: true
  }), [auth0Client, config]);

  return (
    <Auth0Context.Provider value={value}>
      {children}
    </Auth0Context.Provider>
  );
};