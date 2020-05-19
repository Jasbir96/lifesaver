const nodemailer=require("nodemailer");
module.exports = async function sendEmail(option) {
  try {
    // email configuration=> transport
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: "pepcodingdev@gmail.com",
        pass: process.env.APP_PASSWORD || require("../config/secrets").PASS
      }
    })
    // email options
    const emailOptions = {
      from: "everyone@gmail.com",
      to: option.to,
      subject: option.subject,
      html: option.html
    }
    // send mail
    await transport.sendMail(emailOptions);
  } catch (err) {
    console.log(err);
  }
}


// signup => welcome email