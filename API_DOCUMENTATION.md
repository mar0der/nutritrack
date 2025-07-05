# NutriTrack API Documentation

## Introduction
Welcome to the NutriTrack API documentation. This API provides endpoints for managing nutritional tracking, including consumption logs, dishes, ingredients, and personalized dish recommendations. It is designed to support frontend applications by offering a RESTful interface to interact with the backend database.

**Base URL**: `/api`

**Authentication**: This documentation assumes no explicit authentication is required for the endpoints. If authentication is implemented, ensure to include appropriate headers or tokens as per your security setup.

## Consumption Endpoints

### Get Consumption Logs
- **Method**: GET
- **URL**: `/api/consumption`
- **Query Parameters**:
  - `days` (optional, default: 30): Number of days to look back for consumption logs.
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    [
      {
        "id": "uuid",
        "consumedAt": "2025-07-01T12:00:00Z",
        "quantity": 100,
        "unit": "g",
        "ingredientId": "uuid",
        "ingredient": { ... },
        "dishId": "uuid",
        "dish": {
          "dishIngredients": [
            {
              "ingredient": { ... }
            }
          ]
        }
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to fetch consumption logs" }`

### Log Consumption
- **Method**: POST
- **URL**: `/api/consumption`
- **Request Body**:
  - Based on `CreateConsumptionLogSchema`:
    - `ingredientId` (optional): ID of the ingredient consumed.
    - `dishId` (optional): ID of the dish consumed. (Either `ingredientId` or `dishId` must be provided)
    - `quantity` (required): Positive number representing the amount consumed.
    - `unit` (optional): Unit of measurement (e.g., "g", "ml").
    - `consumedAt` (optional): String representing when the consumption occurred. Defaults to current time if not provided.
  - **Example**:
    ```json
    {
      "ingredientId": "uuid",
      "quantity": 100,
      "unit": "g",
      "consumedAt": "2025-07-01T12:00:00Z"
    }
    ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**: Returns the created log with associated ingredient or dish details.
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to create consumption log" }`

### Get Recently Consumed Ingredients
- **Method**: GET
- **URL**: `/api/consumption/recent-ingredients`
- **Query Parameters**:
  - `days` (optional, default: 7): Number of days to look back for recently consumed ingredients.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of unique ingredient IDs that were recently consumed directly or as part of a dish.
    ```json
    ["uuid1", "uuid2", "uuid3"]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to fetch recent ingredients" }`

## Dishes Endpoints

### Get All Dishes
- **Method**: GET
- **URL**: `/api/dishes`
- **Query Parameters**:
  - `search` (optional): Search term to filter dishes by name (case-insensitive).
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of dish objects, ordered alphabetically by name.
    ```json
    [
      {
        "id": "uuid",
        "name": "Vegetable Stir Fry",
        "description": "A healthy mix of vegetables",
        "instructions": "Chop and cook vegetables...",
        "dishIngredients": [
          {
            "ingredient": { ... }
          }
        ]
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to fetch dishes" }`

### Get Dish by ID
- **Method**: GET
- **URL**: `/api/dishes/:id`
- **URL Parameters**:
  - `id`: Unique identifier of the dish.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Dish object with associated ingredients.
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "error": "Dish not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to fetch dish" }`

### Create New Dish
- **Method**: POST
- **URL**: `/api/dishes`
- **Request Body**:
  - Based on `CreateDishSchema`:
    - `name` (required): Name of the dish.
    - `description` (optional): Description of the dish.
    - `instructions` (optional): Cooking instructions.
    - `ingredients` (required): Array of ingredient objects with `ingredientId`, `quantity` (positive number), and `unit`.
  - **Example**:
    ```json
    {
      "name": "Vegetable Stir Fry",
      "description": "A healthy mix of vegetables",
      "instructions": "Chop and cook vegetables...",
      "ingredients": [
        { "ingredientId": "uuid1", "quantity": 100, "unit": "g" },
        { "ingredientId": "uuid2", "quantity": 50, "unit": "g" }
      ]
    }
    ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**: Created dish object with associated ingredients.
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to create dish" }`

### Update Dish
- **Method**: PUT
- **URL**: `/api/dishes/:id`
- **URL Parameters**:
  - `id`: Unique identifier of the dish.
- **Request Body**:
  - Based on `UpdateDishSchema` (partial update allowed):
    - Same fields as `CreateDishSchema`, all optional.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Updated dish object with associated ingredients.
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "error": "Dish not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to update dish" }`

### Delete Dish
- **Method**: DELETE
- **URL**: `/api/dishes/:id`
- **URL Parameters**:
  - `id`: Unique identifier of the dish.
- **Success Response**:
  - **Code**: 204 No Content
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "error": "Dish not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to delete dish" }`

## Ingredients Endpoints

### Get All Ingredients
- **Method**: GET
- **URL**: `/api/ingredients`
- **Query Parameters**:
  - `search` (optional): Search term to filter ingredients by name (case-insensitive).
  - `category` (optional): Filter ingredients by category.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of ingredient objects, ordered alphabetically by name.
    ```json
    [
      {
        "id": "uuid",
        "name": "Broccoli",
        "category": "Vegetable",
        "nutritionalInfo": { ... }
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to fetch ingredients" }`

### Get Ingredient by ID
- **Method**: GET
- **URL**: `/api/ingredients/:id`
- **URL Parameters**:
  - `id`: Unique identifier of the ingredient.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Ingredient object with associated dish information.
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "error": "Ingredient not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to fetch ingredient" }`

### Create New Ingredient
- **Method**: POST
- **URL**: `/api/ingredients`
- **Request Body**:
  - Based on `CreateIngredientSchema`:
    - `name` (required): Name of the ingredient.
    - `category` (required): Category of the ingredient.
    - `nutritionalInfo` (optional): Object containing nutritional data.
  - **Example**:
    ```json
    {
      "name": "Broccoli",
      "category": "Vegetable",
      "nutritionalInfo": {
        "calories": 55,
        "protein": 3.7
      }
    }
    ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**: Created ingredient object.
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**: `{ "error": "Ingredient name already exists" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to create ingredient" }`

### Update Ingredient
- **Method**: PUT
- **URL**: `/api/ingredients/:id`
- **URL Parameters**:
  - `id`: Unique identifier of the ingredient.
- **Request Body**:
  - Based on `UpdateIngredientSchema` (partial update allowed):
    - Same fields as `CreateIngredientSchema`, all optional.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Updated ingredient object.
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "error": "Ingredient not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to update ingredient" }`

### Delete Ingredient
- **Method**: DELETE
- **URL**: `/api/ingredients/:id`
- **URL Parameters**:
  - `id`: Unique identifier of the ingredient.
- **Success Response**:
  - **Code**: 204 No Content
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**: `{ "error": "Ingredient not found" }`
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to delete ingredient" }`

## Recommendations Endpoints

### Get Dish Recommendations
- **Method**: GET
- **URL**: `/api/recommendations`
- **Query Parameters**:
  - `days` (optional, default: 7): Number of days to look back for consumption history.
  - `limit` (optional, default: 10): Maximum number of recommendations to return.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of recommended dish objects, sorted by freshness score (dishes with ingredients not recently consumed are prioritized).
    ```json
    [
      {
        "id": "uuid",
        "name": "Vegetable Stir Fry",
        "description": "A healthy mix of vegetables",
        "instructions": "Chop and cook vegetables...",
        "dishIngredients": [ ... ],
        "freshnessScore": 1,
        "recentIngredients": 0,
        "totalIngredients": 3,
        "reason": "All ingredients are fresh (not recently consumed)"
      },
      ...
    ]
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**: `{ "error": "Failed to generate recommendations" }`

## Additional Notes
- All datetime fields (like `consumedAt`) should be provided in ISO format (e.g., `2025-07-01T12:00:00Z`).
- The API uses Prisma for database operations, which may influence the structure of nested responses (e.g., including related data like ingredients in dishes).
- Ensure that IDs provided in requests are valid UUIDs or as per your database schema.
