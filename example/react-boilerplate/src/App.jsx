import React, { Component } from 'react'
import logo from './aion.svg'

import '../node_modules/normalize.css/normalize.css'
import '../node_modules/@blueprintjs/core/dist/blueprint.css'
import './App.css'
import Body from './Body'

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="pt-navbar .pt-fixed-top">
          <div className="nc-container">
            <div className="pt-navbar-group pt-align-left">
              <div className="pt-navbar-heading">
                <a href='https://aion.network' target='__blank'>
                  <img src={logo} className="aion-logo" alt="logo" />
                </a>
                <span className="pt-navbar-divider nc-navbar-divider"></span>
                <span className='logo-text'>Web3</span>
              </div>
            </div>
            <div className="pt-navbar-group pt-align-right">
              <a href='https://github.com/aionnetwork/aion_web3' target='__blank'>
                <button className="pt-button pt-minimal pt-icon-git-repo">GitHub</button>
              </a>
            </div>
          </div>
        </nav>
        <Body/>
      </div>
    )
  }
}

export default App
