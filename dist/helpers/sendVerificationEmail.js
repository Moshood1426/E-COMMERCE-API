"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const sendVerificationEmail = async (name, origin, verificationToken, email) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
    const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: "abdullahi.yemi10@gmail.com",
        subject: "Reset Your Password",
        html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
    };
    const info = await mail_1.default.send(msg);
    return;
};
exports.default = sendVerificationEmail;
