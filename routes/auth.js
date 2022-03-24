const router = require('express').Router();
const User = require('../models/User');
const cryptoJs = require('crypto-js');

router.get('/', (req,res) => {
  res.status(200).json({msg:'Auth route'})
})

// signup 
router.post('/signup', async (req,res) => {
	try{
		const {username,email,password} = req.body;
		const user = await User.findOne({email});
		if(user){
		  res.status(403).json({error_msg:'Email already registered...'})
		}else{
		  try{
			 const newUser = new User({
			 	username,
			 	email,
			 	password:cryptoJs.AES.encrypt(req.body.password, process.env.CRYPTO_SECRET_KEY).toString()
			 })

			const user = await newUser.save();
			 const {password, ...others} = user._doc;
			 res.status(200).json({msg:'Successful signup!!!', others})
			}catch(err){
				res.status(500).json({error_msg:err.message})
			}
		}
	}catch(err){
		res.status(500).json(err.message)
	}
})

// signin
router.post('/signin', async (req,res) => {
 try{
 	const {email,password} = req.body;
 	const user = await User.findOne({email});
 	if(user){
 	  try{
	 	  const hashedPassword = cryptoJs.AES.decrypt(user.password, process.env.CRYPTO_SECRET_KEY);

	      const decryptedPassword = hashedPassword.toString(cryptoJs.enc.Utf8);

	      if(decryptedPassword !== req.body.password){
	          res.status(401).json({msg:'wrong password!!!'});
	      }else{
	        const {password, ...others} = user._doc;
	        res.status(200).json({msg:'Successful signin...', others});
	      }
 	  }catch(err){
 	  	res.status(500).json({error_msg:err.message})
 	  }
 	}else{
 	  res.status(403).json({msg:'Email Invalid'})
 	}
 }catch(err){
 	res.status(500).json(err.message)
 }
})

module.exports = router;