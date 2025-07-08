# Mobile API Documentation

## Overview
This document provides the API specification for implementing NutriTrack mobile applications (Android/iOS). The API is fully functional and ready for mobile integration.

## Base Configuration
- **Production API Base URL**: `https://api.nerdstips.com/v1`
- **Development API Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer tokens

## Authentication

### 1. Email/Password Registration
**POST** `/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```
**Response 201:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": null,
    "provider": "email",
    "emailVerified": false
  },
  "token": "jwt_token_here"
}
```

### 2. Email/Password Login
**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response 200:** Same as signup response

### 3. Google OAuth (Mobile Implementation)
**GET** `/auth/google`
- Redirects to Google OAuth consent screen
- Use WebView or system browser for OAuth flow
- Google redirects to: `https://api.nerdstips.com/v1/auth/google/callback`
- Backend redirects to: `https://nerdstips.com/auth/callback?token=JWT_TOKEN`
- Extract token from URL parameters

### 4. Get Current User
**GET** `/auth/me`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "https://lh3.googleusercontent.com/...",
  "provider": "google",
  "emailVerified": true,
  "preferences": {
    "id": "pref_id",
    "userId": "user_id",
    "avoidPeriodDays": 7,
    "dietaryRestrictions": [],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 5. Logout
**POST** `/auth/logout`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
{
  "message": "Logged out successfully"
}
```

## Ingredients

### 1. Get All Ingredients
**GET** `/ingredients`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
[
  {
    "id": "ingredient_id",
    "name": "Tomato",
    "category": "Vegetables",
    "nutritionPer100g": {
      "calories": 18,
      "protein": 0.9,
      "carbs": 3.9,
      "fat": 0.2,
      "fiber": 1.2
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### 2. Create Ingredient
**POST** `/ingredients`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Ingredient Name",
  "category": "Category",
  "nutritionPer100g": {
    "calories": 100,
    "protein": 5.0,
    "carbs": 20.0,
    "fat": 2.0,
    "fiber": 3.0
  }
}
```

### 3. Update Ingredient
**PUT** `/ingredients/:id`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Updated Name",
  "category": "Updated Category",
  "nutritionPer100g": {
    "calories": 120,
    "protein": 6.0,
    "carbs": 22.0,
    "fat": 2.5,
    "fiber": 3.5
  }
}
```

### 4. Delete Ingredient
**DELETE** `/ingredients/:id`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
{
  "message": "Ingredient deleted successfully"
}
```

## Dishes

### 1. Get All Dishes
**GET** `/dishes`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
[
  {
    "id": "dish_id",
    "name": "Tomato Salad",
    "description": "Fresh tomato salad",
    "instructions": "Mix tomatoes with dressing",
    "servings": 2,
    "userId": "user_id",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "ingredients": [
      {
        "id": "dish_ingredient_id",
        "dishId": "dish_id",
        "ingredientId": "ingredient_id",
        "quantity": 200,
        "unit": "grams",
        "ingredient": {
          "id": "ingredient_id",
          "name": "Tomato",
          "category": "Vegetables",
          "nutritionPer100g": {
            "calories": 18,
            "protein": 0.9,
            "carbs": 3.9,
            "fat": 0.2,
            "fiber": 1.2
          }
        }
      }
    ]
  }
]
```

### 2. Create Dish
**POST** `/dishes`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Dish Name",
  "description": "Dish description",
  "instructions": "Cooking instructions",
  "servings": 4,
  "ingredients": [
    {
      "ingredientId": "ingredient_id",
      "quantity": 100,
      "unit": "grams"
    }
  ]
}
```

### 3. Update Dish
**PUT** `/dishes/:id`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "name": "Updated Dish Name",
  "description": "Updated description",
  "instructions": "Updated instructions",
  "servings": 2,
  "ingredients": [
    {
      "ingredientId": "ingredient_id",
      "quantity": 150,
      "unit": "grams"
    }
  ]
}
```

### 4. Delete Dish
**DELETE** `/dishes/:id`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
{
  "message": "Dish deleted successfully"
}
```

## Consumption Tracking

### 1. Log Consumption
**POST** `/consumption`
**Headers:** `Authorization: Bearer <token>`
```json
{
  "type": "ingredient",
  "itemId": "ingredient_id",
  "quantity": 100,
  "unit": "grams",
  "consumedAt": "2025-01-01T12:00:00.000Z"
}
```
**Or for dishes:**
```json
{
  "type": "dish",
  "itemId": "dish_id",
  "servings": 1,
  "consumedAt": "2025-01-01T12:00:00.000Z"
}
```

### 2. Get Consumption History
**GET** `/consumption?days=7`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `days`: Number of days to retrieve (default: 7)
- `startDate`: Start date in ISO format
- `endDate`: End date in ISO format

**Response 200:**
```json
[
  {
    "id": "consumption_id",
    "userId": "user_id",
    "type": "ingredient",
    "ingredientId": "ingredient_id",
    "dishId": null,
    "quantity": 100,
    "unit": "grams",
    "servings": null,
    "consumedAt": "2025-01-01T12:00:00.000Z",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "ingredient": {
      "id": "ingredient_id",
      "name": "Tomato",
      "category": "Vegetables"
    }
  }
]
```

### 3. Delete Consumption Entry
**DELETE** `/consumption/:id`
**Headers:** `Authorization: Bearer <token>`
**Response 200:**
```json
{
  "message": "Consumption entry deleted successfully"
}
```

## Recommendations

### 1. Get Dish Recommendations
**GET** `/recommendations/dishes`
**Headers:** `Authorization: Bearer <token>`
**Query Parameters:**
- `days`: Period for freshness calculation (default: 7)
- `limit`: Number of recommendations (default: 10)

**Response 200:**
```json
[
  {
    "dish": {
      "id": "dish_id",
      "name": "Fresh Salad",
      "description": "Healthy salad",
      "servings": 2,
      "ingredients": [
        {
          "ingredient": {
            "id": "ingredient_id",
            "name": "Lettuce",
            "category": "Vegetables"
          },
          "quantity": 100,
          "unit": "grams"
        }
      ]
    },
    "score": 0.85,
    "explanation": "Contains 85% fresh ingredients not consumed recently"
  }
]
```

## Error Responses

### Authentication Errors
**401 Unauthorized:**
```json
{
  "error": "Invalid token"
}
```

### Validation Errors
**400 Bad Request:**
```json
{
  "error": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Server Errors
**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Mobile Implementation Notes

### 1. Token Storage
- Store JWT tokens securely (Keychain on iOS, KeyStore on Android)
- Include token in Authorization header: `Bearer <token>`
- Tokens expire after 7 days

### 2. OAuth Flow for Mobile
- Use WebView or system browser for Google OAuth
- Handle redirect to extract token from URL
- Store token and redirect to app's main screen

### 3. Error Handling
- Implement retry logic for network errors
- Handle 401 errors by clearing token and redirecting to login
- Show user-friendly error messages for validation errors

### 4. Data Synchronization
- Implement offline-first approach if needed
- Cache frequently accessed data (ingredients, dishes)
- Sync consumption logs when online

### 5. API Rate Limiting
- No explicit rate limiting currently implemented
- Use reasonable request intervals for real-time features

## Health Check
**GET** `/health`
**Response 200:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Additional Notes
- All timestamps are in ISO 8601 format
- Nutritional values are per 100g for ingredients
- Quantities can be in grams, ml, pieces, etc.
- User preferences include dietary restrictions and recommendation settings
- The API supports CORS for web applications