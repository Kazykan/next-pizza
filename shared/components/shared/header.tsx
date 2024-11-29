"use client"

import React from "react"
import { cn } from "@/shared/lib/utils"
import Image from "next/image"
import { Container } from "./container"
import Link from "next/link"
import { SearchInput } from "./search-input"
import { CartButton } from "./cart-button"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { ProfileButton } from "./profile-button"
import { AuthModal } from "./modals"

interface Props {
  hasSearch?: boolean
  hasCart?: boolean
  className?: string
}

export const Header: React.FC<Props> = ({
  hasCart = true,
  hasSearch = true,
  className,
}) => {
  const [openAuthModal, setOpenAuthModal] = React.useState(false)
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (searchParams.has("paid")) {
      setTimeout(() => {
        toast.success("Заказ успешно оплачен! Информация отправлена на почту.")
      }, 500)
    }
  }, [])

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-black">Alias Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">
                вкусней уже некуда
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  )
}
