import Message from "../../models/Message.js";

const Mutation = {
    createMessage: async (_, {title, content, author}) => {
        const newMessage = new Message({title, content, author});
        return newMessage.save();
    },
    deleteMessage: async (_, {id}) => {
        return Message.findByIdAndDelete(id);
    },
};

export default Mutation;
