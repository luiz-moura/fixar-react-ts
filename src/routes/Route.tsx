import React from 'react';

import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate) {
          if (user) {
            return <Component />;
          }
          return (
            <Redirect
              to={{
                pathname: isPrivate ? '/signin' : '/',
                state: { from: location },
              }}
            />
          );
        }
        return <Component />;
      }}
    />
  );
};

export default Route;
