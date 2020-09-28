import React from "react";
import "./styles.css";
import Home from "./component/home/home";
import Navigation from "./component/Navigation/navigation";
import Category from "./component/category/category";
import Products from "./component/products/products";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100); // fake async
  }
};

const Protected = () => <h3>Welcome Admin !</h3>;

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }));
    });
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at /admin</p>
        <button className="myButton" onClick={this.login}>
          Log in
        </button>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      fakeAuth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default function App() {
  return (
    <div className="App">
      <div style={{ textAlign: "left" }}>
        <h2>The Shoebox</h2>
      </div>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Category" component={Category} />
          <Route path="/Products" component={Products} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/admin" component={Protected} />
        </Switch>
      </Router>
    </div>
  );
}
