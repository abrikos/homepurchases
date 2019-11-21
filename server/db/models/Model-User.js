import moment from "moment";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
        id: {type: Number, unique: true},
        first_name: String,
        username: String,
        photo_url: String,
        language_code: String,
        group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    },
    {
        timestamps: {createdAt: 'createdAt'},
        //toObject: {virtuals: true},
        // use if your results might be retrieved as JSON
        // see http://stackoverflow.com/q/13133911/488666
        toJSON: {virtuals: true}
    });

modelSchema.virtual('date')
    .get(function () {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
    });


modelSchema.virtual('referrals', {
    ref: 'Referral',
    localField: '_id',
    foreignField: 'parent',
    justOne: false // set true for one-to-one relationship
});

modelSchema.virtual('parents', {
    ref: 'Referral',
    localField: '_id',
    foreignField: 'referral',
    justOne: false // set true for one-to-one relationship
});


const User = mongoose.model("User", modelSchema)
export default User;

