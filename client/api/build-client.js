import axios from 'axios';

// due to running next js where we use server side rendering
// and due to running the entire app in kubernetes
// we create this to handle the base url. 
// without this when we try to make requests during server side rendering
// node would point to a local host domain instead of the kubernetes domain

// req gets automatically passed when using getInitialProps (via nextjs)
// the headers in req contain the cookie
// the host header is on the req header as well. 
// host header and cookie is required to be in the header for server side rendering
export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // instead of having to encode the specific service names we are reaching out to nginx to get the base url for the specific service
    // nginx stores the base url and can determine the correct base url based on the route provided
    // for ex api/users/currentuser is all that should be needed to make a request. nginx determines the base url
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx-controller.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // We must be on the browser
    // we don't need to know the default url
    // if there is no base url browsers will assume you want to use the current base url
    // this is not the case in server side rendering
    return axios.create({
      baseUrl: '/'
    });
  }
};
