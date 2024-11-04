import type { Metadata } from "next"
import { Header } from "@/shared/components/shared"
import React from "react"

export const metadata: Metadata = {
  title: "Next pizza",
}

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <main className="min-h-screen">
      <Header />
      {children}
      {modal}
    </main>
  )
}

// export default function HomeLayout({
//   children,

// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <main className="min-h-screen">
//       <Header />
//       {children}
//     </main>
//   )
// }
