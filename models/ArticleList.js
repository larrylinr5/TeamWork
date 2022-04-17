const mongoose = require('mongoose');
const moment = require('moment');

const schemaOptions = {
    toObject: {
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    toJSON: {
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    runSettersOnQuery: true,
    versionKey: false,
};

const formatDateTime = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');

const ArticleListSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "【名稱】必填"],
        },
        userContent: {
            type: String,
            required: [true, "【內容】必填"],
        },
        userPhoto: String,
        imgUrl: String,
        createAt: {
            type: Date,
            default: Date.now(),
            get: formatDateTime,
        }
    },
    schemaOptions,
)

const ArticleListModel = mongoose.model('ArticleList', ArticleListSchema);

module.exports = ArticleListModel;