import React, { Component } from 'react';
import './reset.scss';
import './main.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    );
  }
}

export default App;
