import { PaymentCallbackData } from "@/@types/yookassa"
import { prisma } from "@/prisma/prisma-client"
import { PaySuccessTemplate } from "@/shared/components"
import { sendEmail } from "@/shared/lib/sendEmail"
import { CartItemDTO } from "@/shared/services/dto/cart.dto"
import { OrderStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData

    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.object.metadata.order_id),
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" })
    }

    const isSucceeded = body.object.status === "succeeded"

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    })

    const items = JSON.parse(order?.items as string) as CartItemDTO[]

    if (isSucceeded) {
      await sendEmail(
        order.email,
        "Alias Pizza | Ваш заказ успешно оформлен 🎉" + order.id,
        PaySuccessTemplate(order.id, items)
      )
    } else {
      await sendEmail(
        order.email,
        "Alias Pizza | Оплата заказа 🧾" + order.id + " отменена 🚫",
        `Ваш заказ отменен, пожалуйста, свяжитесь с нами по телефону ${process.env.PIZZA_PHONE}`
      )
    }
  } catch (err) {
    console.error("[Checkout Callback] Error:", err)
    return NextResponse.json({ error: "Server Error" })
  }
}
