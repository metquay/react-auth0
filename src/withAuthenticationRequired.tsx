import React from 'react';
import { useAuth0 } from './useAuth0';

interface AuthenticationConfig {
  loginRedirectPath: string;
  returnTo?: boolean;
  loadingComponent?: React.ComponentType;
  onRedirecting?: () => void;
}

type AnyProps = Record<string, unknown>;

export function withAuthenticationRequired<P extends AnyProps = AnyProps>(
  Component: React.ComponentType<P>,
  config: AuthenticationConfig | string
) {
  const {
    loginRedirectPath,
    returnTo = true,
    loadingComponent: LoadingComponent,
    onRedirecting
  } = typeof config === 'string' ? { loginRedirectPath: config } : config;

  function WithAuthenticationRequired(props: P) {
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
      console.error(error)
      window.location.href = loginRedirectPath
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

    return <Component {...props} />;
  }

  WithAuthenticationRequired.displayName = `WithAuthenticationRequired(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithAuthenticationRequired;
}