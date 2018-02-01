module.exports = function(w3, sol){
  return new Promise((resolve, reject)=>{
    w3.eth.compile.solidity(sol, (err, res)=>{
      if(err)
        reject(err)
      if(res){
        let name = Object.keys(res)[0]
        let compiled = res[name]
        let abi = compiled.info.abiDefinition
        let code = compiled.code
        resolve({
          name: name, 
          abi: abi, 
          binary: code
        });
      }
    })
  })
}