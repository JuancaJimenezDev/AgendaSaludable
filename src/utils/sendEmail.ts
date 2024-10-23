import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER, // tu usuario SMTP
      pass: process.env.EMAIL_PASS  // tu contraseña SMTP
    }
  });

  await transporter.sendMail({
    from: '"Sistema de Citas" <no-reply@citas.com>',
    to,
    subject,
    html,
  });
}
