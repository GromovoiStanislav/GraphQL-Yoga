import Message from "../../models/Message.js";

const Query = {
    ping() {
        return "pong";
    },
    getMessages: async () => {
        return Message.find();
    },
    getMessage: async (_, {id}) => {
        return Message.findById(id)
    },
};

export default Query;
