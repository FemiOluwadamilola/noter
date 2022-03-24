const router = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');

// CREATE NEW NOTE
router.post('/create', async (req,res) => {
	const newNote = new Note(req.body)
 try{
 	const createdNote = await newNote.save();
  await User.findByIdAndUpdate(createdNote.userId, {$push:{notes:createdNote._id}})
  res.status(200).json('note created...')
 }catch(err){
 	res.status(500).json({error_msg: err.message})
 }
})

//EDIT USERS NOTE
router.put('/:id', async (req,res) => {
  try{
  	const note = await Note.findById(req.params.id);
  	if(note.userId !== req.body.userId){
  		res.status(401).json({error_msg:'command invalid'})
  	}else{
  	  const editedNote = await Note.findByIdAndUpdate(req.params.id,{
  	  	$set:req.body,
  	  },{new:true})
  	  res.status(200).json(editedNote)
  	}
  }catch(err){
  	res.status(500).json({error_msg:err.message})
  }
})

// DELETE NOTE
router.delete('/:id', async (req,res) => {
  try{
  	const note = await Note.findById(req.params.id);
  	if(note.userId !== req.body.userId){
  		res.status(401).json({error_msg:'command invalid'})
  	}else{
  	  const deletedNote = await Note.findByIdAndDelete(req.params.id)
      await User.findByIdAndDelete(note.userId, {$pull:{notes:note._id}})
  	  res.status(200).json('note deleted...')
  	}
  }catch(err){
  	res.status(500).json(err.message)
  }
})

// GET USER NOTES
router.get('/:id', async (req,res) => {
  try{
    // const user = await User.findById(req.params.id);
    // const userNote = await Note.find({userId: user._id});
    const userNote = await Note.aggregate([
      {$match:{userId:req.params.id}}, 
      {$project:{
        'subject':1,
        'note':1
      }}
    ]);

    return res.status(200).json(userNote)
  }catch(err){
  	res.status(500).json(err.message)
  }
})

module.exports = router;