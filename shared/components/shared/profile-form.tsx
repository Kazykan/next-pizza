"use client"

import React from "react"
import { cn } from "@/shared/lib/utils"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formUpdateSchema, TFormUpdateValue } from "./modals/forms/schemas"
import { User } from "@prisma/client"
import toast from "react-hot-toast"
import { signOut } from "next-auth/react"
import { Container } from "./container"
import { Title } from "./title"
import { FormInput } from "./form-components"
import { Button } from "../ui"
import { updateUserInfo } from "@/app/actions"

interface Props {
  data: User
  className?: string
}

export const ProfileForm: React.FC<Props> = ({ data, className }) => {
  const form = useForm({
    resolver: zodResolver(formUpdateSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
    },
  })

  const onSubmit = async (data: TFormUpdateValue) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      })

      toast.success("Информация успешно изменена! 📝", {
        icon: "✅",
      })
    } catch (err) {
      return toast.error("Ошибка при обновлении данных", { icon: "❌" })
    }
  }

  const onClickSignOut = () => {
    signOut({
      callbackUrl: "/",
    })
  }

  return (
    <Container className="my-10">
      <Title text="Личные данные" size="md" className="font-bold" />
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-5 w-96 mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormInput name="email" label="E-mail" required />
          <FormInput name="fullName" label="Полное имя" required />

          <FormInput type="password" name="password" label="Новый пароль" />
          <FormInput
            type="password"
            name="confirmPassword"
            label="Повторите пароль"
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="text-base mt-10"
            type="submit"
          >
            Сохранить
          </Button>

          <Button
            className="text-base"
            onClick={onClickSignOut}
            variant="secondary"
            disabled={form.formState.isSubmitting}
            type="button"
          >
            Выйти
          </Button>
        </form>
      </FormProvider>
    </Container>
  )
}
