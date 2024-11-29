import React from "react"
import { cn } from "@/shared/lib/utils"
import { FormInput } from "../form-components"
import { WhiteBlock } from "../white-block"

interface Props {
  className?: React.ReactNode
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock
      title="1. Персональный данные"
      className={cn(className)}
    >
      <div className="grid grid-cols-2 gap-5">
        <FormInput name="firstName" className="text-base" placeholder="Имя" />
        <FormInput
          name="lastName"
          className="text-base"
          placeholder="Фамилия"
        />
        <FormInput name="email" className="text-base" placeholder="E-mail" />
        <FormInput name="phone" className="text-base" placeholder="Телефон" />
      </div>
    </WhiteBlock>
  )
}
