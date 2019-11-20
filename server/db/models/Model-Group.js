import moment from "moment";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const modelSchema = new Schema({
        name: {type:String, required: true},
        description: {type:String},
        //date: {type: Date, default: Date.now},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User required']},
        members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    },
    {
        timestamps: { createdAt: 'createdAt' },
        toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });


modelSchema.virtual('date')
    .get(function () {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
    });

modelSchema.virtual('updated')
    .get(function () {
        return moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    });

const Group =mongoose.model("Group", modelSchema);
export default Group

