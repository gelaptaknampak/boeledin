import { NextRequest } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save to WordPress as a custom post type or comment
    const wpUrl = process.env.WORDPRESS_API_URL

    if (!wpUrl) {
      console.error('WORDPRESS_API_URL not configured')
      // Still return success to user, but log error
      return Response.json({
        success: true,
        message: 'Your message has been received. We will contact you soon.',
      })
    }

    try {
      // Create a post of type 'contact_submission' in WordPress
      await axios.post(
        `${wpUrl}/wp-json/wp/v2/contact_submissions`,
        {
          title: `Contact from ${name}`,
          content: message,
          status: 'publish',
          meta: {
            contact_name: name,
            contact_email: email,
            contact_phone: phone || '',
            contact_company: company || '',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (wpError) {
      console.warn('Failed to save to WordPress:', wpError)
      // Continue anyway - email might still work
    }

    // Send email notification if configured
    const sendgridKey = process.env.SENDGRID_API_KEY
    const fromEmail = process.env.CONTACT_EMAIL_FROM
    const toEmail = process.env.CONTACT_EMAIL_TO

    if (sendgridKey && fromEmail && toEmail) {
      try {
        await axios.post('https://api.sendgrid.com/v3/mail/send', {
          personalizations: [
            {
              to: [{ email: toEmail }],
              subject: `New Contact Form Submission from ${name}`,
            },
          ],
          from: { email: fromEmail },
          content: [
            {
              type: 'text/html',
              value: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              `,
            },
          ],
        }, {
          headers: {
            'Authorization': `Bearer ${sendgridKey}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return Response.json({
      success: true,
      message: 'Thank you for your message. We will contact you soon.',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return Response.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
