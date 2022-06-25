const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");

class APIfeatures {

    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const messageCtrl = {

    createMessage: async (req, res) => {
        try {
            const { recipients, text, media } = req.body
            if (!recipients || (!text.trim() && media.length === 0)) return
            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    { recipients: [req.user._id, recipients] },
                    { recipients: [recipients, req.user._id] }
                ]
            }, {
                recipients: [req.user._id, recipients], text, media
            },
                { new: true, upsert: true }
            )

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender: req.user._id,
                recipient: recipients, text, media
            })

            await newMessage.save()
            res.json({ msg: 'Create message' })

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },

    getConversation: async (req, res) => {

        try {
            const features = new APIfeatures(Conversations.find({ recipients: req.user._id }), req.query).paginating()

            const conversations = await features.query.sort('-updatedAt').populate('recipients', 'avatar username fullname')

            res.json({ conversations, result: conversations.length })

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getMessages: async (req, res) => {

        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id },
                ]
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')

            res.json({
                messages,
                result: messages.length
            })

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },


};

module.exports = messageCtrl;
