import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";
import { CartStateItem } from "./get-cart-details";

export const getCartItemDetails = (
  ingredients: CartStateItem['ingredients'],
    pizzaType?: PizzaType,
    pizzaSizes?: PizzaSize,

): string => {
    const details = []

    if (pizzaSizes && pizzaType) {
      const typeName = mapPizzaType[pizzaType]
      details.push(`${typeName} ${pizzaSizes} см`)
    }
  
    if (ingredients) {
      details.push(...ingredients.map((ingredient) => ingredient.name))
    }
    return details.join(", ")
}