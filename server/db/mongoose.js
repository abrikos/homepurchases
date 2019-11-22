import User from "server/db/models/Model-User";
import Group from "server/db/models/Model-Group";
import Referral from "server/db/models/Model-Referral";
import Purchase from "server/db/models/Model-Purchase";
import Message from "server/db/models/Model-Message";

const mongoose = require("mongoose");
// подключение
mongoose.connect("mongodb://localhost:27017/buy", {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect("mongodb://108.160.143.119:27017/minterEarth", {useNewUrlParser: true});

export default {

    Types: mongoose.Types,
    connection: mongoose.connection,
    checkOwnPassport: function (model, passport) {
        if (!passport) return false;
        return JSON.stringify(passport.user._id) === JSON.stringify(model.user.id);
    },
    checkOwnCookie: function (model, cookie) {
        if (!cookie) return false;
        if (!cookie.length) return false;
        return cookie.indexOf(model.cookieId) !== -1;
    },
    User, Group, Referral, Purchase, Message

};
