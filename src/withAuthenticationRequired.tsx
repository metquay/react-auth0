import React from 'react';
import { useAuth0 } from './useAuth0';

interface AuthenticationConfig {
  loginRedirectPath: string;
  returnTo?: boolean;
  loadingComponent?: React.ComponentType;
  onRedirecting?: () => void;
}

export function withAuthenticationRequired<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: AuthenticationConfig | string
): React.ComponentType<P> {
  const {
    loginRedirectPath,
    returnTo = true,
    loadingComponent: LoadingComponent,
    onRedirecting
  } = typeof config === 'string' ? { loginRedirectPath: config } : config;

  return function WithAuthenticationRequired(props: P) {
    const { isAuthenticated, isLoading, error } = useAuth0();
   
    React.useEffect(() => {
      if (!isLoading && !isAuthenticated && !error) {
        if (onRedirecting) {
          onRedirecting();
        }

        const currentUrl = window.location.pathname + window.location.search + window.location.hash;
        
        if (returnTo) {
          const returnPath = encodeURIComponent(currentUrl);
          const redirectUrl = `${loginRedirectPath}?returnTo=${returnPath}`;
          window.location.href = redirectUrl;
        } else {
          window.location.href = loginRedirectPath;
        }
      }
    }, [isAuthenticated, isLoading, error]);

    if (error) {
      return (
        <div className="auth-error">
          <h3>Authentication Error</h3>
          <p>{error.message}</p>
          <button onClick={() => window.location.href = loginRedirectPath}>
            Return to Login
          </button>
        </div>
      );
    }

    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}