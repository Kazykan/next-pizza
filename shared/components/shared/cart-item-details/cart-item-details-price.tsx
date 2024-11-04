import { cn } from "@/shared/lib/utils"

interface Props {
  value: number
  className?: string
}

export const CartItemDetailsPrice: React.FC<Props> = ({ value, className }) => {
  return <h1 className={cn("font-bold", className)}>{value} ₽</h1>
}
