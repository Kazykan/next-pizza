"use server"

import { prisma } from "@/prisma/prisma-client"
import { PayOrderTemplate } from "@/shared/components/shared/email-templates"

import { CheckoutFormValues } from "@/shared/constants"
import { createPayment } from "@/shared/lib"
import { sendEmail } from "@/shared/lib/sendEmail"
import { OrderStatus } from "@prisma/client"
import { cookies } from "next/headers"
import { number } from "zod"

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = cookies()
    const cartToken = cookieStore.get("cartToken")?.value

    if (!cartToken) {
      throw new Error("Cart token not found")
    }

    /* Находим корзину по токен */
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    })

    /* Если корзина не найдена возвращаем ошибку */
    if (!userCart) {
      throw new Error("Cart not found")
    }

    /* Если корзина пустая так же возвращаем ошибку */
    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty")
    }

    /* Создаем заказ */
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    })

    /* Очищаем корзину */
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    })

    /* удалить все товары связанные с этой корзиной */
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    })

    /* создаем платеж */
    const paymentData = await createPayment({
      amount: order.totalAmount,
      orderId: order.id,
      description: "Оплата заказа №" + order.id,
    })

    if (!paymentData) {
      throw new Error("Payment data not found")
    }

    /* если платеж создан добавляем ID полученное от Юкассы в БД */
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymendId: paymentData.id,
      },
    })

    /* Берем ссылку для оплаты на Юкассе */
    const paymentUrl = paymentData.confirmation.confirmation_url

    /* Отправляем письмо клиенту */
    await sendEmail(
      data.email,
      "Next Pizza | Оплатите заказ #" + order.id,
      PayOrderTemplate(order.id, order.totalAmount, paymentUrl)
    )

    /* Возвращаем ссылку */
    return paymentUrl
  } catch (err) {
    console.error("[CreateOrder] Server error", err)
  }
}
