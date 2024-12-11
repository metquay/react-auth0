import React, { createContext, JSX, useContext } from 'react';
import auth0 from 'auth0-js';
import { Auth0ClientValue, Auth0Config } from './auth.types';

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
  children: React.ReactNode;
}

// Using React.ComponentType instead of FC
export const Auth0Provider = (props: Auth0ProviderProps): JSX.Element => {
  const { config, children } = props;
  
  const auth0Client = React.useMemo(() => {
    return new auth0.WebAuth(config);
  }, [config]);

  const value = React.useMemo(() => ({
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