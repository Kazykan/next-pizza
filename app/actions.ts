"use server"

import { prisma } from "@/prisma/prisma-client"
import { PayOrderTemplate, VerificationUserTemplate } from "@/shared/components/shared/email-templates"

import { CheckoutFormValues } from "@/shared/constants"
import { createPayment } from "@/shared/lib"
import { getUserSession } from "@/shared/lib/get-user-session"
import { sendEmail } from "@/shared/lib/sendEmail"
import { OrderStatus, Prisma } from "@prisma/client"
import { hashSync } from "bcrypt"
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

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession()

    if (!currentUser) {
      throw new Error("Пользователь не найден")
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    })

    await prisma.user.update({
      where: { id: Number(currentUser.id) },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    })
  } catch (err) {
    console.error("Error [UPDATE_USER", err)
    throw err
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    })

    if (user) {
      if (!user.verified) {
        throw new Error("Почта не подтверждена")
      }
      throw new Error("Пользователь с таким email уже существует")
    }

    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashSync(body.password as string, 10),
        fullName: body.fullName,
      },
    })

    const code = Math.floor(100000 + Math.random() * 800000).toString()

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    })

    /* Отправляем письмо клиенту */
    await sendEmail(
      createdUser.email,
      "Alias Pizza | 📝 Подтверждение регистрации",
      VerificationUserTemplate(code)
    )
  } catch (err) {
    console.error("Error [CREATE_USER]", err)
    throw err
  }
}
