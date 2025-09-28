import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: String, required: true } // userId  users in chat
    ],
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Контроль: не должно быть дублирующихся комнат с одинаковыми участниками
chatSchema.index({ participants: 1 }, { unique: true });

export const Chat = mongoose.model("Chat", chatSchema);