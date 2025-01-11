export const VerificationUserTemplate = (code: string): string => {
  const api = process.env.NEXT_PUBLIC_API_URL
  const domain = process.env.DOMAIN_URL
  const verificationURL = `${domain}${api}/auth/verify?code=${code}`

  return `
    <div>
      <h1>Код подтверждения: #${code}!</h1>

      <p>
         <a href="${verificationURL}">Подтвердить регистрацию</a>
      </p>
    </div>
  `
}
