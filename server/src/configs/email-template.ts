export const EmailTemplate = {
    resetPassword: (data: { username: string; resetLink: string }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ISMS Solumada | Password Reset</title>
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
        }
        h1 {
            color: #2e7d32; /* Elegant green */
            text-align: center;
        }
        p {
            color: #333333;
            font-size: 16px;
            line-height: 1.5;
        }
        a.button {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            background-color: #2e7d32; /* Green button */
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        a.button:hover {
            background-color: #1b5e20;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            text-align: center;
        }
        </style>
    </head>
    <body>
        <div class="container">
        <h1>Password Reset</h1>
        <p>Hello ${data.username},</p>
        <p>You recently requested to reset your password. Click the button below to set a new password. This link is valid for 1 hour.</p>
        <p style="text-align: center;">
            <a class="button" href="${data.resetLink}">Reset Password</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Solumada. All rights reserved.
        </div>
        </div>
    </body>
    </html>`,
};
