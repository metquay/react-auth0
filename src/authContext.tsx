import { createContext, useContext, useMemo, type ReactNode } from 'react';
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
  children: ReactNode;
}

// Simplified component definition
export function Auth0Provider(props: Auth0ProviderProps) {
  const auth0Client = useMemo(() => {
    return new auth0.WebAuth(props.config);
  }, [props.config]);

  const value = useMemo(() => ({
    auth0Client,
    config: props.config,
    isInitialized: true
  }), [auth0Client, props.config]);

  return (
    <Auth0Context.Provider value={value}>
      {props.children}
    </Auth0Context.Provider>
  );
}