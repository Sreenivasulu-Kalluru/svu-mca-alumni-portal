import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create a transporter using Ethereal Email (for development)
  // In production, use SendGrid, Mailgun, or verified Gmail
  let transporter;

  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    // Use real credentials if provided (Gmail or other SMTP)
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development: Create a test account automatically (Ethereal)
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  const mailOptions = {
    from: '"SVU Alumni Portal" <noreply@svualumni.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // Optional: Add HTML support later
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('--------------------------------------------------');
  if (process.env.EMAIL_USERNAME) {
    console.log('📨 MESSAGE SENT (Real Email)');
    console.log('--------------------------------------------------');
    console.log('Message ID: %s', info.messageId);
    console.log('Check your recipient inbox.');
  } else {
    console.log('📨 MESSAGE SENT (Ethereal Email)');
    console.log('--------------------------------------------------');
    console.log('Message ID: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
  console.log('--------------------------------------------------');
};

export default sendEmail;
