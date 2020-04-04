import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import {logout} from '../../actions/auth';
import PropTypes from 'prop-types';


const Navbar = ({auth , logout}) => {

  const {isAuthenticated , loading} = auth;

  const authLinks = (
    <ul>
      <li>
          <Link to="/profiles">
            Developers
          </Link>
        </li>
        <li>
          <Link to="/posts">
            Posts
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <i className = 'fa fa-user' />{'  '}
            <span className = 'hide-sm'>Dashboard</span></Link>
        </li>
        <li>
          <a onClick = {logout} href="#!">
            <i className = "fas fa-sign-in-alt"></i>{'  '}
            <span className = "hide-sm">Logout</span></a>
        </li>
      </ul>
  );

  const gustLinks = (
    <ul>
         <li>
          <Link to="/profiles">
            Developers
          </Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="login">Login</Link>
        </li>
      </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
        <i className="fa fa-code"></i> DevConnector
        </Link>
      </h1>
      { // if ! loading return a fragment , 
       // if auth return nav with logout else nav with login, dev, register
         !loading && (<Fragment> {isAuthenticated ? authLinks : gustLinks}  </Fragment>)
      }
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps , {logout})(Navbar);
