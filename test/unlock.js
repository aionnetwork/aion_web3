module.exports = function(w3, addr, pw){
	return new Promise((resolve, reject)=>{
		w3.personal.unlockAccount(addr, pw, 999999, (err, unlock)=>{
			if(err)
				reject(err)
			else if(unlock && unlock === true)
				resolve(addr)
			else
				reject('unlock fail')
		})
	})
}