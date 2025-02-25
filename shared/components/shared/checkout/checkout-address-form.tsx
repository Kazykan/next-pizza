import React, { useContext } from "react"
import { cn } from "@/shared/lib/utils"
import { WhiteBlock } from "../white-block"
import { Input, Textarea } from "../../ui"
import { FormTextarea } from "../form-components"
import { AddressInput } from "../address-input"
import { Controller, useFormContext } from "react-hook-form"
import { ErrorText } from "../error-text"

interface Props {
  className?: React.ReactNode
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  const { control } = useFormContext()

  return (
    <WhiteBlock title="1. Адрес доставки" className={cn(className)}>
      <div className="flex flex-col gap-5">
        <Controller
          control={control}
          name="address"
          render={({ field, fieldState }) => (
            <>
              <AddressInput onChange={field.onChange} />
              {fieldState.error?.message && (
                <ErrorText text={fieldState.error.message} />
              )}
            </>
          )}
        />

        <FormTextarea
          name="comment"
          className="text-base"
          placeholder="Комментарий к заказу"
          rows={5}
        />
      </div>
    </WhiteBlock>
  )
}
