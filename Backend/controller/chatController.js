const Chat = require("../model/Chat");

// ========================================
// CREATE CHAT
// ========================================

const createChat = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const chat = await Chat.create({
      user: userId,
      title: "New Chat",
      messages: [],
    });

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });

  } catch (error) {
    console.error("Create Chat Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET ALL CHATS OF A USER
// ========================================

const getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({
      user: userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });

  } catch (error) {
    console.error("Get Chats Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// SAVE MESSAGE TO CHAT
// ========================================

const saveMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const message = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push(message);

    await chat.save();

    res.status(200).json({
      success: true,
      message: "Message saved successfully",
      chat,
    });

  } catch (error) {
    console.error("Save Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete(chatId);

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  createChat,
  getChats,
  saveMessage,
  deleteChat,
};