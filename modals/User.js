import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true }, // ✅ fixed: capital "String"
  cartItem: { type: Object, default: {} }
}, { minimize: false });

// ✅ fixed: proper model registration with fallback to avoid overwrite issues
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;