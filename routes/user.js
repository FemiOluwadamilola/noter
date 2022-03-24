const router = require('express').Router();
const cryptoJs = require('crypto-js');
const User = require('../models/User');

// update profile account
router.put('/:id', async (req,res) => {
  	const user = await User.findById(req.params.id);
  	if(!user){
  	  res.status(401).json({msg:'command invalid'})
  	}else{
  		if(req.body.password){
	  	    req.body.password = cryptoJs.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET_KEY).toString()
  	  }else{
  	  	 try{
  	  	 	const updatedProfile = await User.findByIdAndUpdate(user._id,{
  	  	 		$set:req.body
  	  	 	},{new:true});

  	  	 	res.status(200).json(updatedProfile)
  	  	 }catch(err){
  	  	 	res.status(500).json({msg:err.message})
  	  	 }
  	  }
  	}
})

// delete user account
router.delete('/:id', async (req,res) => {
	const user = await User.findById(req.params.id);
	if(!user){
		res.status(401).json({error_msg:'Oops Operation failed'})
	}else{
		try{
			await User.findByIdAndDelete(user._id)
			res.status(200).json({msg:"Account deleted..."})
		}catch(err){
			res.status(500).json({error_msg:err.message})
		}
	}
})

module.exports = router;