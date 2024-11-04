import { Api } from "@/shared/services/api.client"
import { Ingredient } from "@prisma/client"
import React from "react"

export const useIngredients = () => {
  const [loading, setLoading] = React.useState(true)
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([])

  React.useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true)
        const data = await Api.ingredients.getAll()
        setIngredients(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIngredients()

    // Api.ingredients
    //   .getAll()
    //   .then((data) => {
    //     setIngredients(data)
    //   })
    //   .catch((err) => console.error(err))
  }, [])

  return { ingredients, loading }
}
