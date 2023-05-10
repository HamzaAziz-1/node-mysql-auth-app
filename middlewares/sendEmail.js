const sgMail = require("@sendgrid/mail");
const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  return sgMail.send({
    from: 'Pivottinc <pwreset@pivottinc.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
