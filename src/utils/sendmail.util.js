import dotenv from 'dotenv';
dotenv.config();

const nodemailer = require('nodemailer')
const { google } = require('googleapis')


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

export const sendMail = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'akhilmandalfamily@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: 'AKHILMONDAL <akhilmandalfamily@gmail.com>',
            to: 'akhilmandalfamily@outlook.com',
            subject: 'Hello Gmail API',
            text: 'This is an email from Gmail API',
            html: '<h1>Hello everyone this is an example mail of gmail API.</h1>'
        };
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}

sendMail() // call this function from srvice
.then((result) => console.log('Email sent...' ,result))
.catch((error) => console.log(error.message));