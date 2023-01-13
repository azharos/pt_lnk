const mongoose = require("mongoose");
const { Schema } = mongoose;

const recordSchema = new Schema(
	{
		user_id: String,
		login: String,
		logout: String,
		longtime: String,
	},
	{ timestamps: true }
);

const Record = mongoose.models.Record || mongoose.model("Record", recordSchema);

module.exports = Record;
