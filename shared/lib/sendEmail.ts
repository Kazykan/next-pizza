
import axios from "axios"
import ReactDOMServer from 'react-dom/server'
import { ReactNode } from "react"

export const sendEmail = async (to: string, subject: string, templates: string) => {
  const authorization_key = process.env.RESEND_API_KEY
  const email_from = process.env.EMAIL_FROM

  const formData = new FormData()
  formData.append("name", "My name")
  formData.append("from", email_from!)
  formData.append("subject", subject)
  formData.append("to", to)
  formData.append("html", templates)


  try {
    const response = await axios.post(
      "https://api.smtp.bz/v1/smtp/send",
      formData,
      {
        headers: {
          Authorization: authorization_key,
          "Content-Type": "multipart/form-data",
        },
      }
    )

    if (response.status === 400) {
      throw response.statusText
    }
    if (response.status === 401) {
      throw response.statusText
    }

    return response.data
  } catch (err) {
    console.error(err)
    throw new Error("Failed to send email" + err)
  }
}
