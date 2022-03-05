const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
    notes: String,
    user: {type: Schema.Types.ObjectId, ref:'User'},
    recipe: {type: Schema.Types.ObjectId, ref:'Recipe'}
});

const Note = model("Note", noteSchema);

module.exports = Note;
