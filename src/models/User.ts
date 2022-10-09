import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface UserSchemaInterface {
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword?: (password: string) => Promise<boolean>
}

const UserSchema = new mongoose.Schema<UserSchemaInterface>({
  name: {
    type: String,
    required: [true, "Kindly input user name"],
    trim: true,
    minlength: [3, "Name cannot be less than 3 characters"],
    maxlength: [20, "Name cannot be more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Kindly input user email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password cannot be less than 6 characters"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (passwordInput: string) {
   const result = await bcrypt.compare(passwordInput, this.password)
   return result
}

export default mongoose.model<UserSchemaInterface>("User", UserSchema);
