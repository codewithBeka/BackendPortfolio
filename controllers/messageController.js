// controllers/messageController.js
import transporter from '../config/nodemailer.config.js';
import Message from '../models/message.js';
import {  sendNotification } from '../server.js';


export const createMessage = async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const newMessage = new Message({ name, email, message });
  
      // Save the message to the database
      await newMessage.save();
  
      // Prepare the email data
      const mailOptions = {
        from: email, // Sender address
        to: ["walebereket37@gmail.com"], // Your email address
        subject: `New Contact Message from ${name}`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Message</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                      overflow: hidden;
                  }
                  .header {
                      background-color: #4A90E2;
                      color: #ffffff;
                      padding: 20px;
                      text-align: center;
                  }
                  .header h1 {
                      margin: 0;
                      font-size: 24px;
                  }
                  .content {
                      padding: 20px;
                  }
                  .content p {
                      line-height: 1.6;
                      color: #333333;
                  }
                  .footer {
                      background-color: #f4f4f4;
                      text-align: center;
                      padding: 10px;
                      font-size: 12px;
                      color: #777777;
                  }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      margin-top: 20px;
                      background-color: #4A90E2;
                      color: white;
                      text-decoration: none;
                      border-radius: 5px;
                  }
                  .button:hover {
                      background-color: #357ABD;
                  }
                  @media (max-width: 600px) {
                      .container {
                          width: 100%;
                          margin: 0;
                      }
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>New Contact Message</h1>
                  </div>
                  <div class="content">
                      <p><strong>Name:</strong> ${name}</p>
                      <p><strong>Email:</strong> ${email}</p>
                      <p><strong>Message:</strong></p>
                      <p>${message}</p>
                      <a href="mailto:${email}" class="button">Reply to Sender</a>
                  </div>
                  <div class="footer">
                      <p>Thank you for reaching out!</p>
                      <p>&copy; ${new Date().getFullYear()} Your Company Name</p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };


      // Send push notification to all users
        sendNotification(newMessage);
      
  
      // Send the email
    const messageMail=  await transporter.sendMail(mailOptions);
    

  
      res.status(201).json({ message: 'Message sent successfully!', data: newMessage,mail: messageMail});
    } catch (error) {
      console.error('Error in createMessage:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};



// New function to mark a message as unread
export const markAsUnread = async (req, res) => {
    const { id } = req.params;
    try {
      const message = await Message.findByIdAndUpdate(id, { status: 'read' }, { new: true });
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json({ message: 'Message marked as unread', data: message });
    } catch (error) {
      console.error('Error marking message as unread:', error);
      res.status(500).json({ error: 'Failed to mark message as unread' });
    }
  };