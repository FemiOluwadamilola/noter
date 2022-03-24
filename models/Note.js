const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
	userId:{
		type:String,
		sparse:true,
	},
	subject:{
		type:String,
		index:true,
		sparse:true
	},
	note:{
	  type:String,
	  sparse:true,
	  max:1000
	}
},{timestamps:true})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;