import recipesData from '../data/recipes.json'
import ingredientsData from '../data/ingredients.json'
import facetsData from '../data/facets.json'
import guidesData from '../data/guides.json'
// ── Recipes ──────────────────────────────────────────────
export const getAllRecipes = () =>
  recipesData.filter(r => r.published)

export const getRecipeBySlug = (slug) =>
  recipesData.find(r => r.slug === slug && r.published) || null

export const getRecipesByIngredient = (ingredientId) =>
  recipesData.filter(r => r.mainIngredient === ingredientId && r.published)

export const getRecipesByFacet = (ingredientId, facetSlug) =>
  recipesData.filter(r =>
    r.mainIngredient === ingredientId &&
    r.published &&
    (r.mealType === facetSlug ||
     r.timeBucket === facetSlug ||
     r.facetTags?.includes(facetSlug))
  )

export const getFeaturedRecipes = (limit = 6) =>
  recipesData
    .filter(r => r.featured && r.published)
    .sort((a, b) => b.searchPriority - a.searchPriority)
    .slice(0, limit)

export const getRelatedRecipes = (recipeId, limit = 3) => {
  const recipe = recipesData.find(r => r.id === recipeId)
  if (!recipe || !recipe.relatedRecipeIds) return []
  return recipe.relatedRecipeIds
    .map(id => recipesData.find(r => r.id === id && r.published))
    .filter(Boolean)
    .slice(0, limit)
}

export const searchRecipes = (query) => {
  const q = query.toLowerCase()
  return recipesData.filter(r =>
    r.published &&
    (r.title.toLowerCase().includes(q) ||
     r.mainIngredient.includes(q) ||
     r.description.toLowerCase().includes(q) ||
     r.secondaryIngredients?.some(i => i.toLowerCase().includes(q)))
  )
}

// ── Ingredients ───────────────────────────────────────────
export const getAllIngredients = () =>
  ingredientsData.filter(i => i.published)

export const getIngredientBySlug = (slug) =>
  ingredientsData.find(i => i.slug === slug && i.published) || null

export const getFeaturedIngredients = () =>
  ingredientsData.filter(i => i.featured && i.published)

// ── Facets ────────────────────────────────────────────────
export const getAllFacets = () =>
  facetsData.filter(f => f.published)

export const getFacetBySlug = (slug) =>
  facetsData.find(f => f.slug === slug && f.published) || null

export const getValidFacetsForIngredient = (ingredientId, minRecipes = 4) => {
  const facets = facetsData.filter(f => f.published)
  return facets.filter(facet => {
    const count = recipesData.filter(r =>
      r.mainIngredient === ingredientId &&
      r.published &&
      (r.mealType === facet.slug ||
       r.timeBucket === facet.slug ||
       r.facetTags?.includes(facet.slug))
    ).length
    return count >= minRecipes
  })
}
// ── Guides ────────────────────────────────────────────────
export const getAllGuides = () =>
  guidesData.filter(g => g.published).sort((a, b) => a.sortOrder - b.sortOrder)

export const getGuideBySlug = (slug) =>
  guidesData.find(g => g.slug === slug && g.published) || null
