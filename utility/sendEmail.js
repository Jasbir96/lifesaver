module.exports = async function sendEmail(option) {
  try {
    // email configuration=> transport
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: "pepcodingdev@gmail.com",
        pass: config.APP_PASSWORD
      }
    })
    // email options
    const emailOptions = {
      from: "everyone@gmail.com",
      to: option.to,
      subject: option.subject,
      text: "I am testing email",
      html: option.email
    }
    // send mail
    await transport.sendMail(emailOptions);
  } catch (err) {
    console.log(err);
  }
}


// signup => welcome email