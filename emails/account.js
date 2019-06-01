const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
    to: 'paulattara@gmail.com',
    from: 'paulattara@gmail.com',
    subject: 'THIS THE SUBJECT',
    text: 'Text'
})