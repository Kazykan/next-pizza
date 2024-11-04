import { Ingredient, ProductItem } from "@prisma/client"
import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza"
import { calcTotalPizzaPrice } from "./calc-total-pizza-prices"

export const getPizzaDetails = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>
) => {
  const textDetails = `${size} см, ${mapPizzaType[type]} пицца`

  const totalPrice = calcTotalPizzaPrice(
    type,
    size,
    items,
    ingredients,
    selectedIngredients
  )

  return { totalPrice, textDetails }
}
