import { prisma } from "@/prisma/prisma-client"
import { getUserSession } from "@/shared/lib/get-user-session"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getUserSession()

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      )
    }

    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
      select: {
        fullName: true,
        email: true,
        password: false,
      },
    })

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 })
  }
}
