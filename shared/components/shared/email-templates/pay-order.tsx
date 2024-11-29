import React from "react"

interface Props {
  orderId: number
  totalAmount: number
  paymentUrl: string
}

export const PayOrderTemplate = (
  orderId: number,
  totalAmount: number,
  paymentUrl: string
): string => {
  return `
    <div>
      <h1>Заказ #${orderId}!</h1>

      <p>
        Оплатите заказ на сумму: ${totalAmount} рублей. Перейдите 
        <a href="${paymentUrl}">по этой ссылке</a> для оплаты заказа
      </p>
    </div>
  `
}
