import nodemailer from 'nodemailer'
import {render} from '@react-email/render'
import VerificationEmail from '../lib/VerificationEmail'


interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
// create a transporter for send mail
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10), // Ensure port is a number
  secure: process.env.EMAIL_PORT === '465', // Use 'true' if port is 465 (SSL), 'false' for 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendMail = async ({ to, subject, html, text}: EmailOptions) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: text || " ",
            html,
        })
        console.log('Email sent')
        return { success: true, message: 'Email sent successfully'}
    } catch (error: any) {
        console.error("Error while sending mail: ", error);
        if (error.response) {
      console.error('Nodemailer response error:', error.response);
    }
    return { success: false, message: `Failed to send email: ${error.message}` };
        
    }
}

export const sendVerificationEmail = async ({email, username, verifyCode}:{email: string, username: string, verifyCode: string}) => {
    const emailHtml =await render(
        VerificationEmail({username,verifyCode})
    )

    return sendMail({
        to: email,
        subject: `Verify your email address - ${username}`,
        html:  emailHtml,
    })

}