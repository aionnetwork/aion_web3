import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import Web3 from 'aion-web3'
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

web3.eth.getAccounts(function(err, res){
	if(err)
		console.log(err)
	if(res)
		console.log(res)
})

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
