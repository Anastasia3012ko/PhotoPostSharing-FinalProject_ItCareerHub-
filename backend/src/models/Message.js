import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },   //Room = chat Id
  sender: { type: String, required: true },  
  text: { type: String, required: true },    
  },
  { timestamps: true }
);

messageSchema.pre("save", function (next) {
  if (!this.room || !this.sender) {
    next(new Error("Message must have a room and a sender"));
  } else {
    next();
  }
});

export const Message = mongoose.model("Message", messageSchema);