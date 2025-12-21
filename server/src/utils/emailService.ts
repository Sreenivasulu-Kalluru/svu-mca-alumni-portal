import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

// Create transporter outside the function to reuse connection pool
let transporter: nodemailer.Transporter;

const createTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    // Use real credentials (Gmail or other SMTP) with connection pooling
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Explicitly define host
      port: 465, // Use secure port 465
      secure: true, // true for 465, false for other ports
      family: 4,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    } as any);
  } else {
    // Development: Create a test account automatically (Ethereal)
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
};

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailTransporter = await createTransporter();

  const mailOptions = {
    from: '"SVU Alumni Portal" <noreply@svualumni.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await mailTransporter.sendMail(mailOptions);

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
