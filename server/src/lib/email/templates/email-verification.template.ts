export const emailVerificationTemplate = (url: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f9fafb;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          padding: 30px 40px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        h1 {
          font-size: 24px;
          color: #111827;
        }
        p {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 24px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3b82f6;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 6px;
          transition: background-color 0.2s ease-in-out;
        }
        .button:hover {
          background-color: #2563eb;
        }
        .footer {
          margin-top: 32px;
          font-size: 13px;
          color: #9ca3af;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Foodora V2 🍽️</h1>
        <p>Please confirm your email address by clicking the button below.</p>
        <a href="${url}" class="button" target="_blank">Verify Email</a>
        <p>If you didn't request a verification email, you can safely ignore this email.</p>
        <div class="footer">Foodora V2 · All rights reserved</div>
      </div>
    </body>
  </html>
  `;
};
