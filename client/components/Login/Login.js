import React, { Component } from 'react';
import './Login.scss';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <a href="/auth/facebook">Facebook</a>
      </div>
    );
  }
}

export default Login;
