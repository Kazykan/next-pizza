"use client"

import React from "react"
import { AddressSuggestions } from "react-dadata"
import "react-dadata/dist/react-dadata.css"

//-
interface Props {
  onChange?: (value?: string) => void
}

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      //   token={process.env.DADATA_API_KEY!}
      token="eddf83f619500a58608bdfcc45474486c3074da5"
      onChange={(data) => onChange?.(data?.value)}
    />
  )
}
