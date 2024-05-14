require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    // service: process.env.SMTP_SERVICE,
    // auth: {
    //   user: process.env.APP_MAIL,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  //email template path
  const templatePath = path.join(__dirname, "../mails", template);

  //render email template
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.APP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
