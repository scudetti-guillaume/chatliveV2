const MessageModel = require("../models/message.model");


exports.registerMessage = async (data, res) => {
console.log(data);
  try {
    const { text, pseudo, id } = data;
    if (pseudo === null || id === null) return res({ success: false, error: "erreur veuillez réessayer" });
    const messageNew = new MessageModel({
      text: text,
      pseudo: pseudo,
      userId: id,
    });
    await messageNew.save()
    res({ success: true, message: messageNew });
  } catch (err) {
    console.log(err);
    return res({ success: false, error: "erreur veuillez réessayer" });
  }
}

exports.getAllMessages = async (data, res) => {
  try {
    const messagesArray = []
    const messages = await MessageModel.find();
    messages.forEach(message => {
    messagesArray.push(message);
    })
    res({ success: true, messagesArray });
  } catch (err) {
    console.log(err);
    return res({ success: false, error: "erreur veuillez réessayer" });
  }
}