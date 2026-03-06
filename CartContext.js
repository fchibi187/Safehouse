import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: action.quantity }]
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        )
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'LOAD_CART':
      return { ...state, items: action.items }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    const saved = localStorage.getItem('linaroos-cart')
    if (saved) dispatch({ type: 'LOAD_CART', items: JSON.parse(saved) })
  }, [])

  useEffect(() => {
    localStorage.setItem('linaroos-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', product, quantity })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id })
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, total, count, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
