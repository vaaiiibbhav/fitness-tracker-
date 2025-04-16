const verificationEmail = (verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 5px;
          padding: 20px;
          margin-top: 20px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome to Fitness Tracker!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" class="button">Verify Email</a>
        <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
        <p>${verificationLink}</p>
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>If you didn't create an account with Fitness Tracker, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = verificationEmail; 