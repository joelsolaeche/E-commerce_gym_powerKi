# Redux Integration for Gym E-commerce

This document explains how the Redux integration has been set up to connect the front-end React application with the back-end Spring Boot API.

## Overview

The Redux implementation follows a modern approach using Redux Toolkit and RTK Query for API calls. The implementation includes:

1. A centralized store configuration
2. API slices for different resources (products, cart, auth, categories)
3. Custom hooks to interact with the Redux store
4. Fallback to local state when offline or not authenticated

## Directory Structure

```
src/
├── store/
│   ├── index.js                # Main store configuration
│   ├── api.js                  # Base API configuration
│   └── slices/
│       ├── authSlice.js        # Authentication slice
│       ├── cartSlice.js        # Cart slice
│       ├── productSlice.js     # Products slice
│       └── categorySlice.js    # Categories slice
├── hooks/
│   ├── index.js                # Export all hooks
│   ├── useReduxAuth.js         # Authentication hook
│   ├── useReduxCart.js         # Cart hook
│   ├── useReduxProducts.js     # Products hook
│   └── useReduxCategories.js   # Categories hook
└── config.js                   # Configuration file
```

## Setup

Redux is already set up and integrated with the application. The store is provided to the app in `main.jsx`:

```jsx
import { Provider } from 'react-redux'
import store from './store'

// ...

<Provider store={store}>
  <App />
</Provider>
```

## Usage

### Authentication

```jsx
import { useReduxAuth } from '../hooks';

function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useReduxAuth();
  
  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (result.success) {
      // Navigate to dashboard or home page
    }
  };
  
  // ... rest of component
}
```

### Products

```jsx
import { useReduxProducts } from '../hooks';

function ProductsPage() {
  const { products, isLoading, error } = useReduxProducts();
  
  // ... rest of component that displays products
}
```

### Cart

```jsx
import { useReduxCart } from '../hooks';

function CartPage() {
  const { cart, total, itemCount, addToCart, updateQuantity, removeFromCart } = useReduxCart();
  
  // ... rest of component that manages the cart
}
```

### Categories

```jsx
import { useReduxCategories } from '../hooks';

function CategoriesPage() {
  const { categories, isLoading, error } = useReduxCategories();
  
  // ... rest of component that displays categories
}
```

## Configuration

The API base URL is configured in `src/config.js`. Update this file if your backend API is hosted at a different URL.

## Offline Support

The cart functionality provides offline support using local Redux state when the user is not authenticated. When the user logs in, the cart will be synchronized with the server.

## Error Handling

All API calls have built-in error handling. Check the `error` property returned by the hooks to display error messages to the user.

## Next Steps

1. Replace the existing Context API implementations with the Redux hooks
2. Test the API connections and error handling
3. Implement loading states and error messages in the UI 