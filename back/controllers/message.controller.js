const MessageModel = require("../models/message.model");


exports.registerMessage = async (data, res) => {
console.log(data);
  try {
    const { text, pseudo, id } = data;
    const messageNew = new MessageModel({
      text: text,
      pseudo: pseudo,
      userId: id,
    });
    await messageNew.save();
    res({ success: true, message: messageNew });
  } catch (err) {
    console.log(err);
    return res({ success: false, error: "erreur veuillez réessayer" });
  }
}