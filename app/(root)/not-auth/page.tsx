import { InfoBlock } from "@/shared/components"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="У вас нет доступа к этой странице"
        text="Пожалуйста, авторизуйтесь или зарегистрируйтесь, чтобы получить доступ к этой странице."
        imageUrl="lock.png"
      />
    </div>
  )
}
