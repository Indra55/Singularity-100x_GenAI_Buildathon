const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOutreachEmail({ to, subject, html, from = 'onboarding@resend.dev' }) {
    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'Precedence': 'bulk',
                'List-Unsubscribe': '<mailto:unsubscribe@hitanshu.tech?subject=Unsubscribe>',
            },
            reply_to: from,
            text: html.replace(/<[^>]*>/g, '') 
        });
        

        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email service error:', error);
        throw error;
    }
} 

module.exports = {
    sendOutreachEmail,
};
