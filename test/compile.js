module.exports = function(w3, sol){
	return new Promise((resolve, reject)=>{
		w3.eth.compile.solidity(sol, (err, res)=>{
			if(err)
				reject(err)
			if(res){
				resolve(res)
			}
		})	
	})
}