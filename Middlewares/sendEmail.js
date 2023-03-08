const nodemailer = require("nodemailer");

exports.sendEmail = async (option) => {
  // console.log("---------------------------------option------------------------------")
  // console.log(option)
  // console.log("---------------------------------request--------------------------------")
  // console.log(req)
  // console.log("--------------------------------------response-------------------------------")
  // console.log(res)

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });
    return  await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: option.email,
      subject: "Password Reset",
      html: `<a href=${option.link}>click here</a>, for reset your password`,
    });

  
};
