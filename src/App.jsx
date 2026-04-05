import { Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getAllRecipes, getRecipeBySlug, getRecipesByIngredient, getRecipesByFacet,
  getFeaturedRecipes, getRelatedRecipes, searchRecipes,
  getAllIngredients, getIngredientBySlug, getFeaturedIngredients,
  getAllFacets, getFacetBySlug, getValidFacetsForIngredient,
  getAllGuides, getGuideBySlug
} from './lib/data.js'

// ── Design tokens ─────────────────────────────────────────
const C = {
  green: '#639922',
  greenDark: '#3B6D11',
  greenLight: '#EAF3DE',
  greenBorder: '#C0DD97',
  greenMid: '#97C459',
  text: '#1a2e0d',
  textMuted: '#5a7a40',
  textLight: '#8aa870',
  bg: '#ffffff',
  bgSoft: '#f8fdf4',
  bgHero: 'linear-gradient(135deg,#f0f7e6 0%,#e8f4db 50%,#f5faf0 100%)',
  border: '#e2eed8',
  borderLight: '#eef6e4',
  amber: '#FAEEDA',
  amberBorder: '#f5c96a',
  shadow: '0 2px 12px rgba(59,109,17,0.08)',
  shadowMd: '0 4px 24px rgba(59,109,17,0.12)',
}
const F = { display: "'Outfit', sans-serif", body: "'DM Sans', sans-serif", }
const FACET_LABELS = { 'meal-type': 'Meal Type', 'time': 'Time', 'constraint': 'Diet & Style' }

// ── Shared Components ─────────────────────────────────────

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: C.greenDark, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C6 2 3 5 3 9c0 2.8 1.6 5.2 4.5 5.8.4-3.2 2-6 4.5-7.8-1.5 2-2.5 5-2.5 7.8H9c3.5 0 7-3 7-7S12 2 9 2z" fill="#fff"/></svg>
          </div>
          <span style={{ fontFamily: F.display, fontSize: 16, fontWeight: 600, color: C.text, letterSpacing: '-0.03em' }}>
            Leftover<span style={{ color: C.green }}>Meal</span>Ideas
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ display: 'flex', gap: 24, fontFamily: F.body, fontSize: 14, color: C.textMuted }}>
            <Link to="/ingredients" style={{ color: C.textMuted, textDecoration: 'none' }}>Ingredients</Link>
            <Link to="/recipes" style={{ color: C.textMuted, textDecoration: 'none' }}>Recipes</Link>
            <Link to="/guides" style={{ color: C.textMuted, textDecoration: 'none' }}>Guides</Link>
          </div>
          <Link to="/recipes" style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontFamily: F.body, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Browse recipes
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px 24px', marginTop: 64 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: C.text }}>
          Leftover<span style={{ color: C.green }}>Meal</span>Ideas<span style={{ color: C.textLight, fontWeight: 400 }}>.com</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: C.textMuted, fontFamily: F.body }}>
          <Link to="/ingredients" style={{ color: C.textMuted, textDecoration: 'none' }}>Ingredients</Link>
          <Link to="/recipes" style={{ color: C.textMuted, textDecoration: 'none' }}>All Recipes</Link>
          <Link to="/guides" style={{ color: C.textMuted, textDecoration: 'none' }}>Guides</Link>
        </div>
        <div style={{ fontSize: 12, color: C.textLight, fontFamily: F.body }}>Free recipes · No sign-up · No food wasted</div>
      </div>
    </footer>
  )
}

function Tag({ label, color = C.greenLight, textColor = C.greenDark, small }) {
  return (
    <span style={{
      display: 'inline-block', background: color, color: textColor,
      borderRadius: 20, padding: small ? '2px 8px' : '3px 10px',
      fontSize: small ? 11 : 12, fontWeight: 500, fontFamily: F.body,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function RecipeCard({ recipe, to }) {
  const navigate = useNavigate()
  const isChicken = recipe.mainIngredient === 'leftover-chicken'
  return (
    <div
      onClick={() => navigate(to || `/recipes/${recipe.slug}`)}
      style={{
        border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden',
        cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s', background: C.bg,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenMid; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ height: 100, background: isChicken ? C.amber : C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
        {recipe.emoji}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontFamily: F.display, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3, marginBottom: 8 }}>{recipe.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tag label={recipe.mealType} small />
          <span style={{ fontSize: 12, color: C.textMuted, fontFamily: F.body }}>{recipe.cookTimeMinutes + recipe.prepTimeMinutes} min</span>
        </div>
      </div>
    </div>
  )
}

function IngredientCard({ ingredient }) {
  const navigate = useNavigate()
  const isChicken = ingredient.id === 'leftover-chicken'
  const recipes = getRecipesByIngredient(ingredient.id)
  return (
    <div
      onClick={() => navigate(`/ingredients/${ingredient.slug}`)}
      style={{
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        background: `linear-gradient(160deg, ${ingredient.colorFrom} 0%, ${ingredient.colorTo} 100%)`,
        minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        position: 'relative', transition: 'transform 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 64, opacity: 0.35, lineHeight: 1 }}>{ingredient.emoji}</div>
      <div style={{ position: 'absolute', top: 16, left: 20, background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: C.greenDark, fontFamily: F.body }}>{recipes.length} recipes</div>
      <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: F.display, fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 1px 4px rgba(0,0,0,.15)', marginBottom: 4 }}>{ingredient.name}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', marginBottom: 12, lineHeight: 1.4, fontFamily: F.body }}>{ingredient.description.substring(0, 70)}...</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ingredient.categoryTags.slice(0, 4).map(t => (
            <span key={t} style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500, border: '1px solid rgba(255,255,255,0.4)', fontFamily: F.body }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Breadcrumb({ items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.textMuted, fontFamily: F.body, flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span style={{ color: C.textLight }}>›</span>}
          {item.to ? <Link to={item.to} style={{ color: C.textMuted, textDecoration: 'none' }}>{item.label}</Link> : <span style={{ color: C.text }}>{item.label}</span>}
        </span>
      ))}
    </div>
  )
}

// ── Pages ─────────────────────────────────────────────────

function HomePage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()
  const ingredients = getFeaturedIngredients()
  const featured = getFeaturedRecipes(8)
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'under-15-minutes', label: 'Under 15 min' },
    { id: 'under-30-minutes', label: 'Under 30 min' },
    { id: 'budget', label: 'Budget' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'kid-friendly', label: 'Kid-friendly' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/recipes?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ background: C.bgHero, padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,153,34,0.06)', top: -120, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,153,34,0.07)', bottom: -80, left: '35%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: `1px solid ${C.greenBorder}`, borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 500, color: C.greenDark, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 20, fontFamily: F.body }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
            Stop wasting food · Start cooking smart
          </div>
          <h1 style={{ fontFamily: F.display, fontSize: 46, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 14, color: '#1a2e0d' }}>
            Turn any leftover into<br />a <span style={{ color: C.green }}>real meal</span>
          </h1>
          <p style={{ fontSize: 16, color: '#4a6a2a', lineHeight: 1.65, marginBottom: 28, fontFamily: F.body }}>
            Search by whatever's in your fridge. Instant ideas — no food wasted, no sign-up needed.
          </p>
          <form onSubmit={handleSearch} style={{ display: 'flex', background: '#fff', border: `1px solid ${C.greenBorder}`, borderRadius: 12, overflow: 'hidden', boxShadow: C.shadowMd }}>
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="What leftovers do you have? e.g. rice, chicken..."
              style={{ flex: 1, border: 'none', padding: '14px 18px', fontSize: 15, background: 'transparent', color: C.text, outline: 'none', fontFamily: F.body }}
            />
            <button type="submit" style={{ background: C.green, color: '#fff', border: 'none', padding: '14px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: F.body, whiteSpace: 'nowrap' }}>
              Find meals →
            </button>
          </form>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {filters.map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                style={{ border: `1px solid ${activeFilter === f.id ? C.green : C.greenBorder}`, color: activeFilter === f.id ? '#fff' : C.greenDark, background: activeFilter === f.id ? C.green : '#fff', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.15s' }}>
                {f.label}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[['70+', 'Recipes at launch'], ['2', 'Ingredient clusters'], ['8', 'Meal categories'], ['0', 'Sign-ups required']].map(([n, l]) => (
          <div key={l} style={{ padding: '18px 32px', borderRight: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.display, fontSize: 28, fontWeight: 600, color: C.greenDark, letterSpacing: '-0.03em' }}>{n}</div>
            <div style={{ fontSize: 13, color: C.textMuted, fontFamily: F.body }}>{l}</div>
          </div>
        ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Ingredients */}
        <div style={{ padding: '40px 0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 600, color: C.text }}>Browse by ingredient</h2>
            <Link to="/ingredients" style={{ fontSize: 14, color: C.green, textDecoration: 'none', fontFamily: F.body }}>All ingredients →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {ingredients.map(i => <IngredientCard key={i.id} ingredient={i} />)}
          </div>
        </div>

        {/* Popular recipes */}
        <div style={{ padding: '0 0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 600, color: C.text }}>Popular right now</h2>
            <Link to="/recipes" style={{ fontSize: 14, color: C.green, textDecoration: 'none', fontFamily: F.body }}>See all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {featured.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </div>

        {/* AdSense placeholder */}
        <div style={{ background: '#f9f9f9', border: `1px dashed ${C.border}`, borderRadius: 10, padding: 20, textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textLight, marginBottom: 4, fontFamily: F.body }}>Advertisement</div>
          <div style={{ fontSize: 13, color: C.textLight, fontFamily: F.body }}>Google AdSense — 728×90 Leaderboard</div>
        </div>

        {/* Amazon affiliate block */}
        <div style={{ background: C.bgSoft, border: `1px solid ${C.greenBorder}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: C.greenLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🛒</div>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 600, color: C.text }}>Tools that make leftovers easier</div>
              <div style={{ fontSize: 12, color: C.textMuted, fontFamily: F.body }}>Amazon affiliate · We earn a small commission at no cost to you</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              ['🥘','Meal prep containers','https://www.amazon.com/s?k=meal+prep+containers&tag=grqk6540-20'],
              ['🍳','Non-stick wok','https://www.amazon.com/s?k=non+stick+wok&tag=grqk6540-20'],
              ['🫙','Airtight food storage','https://www.amazon.com/s?k=airtight+food+storage+containers&tag=grqk6540-20'],
              ['🔪',"Chef's knife set",'https://www.amazon.com/s?k=chef+knife+set&tag=grqk6540-20'],
            ].map(([e, n, url]) => (
              <a key={n} href={url} target="_blank" rel="noopener noreferrer" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'block' }}
                onMouseEnter={ev => ev.currentTarget.style.borderColor = C.greenMid}
                onMouseLeave={ev => ev.currentTarget.style.borderColor = C.border}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{e}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 4, fontFamily: F.body }}>{n}</div>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 500, fontFamily: F.body }}>Shop on Amazon &#8594;</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function IngredientsPage() {
  const ingredients = getAllIngredients()
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Ingredients' }]} />
      <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 600, color: C.text, margin: '16px 0 8px', letterSpacing: '-0.03em' }}>Browse by Ingredient</h1>
      <p style={{ color: C.textMuted, fontSize: 15, fontFamily: F.body, marginBottom: 32, lineHeight: 1.6 }}>Pick an ingredient and we'll show you every meal idea we have for it.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {ingredients.map(i => <IngredientCard key={i.id} ingredient={i} />)}
      </div>
    </div>
  )
}

function IngredientPage() {
  const { ingredient: slug } = useParams()
  const ingredient = getIngredientBySlug(slug)
  const [activeFacet, setActiveFacet] = useState('all')
  const navigate = useNavigate()

  if (!ingredient) return <NotFound />

  const allRecipes = getRecipesByIngredient(ingredient.id)
  const validFacets = getValidFacetsForIngredient(ingredient.id)
  const filteredRecipes = activeFacet === 'all' ? allRecipes : getRecipesByFacet(ingredient.id, activeFacet)

  return (
    <div>
      {/* Ingredient hero */}
      <div style={{ background: `linear-gradient(135deg, ${ingredient.colorFrom} 0%, ${ingredient.colorTo} 100%)`, padding: '40px 24px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: 40, fontSize: 120, opacity: 0.2, lineHeight: 1 }}>{ingredient.emoji}</div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none', fontFamily: F.body }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>›</span>
            <Link to="/ingredients" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textDecoration: 'none', fontFamily: F.body }}>Ingredients</Link>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>›</span>
            <span style={{ color: '#fff', fontSize: 13, fontFamily: F.body }}>{ingredient.name}</span>
          </div>
          <h1 style={{ fontFamily: F.display, fontSize: 36, fontWeight: 600, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.12)', letterSpacing: '-0.03em', marginBottom: 8 }}>{ingredient.title}</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', maxWidth: 520, lineHeight: 1.6, fontFamily: F.body, marginBottom: 0 }}>{ingredient.description}</p>
          <div style={{ marginTop: 16, display: 'inline-block', background: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 500, color: ingredient.id === 'leftover-chicken' ? '#7a4a00' : C.greenDark, fontFamily: F.body }}>
            {allRecipes.length} recipes available
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Facet filters */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: C.textMuted, fontFamily: F.body, marginBottom: 10, fontWeight: 500 }}>Filter by:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setActiveFacet('all')}
              style={{ border: `1px solid ${activeFacet === 'all' ? C.green : C.border}`, background: activeFacet === 'all' ? C.green : '#fff', color: activeFacet === 'all' ? '#fff' : C.textMuted, borderRadius: 20, padding: '5px 14px', fontSize: 13, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.15s' }}>
              All ({allRecipes.length})
            </button>
            {validFacets.map(f => {
              const count = getRecipesByFacet(ingredient.id, f.slug).length
              return (
                <button key={f.id} onClick={() => setActiveFacet(f.slug)}
                  style={{ border: `1px solid ${activeFacet === f.slug ? C.green : C.border}`, background: activeFacet === f.slug ? C.green : '#fff', color: activeFacet === f.slug ? '#fff' : C.textMuted, borderRadius: 20, padding: '5px 14px', fontSize: 13, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.15s' }}>
                  {f.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Recipe grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 40 }}>
          {filteredRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>

        {/* Facet navigation cards */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }}>
          <h2 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 16 }}>Explore by category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {validFacets.slice(0, 6).map(f => (
              <Link key={f.id} to={`/ingredients/${slug}/${f.slug}`}
                style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', textDecoration: 'none', display: 'block', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenMid; e.currentTarget.style.background = C.greenLight }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}>
                <div style={{ fontFamily: F.display, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{ingredient.name} · {f.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted, fontFamily: F.body }}>{getRecipesByFacet(ingredient.id, f.slug).length} recipes</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FacetPage() {
  const { ingredient: ingSlug, facet: facetSlug } = useParams()
  const ingredient = getIngredientBySlug(ingSlug)
  const facet = getFacetBySlug(facetSlug)

  if (!ingredient || !facet) return <NotFound />

  const recipes = getRecipesByFacet(ingredient.id, facetSlug)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Ingredients', to: '/ingredients' },
        { label: ingredient.name, to: `/ingredients/${ingSlug}` },
        { label: facet.name },
      ]} />
      <div style={{ margin: '20px 0 8px' }}>
        <h1 style={{ fontFamily: F.display, fontSize: 30, fontWeight: 600, color: C.text, letterSpacing: '-0.03em', marginBottom: 8 }}>
          {ingredient.name} — {facet.name} Recipes
        </h1>
        <p style={{ color: C.textMuted, fontSize: 15, fontFamily: F.body, lineHeight: 1.6 }}>
          {recipes.length} recipes · {facet.description}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, margin: '28px 0 40px' }}>
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
        <Link to={`/ingredients/${ingSlug}`} style={{ color: C.green, fontSize: 14, textDecoration: 'none', fontFamily: F.body }}>← All {ingredient.name} recipes</Link>
      </div>
    </div>
  )
}

function RecipesPage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [activeIngredient, setActiveIngredient] = useState('all')
  const [activeMeal, setActiveMeal] = useState('all')

  const allRecipes = getAllRecipes()
  const ingredients = getAllIngredients()
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snacks']

  const filtered = allRecipes.filter(r => {
    const matchQuery = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase())
    const matchIng = activeIngredient === 'all' || r.mainIngredient === activeIngredient
    const matchMeal = activeMeal === 'all' || r.mealType === activeMeal
    return matchQuery && matchIng && matchMeal
  })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'All Recipes' }]} />
      <h1 style={{ fontFamily: F.display, fontSize: 30, fontWeight: 600, color: C.text, margin: '16px 0 24px', letterSpacing: '-0.03em' }}>All Recipes</h1>

      {/* Search and filters */}
      <div style={{ background: C.bgSoft, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: 20, marginBottom: 28 }}>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes..."
          style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 12, fontFamily: F.body, color: C.text, background: '#fff', outline: `2px solid transparent` }} />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, fontFamily: F.body, marginBottom: 6, fontWeight: 500 }}>Ingredient</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ id: 'all', name: 'All' }, ...ingredients].map(i => (
                <button key={i.id} onClick={() => setActiveIngredient(i.id)}
                  style={{ border: `1px solid ${activeIngredient === i.id ? C.green : C.border}`, background: activeIngredient === i.id ? C.green : '#fff', color: activeIngredient === i.id ? '#fff' : C.textMuted, borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontFamily: F.body }}>
                  {i.name || i.id}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textMuted, fontFamily: F.body, marginBottom: 6, fontWeight: 500 }}>Meal type</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['all', ...mealTypes].map(m => (
                <button key={m} onClick={() => setActiveMeal(m)}
                  style={{ border: `1px solid ${activeMeal === m ? C.green : C.border}`, background: activeMeal === m ? C.green : '#fff', color: activeMeal === m ? '#fff' : C.textMuted, borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontFamily: F.body, textTransform: 'capitalize' }}>
                  {m === 'all' ? 'All' : m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textMuted, fontFamily: F.body, marginBottom: 16 }}>{filtered.length} recipes found</div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: C.textMuted, fontFamily: F.body }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>No recipes found</div>
          <div style={{ fontSize: 14 }}>Try a different search or remove a filter</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}

function RecipePage() {
  const { slug } = useParams()
  const recipe = getRecipeBySlug(slug)
  const ingredient = recipe ? getIngredientBySlug(recipe.mainIngredient) : null
  const related = recipe ? getRelatedRecipes(recipe.id) : []

  if (!recipe || !ingredient) return <NotFound />

  const totalTime = recipe.cookTimeMinutes + recipe.prepTimeMinutes
  const isChicken = recipe.mainIngredient === 'leftover-chicken'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: ingredient.name, to: `/ingredients/${ingredient.slug}` },
        { label: recipe.title },
      ]} />

      {/* Recipe hero */}
      <div style={{ margin: '20px 0 28px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Tag label={recipe.mealType} />
          <Tag label={recipe.difficulty} color="#fff" textColor={C.greenDark} />
          {recipe.facetTags?.map(t => <Tag key={t} label={t} color="#f0f0f0" textColor="#555" />)}
        </div>
        <h1 style={{ fontFamily: F.display, fontSize: 34, fontWeight: 600, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 12 }}>{recipe.title}</h1>
        <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.65, fontFamily: F.body, marginBottom: 20 }}>{recipe.description}</p>

        {/* Time/serving stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
          {[['⏱', 'Prep', `${recipe.prepTimeMinutes} min`], ['🍳', 'Cook', `${recipe.cookTimeMinutes} min`], ['⏰', 'Total', `${totalTime} min`], ['🍽', 'Serves', recipe.servings]].map(([e, l, v]) => (
            <div key={l} style={{ background: isChicken ? '#fffcf5' : C.bgSoft, border: `1px solid ${isChicken ? C.amberBorder : C.greenBorder}`, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{e}</div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{l}</div>
              <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 600, color: C.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36 }}>
        {/* Ingredients */}
        <div style={{ background: C.bgSoft, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontFamily: F.display, fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 14 }}>Ingredients</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${C.borderLight}` : 'none', fontSize: 14, color: C.text, fontFamily: F.body, lineHeight: 1.4 }}>
                <span style={{ color: C.green, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>·</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div>
          <div style={{ background: isChicken ? '#fffcf5' : C.greenLight, border: `1px solid ${isChicken ? C.amberBorder : C.greenBorder}`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
            <div style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>💡 Pro tip</div>
            <div style={{ fontSize: 14, color: C.textMuted, fontFamily: F.body, lineHeight: 1.6 }}>{recipe.tips}</div>
          </div>
          {recipe.styleTags?.length > 0 && (
            <div>
              <div style={{ fontSize: 12, color: C.textMuted, fontFamily: F.body, marginBottom: 6, fontWeight: 500 }}>Style</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {recipe.styleTags.map(t => <Tag key={t} label={t} color="#f5f5f5" textColor="#666" small />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 18 }}>Method</h2>
        <ol style={{ listStyle: 'none', padding: 0 }}>
          {recipe.steps?.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.green, color: '#fff', fontFamily: F.display, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ fontSize: 15, color: C.text, fontFamily: F.body, lineHeight: 1.65, paddingTop: 4 }}>{step}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* Amazon CTA */}
      <div style={{ background: C.bgSoft, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: 20, marginBottom: 40 }}>
        <div style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>🛒 Tools for this recipe</div>
        <div style={{ fontSize: 13, color: C.textMuted, fontFamily: F.body, marginBottom: 12 }}>Amazon affiliate — we earn a small commission at no extra cost to you.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['Non-stick wok','https://www.amazon.com/s?k=non+stick+wok&tag=grqk6540-20'],
            ["Chef's knife",'https://www.amazon.com/s?k=chef+knife+set&tag=grqk6540-20'],
            ['Meal prep containers','https://www.amazon.com/s?k=meal+prep+containers&tag=grqk6540-20'],
          ].map(([t, url]) => (
            <a key={t} href={url} target="_blank" rel="noopener noreferrer" style={{ border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, color: C.green, fontWeight: 500, fontFamily: F.body, textDecoration: 'none' }}>{t} &#8594;</a>
          ))}
        </div>
      </div>

      {/* Related recipes */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 16 }}>You might also like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {related.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function GuidesPage() {
  const navigate = useNavigate()
  const guides = getAllGuides()
 
  const storage = guides.filter(g => g.guideType === 'storage')
  const reheating = guides.filter(g => g.guideType === 'reheating')
  const safety = guides.filter(g => g.guideType === 'safety')
 
  const TYPE_META = {
    storage:   { label: 'Storage',      emoji: '🫙', color: C.greenLight,  border: C.greenBorder },
    reheating: { label: 'Reheating',    emoji: '🔥', color: C.amber,       border: C.amberBorder },
    safety:    { label: 'Food Safety',  emoji: '✅', color: '#EEF5FF',     border: '#B8D0F5' },
  }
 
  function GuideCard({ guide }) {
    const meta = TYPE_META[guide.guideType]
    return (
      <div
        onClick={() => navigate(`/guides/${guide.slug}`)}
        style={{
          border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px',
          cursor: 'pointer', background: C.bg, transition: 'border-color 0.15s, transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.greenMid; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ background: meta.color, border: `1px solid ${meta.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 500, color: C.text, fontFamily: F.body }}>
            {meta.emoji} {meta.label}
          </span>
          <span style={{ fontSize: 12, color: C.textLight, fontFamily: F.body }}>{guide.readTime} min read</span>
        </div>
        <div style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.3, marginBottom: 8 }}>{guide.title}</div>
        <div style={{ fontSize: 13, color: C.textMuted, fontFamily: F.body, lineHeight: 1.55 }}>{guide.excerpt}</div>
        <div style={{ marginTop: 12, fontSize: 12, color: C.green, fontFamily: F.body, fontWeight: 500 }}>Read guide →</div>
      </div>
    )
  }
 
  function Section({ title, guides, type }) {
    const meta = TYPE_META[type]
    if (!guides.length) return null
    return (
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: meta.color, border: `1px solid ${meta.border}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{meta.emoji}</div>
          <h2 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 600, color: C.text, margin: 0 }}>{title}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {guides.map(g => <GuideCard key={g.id} guide={g} />)}
        </div>
      </div>
    )
  }
 
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Guides' }]} />
      <h1 style={{ fontFamily: F.display, fontSize: 30, fontWeight: 600, color: C.text, margin: '16px 0 8px', letterSpacing: '-0.03em' }}>Guides</h1>
      <p style={{ color: C.textMuted, fontSize: 15, fontFamily: F.body, marginBottom: 40, lineHeight: 1.6 }}>
        Storage tips, reheating guides, and food safety articles — everything you need to make the most of your leftovers.
      </p>
      <Section title="Storage Tips"       guides={storage}   type="storage" />
      <Section title="Reheating Guides"   guides={reheating} type="reheating" />
      <Section title="Food Safety"        guides={safety}    type="safety" />
    </div>
  )
}

function GuidePage() {
  const { slug } = useParams()
  const guide = getGuideBySlug(slug)
 
  if (!guide) return <NotFound />
 
  const TYPE_META = {
    storage:   { label: 'Storage Tips', emoji: '🫙', color: C.greenLight, border: C.greenBorder },
    reheating: { label: 'Reheating',    emoji: '🔥', color: C.amber,      border: C.amberBorder },
    safety:    { label: 'Food Safety',  emoji: '✅', color: '#EEF5FF',    border: '#B8D0F5' },
    faq:       { label: 'FAQ',          emoji: '❓', color: '#F5F0FF',    border: '#C8B8F5' },
  }
  const meta = TYPE_META[guide.guideType] || TYPE_META.faq
 
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 64px' }}>
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: 'Guides', to: '/guides' },
        { label: guide.title },
      ]} />
 
      {/* Hero */}
      <div style={{ margin: '20px 0 32px' }}>
        <span style={{ background: meta.color, border: `1px solid ${meta.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: C.text, fontFamily: F.body }}>
          {meta.emoji} {meta.label}
        </span>
        <h1 style={{ fontFamily: F.display, fontSize: 32, fontWeight: 600, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.2, margin: '14px 0 10px' }}>{guide.title}</h1>
        <p style={{ fontSize: 16, color: C.textMuted, fontFamily: F.body, lineHeight: 1.65, marginBottom: 0 }}>{guide.description}</p>
        <div style={{ fontSize: 13, color: C.textLight, fontFamily: F.body, marginTop: 8 }}>{guide.readTime} min read</div>
      </div>
 
      {/* Key Takeaways */}
      {guide.keyTakeaways?.length > 0 && (
        <div style={{ background: C.bgSoft, border: `1px solid ${C.greenBorder}`, borderRadius: 14, padding: '18px 20px', marginBottom: 36 }}>
          <div style={{ fontFamily: F.display, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 12 }}>⚡ Key Takeaways</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {guide.keyTakeaways.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0', fontSize: 14, color: C.text, fontFamily: F.body, lineHeight: 1.5 }}>
                <span style={{ color: C.green, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
 
      {/* Content sections */}
      <div style={{ marginBottom: 48 }}>
        {guide.sections?.map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 10, letterSpacing: '-0.02em' }}>{section.heading}</h2>
            <p style={{ fontSize: 15, color: C.text, fontFamily: F.body, lineHeight: 1.75, margin: 0 }}>{section.body}</p>
          </div>
        ))}
      </div>
 
      {/* AdSense placeholder */}
      <div style={{ background: '#f9f9f9', border: `1px dashed ${C.border}`, borderRadius: 10, padding: 20, textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textLight, marginBottom: 4, fontFamily: F.body }}>Advertisement</div>
        <div style={{ fontSize: 13, color: C.textLight, fontFamily: F.body }}>Google AdSense</div>
      </div>
 
      {/* Back link */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
        <Link to="/guides" style={{ color: C.green, fontSize: 14, textDecoration: 'none', fontFamily: F.body }}>← All Guides</Link>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
      <h1 style={{ fontFamily: F.display, fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: C.textMuted, fontFamily: F.body, marginBottom: 24 }}>This page doesn't exist. Try browsing recipes instead.</p>
      <Link to="/" style={{ background: C.green, color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, fontFamily: F.body, textDecoration: 'none' }}>Back to home</Link>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────
export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/ingredients/:ingredient" element={<IngredientPage />} />
          <Route path="/ingredients/:ingredient/:facet" element={<FacetPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:slug" element={<RecipePage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
