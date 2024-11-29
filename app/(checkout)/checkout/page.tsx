"use client"

import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CheckoutAddressForm,
  CheckoutCart,
  CheckoutPersonalForm,
  CheckoutSidebar,
  Container,
  Title,
} from "@/shared/components"
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants"
import { useCart } from "@/shared/hooks"
import { createOrder } from "@/app/actions"
import toast from "react-hot-toast"

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false)
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } =
    useCart()

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  })

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true)
      const url = await createOrder(data)
      toast.error("Заказ успешно оформлен! 📝 Переход на оплату... ", {
        icon: "✅",
      })

      if (url !== undefined) {
        location.href = url
      }
    } catch (err) {
      console.error(err)
      setSubmitting(false)
      toast.error("Не удалось  создать заказ", { icon: "❌" })
    }
  }

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1
    updateItemQuantity(id, newQuantity)
  }

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        className="font-extrabold mb-8 text-[36px]"
      />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Левая часть */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                loading={loading}
                items={items}
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
              />

              <CheckoutPersonalForm
                className={loading && "opacity-40 pointer-events-none"}
              />
              {/* <div className="relative react-dadata__container">
                <input className="box-border border border-gray-300 rounded-md outline-none w-full h-9 px-2.5 text-base block react-dadata__input focus:border-blue-600 focus:shadow-inner focus:shadow-blue-300" />
                <ul className="z-10 text-left bg-white rounded-md m-0 p-0 list-none absolute top-full left-0 right-0 overflow-hidden shadow-md react-dadata__suggestions">
                  <li className="cursor-pointer box-border text-left bg-transparent border-none w-full py-1.5 px-2.5 text-base block react-dadata__suggestion">
                    <span className="text-gray-600 react-dadata__suggestion-subtitle">
                      Subtitle
                    </span>
                    <span className="text-gray-400 react-dadata__suggestion-note">
                      Note
                    </span>
                  </li>
                  <li className="cursor-pointer box-border text-left bg-transparent border-none w-full py-1.5 px-2.5 text-base block line-through react-dadata__suggestion react-dadata__suggestion--line-through">
                    <span className="text-gray-600 react-dadata__suggestion-subtitle">
                      Subtitle
                    </span>
                    <span className="text-gray-400 react-dadata__suggestion-note">
                      Note
                    </span>
                  </li>
                  <li className="cursor-pointer box-border text-left bg-transparent border-none w-full py-1.5 px-2.5 text-base block bg-blue-100 react-dadata__suggestion react-dadata__suggestion--current">
                    <span className="text-gray-600 react-dadata__suggestion-subtitle">
                      Subtitle
                    </span>
                    <span className="text-gray-400 react-dadata__suggestion-note">
                      Note
                    </span>
                  </li>
                </ul>
              </div> */}
              <CheckoutAddressForm
                className={loading && "opacity-40 pointer-events-none"}
              />
            </div>

            {/* Правая часть */}
            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  )
}
