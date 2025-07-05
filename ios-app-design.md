# NutriTrack iOS App Design Document

## Overview
NutriTrack is a mobile nutrition tracking application built with Flutter that promotes dietary variety by tracking ingredients and providing smart dish recommendations. The app connects to the existing Node.js/Express backend API to provide a seamless cross-platform experience.

## App Architecture

### Technology Stack
- **Framework**: Flutter (Dart)
- **State Management**: Provider or Riverpod
- **HTTP Client**: Dio or http package
- **Local Storage**: SharedPreferences + Hive/SQLite
- **Navigation**: GoRouter or Navigator 2.0
- **UI Components**: Material Design 3 with custom theming

### Backend Integration
- **API Base URL**: Configurable (development/production)
- **Endpoints**: Full REST API integration with existing backend
- **Authentication**: Ready for future JWT implementation
- **Offline Support**: Cache data locally for basic functionality

## User Interface Design

### Design System

#### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #1D4ED8)
- **Secondary**: Green accent (#10B981)
- **Background**: Light gray (#F9FAFB)
- **Surface**: White (#FFFFFF)
- **Error**: Red (#EF4444)
- **Warning**: Amber (#F59E0B)
- **Success**: Green (#10B981)

#### Typography
- **Heading**: Inter Bold (24px, 20px, 18px)
- **Body**: Inter Regular (16px, 14px)
- **Caption**: Inter Medium (12px, 10px)

#### Spacing & Layout
- **Base Unit**: 8px
- **Card Padding**: 16px
- **Screen Margins**: 20px
- **Button Height**: 48px
- **Input Height**: 52px

## Screen Structure & Navigation

### Bottom Navigation Bar
1. **Home** 🏠 - Dashboard and overview
2. **Ingredients** 🥕 - Ingredient management
3. **Dishes** 🍽️ - Recipe collection
4. **Track** 📊 - Consumption logging
5. **Recommendations** ✨ - Smart suggestions

### Screen Specifications

## 1. Home Screen (Dashboard)

### Layout
```
┌─────────────────────────────┐
│ [Profile] NutriTrack [Menu] │ Header
├─────────────────────────────┤
│ Welcome back, User!         │ Greeting
│                             │
│ ┌─────────────────────────┐ │ 
│ │ Today's Summary         │ │ Summary Card
│ │ 🥗 3 dishes logged      │ │
│ │ 🥕 8 ingredients        │ │
│ │ ⭐ 95% variety score    │ │
│ └─────────────────────────┘ │
│                             │
│ Quick Actions               │ Section Title
│ ┌───────┐ ┌───────┐        │
│ │ Log   │ │ Add   │        │ Action Buttons
│ │ Meal  │ │ Recipe│        │
│ └───────┘ └───────┘        │
│                             │
│ Recent Activity             │ Activity Feed
│ • Spinach Salad (2h ago)   │
│ • Protein Bowl (4h ago)    │
│ • [View All]               │
└─────────────────────────────┘
```

### Features
- Daily nutrition variety score
- Quick meal logging
- Recent consumption timeline
- Motivational insights
- Progress tracking widgets

## 2. Ingredients Screen

### Layout
```
┌─────────────────────────────┐
│ Ingredients        [+] Add  │ Header with Add Button
├─────────────────────────────┤
│ [🔍 Search ingredients...] │ Search Bar
│ [All ▼] [Vegetables ▼]     │ Filter Chips
├─────────────────────────────┤
│ Vegetables                  │ Category Section
│ ┌─────────────────────────┐ │
│ │ 🥬 Spinach              │ │ Ingredient Card
│ │ Fresh, leafy green      │ │
│ │ Last used: 2 days ago   │ │
│ │ [Edit] [Delete]         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🥕 Carrots              │ │
│ │ Orange root vegetable   │ │
│ │ Last used: 5 days ago   │ │
│ │ [Edit] [Delete]         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Features
- **Search & Filter**: Real-time search with category filters
- **Ingredient Cards**: Name, category, last consumed, nutritional info
- **Quick Actions**: Edit, delete, mark as favorite
- **Add New**: Bottom sheet form with auto-suggestions
- **Sorting**: By name, category, last used, frequency

### Add/Edit Ingredient Modal
```
┌─────────────────────────────┐
│ Add New Ingredient    [✕]   │
├─────────────────────────────┤
│ Name *                      │
│ [Tomato____________]        │
│                             │
│ Category *                  │
│ [Vegetables ▼]              │
│                             │
│ Nutritional Info (Optional) │
│ Calories: [25_____] per 100g│
│ Protein:  [1.1____] g       │
│ Carbs:    [5.8____] g       │
│                             │
│        [Cancel] [Save]      │
└─────────────────────────────┘
```

## 3. Dishes Screen

### Layout
```
┌─────────────────────────────┐
│ My Recipes         [+] Add  │ Header
├─────────────────────────────┤
│ [🔍 Search recipes...]      │ Search Bar
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 🥗 Mediterranean Bowl   │ │ Recipe Card
│ │ 4 ingredients • 25 min  │ │
│ │ 🥕🍅🫒🧄              │ │ Ingredient Icons
│ │                         │ │
│ │ Freshness: ████████░░   │ │ Freshness Bar
│ │ 8/10 fresh ingredients  │ │
│ │                         │ │
│ │ [👁 View] [✏️ Edit]      │ │ Action Buttons
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🍲 Protein Power Bowl   │ │
│ │ 6 ingredients • 15 min  │ │
│ │ 🥚🥬🥑🫘🥕🌰        │ │
│ │                         │ │
│ │ Freshness: ██████░░░░   │ │
│ │ 6/10 fresh ingredients  │ │
│ │                         │ │
│ │ [👁 View] [✏️ Edit]      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Features
- **Recipe Cards**: Photo, name, ingredients count, prep time
- **Freshness Indicator**: Visual bar showing ingredient freshness
- **Ingredient Preview**: Small icons of main ingredients
- **Quick Actions**: View details, edit recipe, mark as favorite
- **Search & Filter**: By name, ingredients, prep time, freshness

### Recipe Detail Screen
```
┌─────────────────────────────┐
│ [←] Mediterranean Bowl [•••]│ Header with Back & Menu
├─────────────────────────────┤
│ [        Recipe Photo       ]│ Hero Image
├─────────────────────────────┤
│ Mediterranean Bowl          │ Title
│ A fresh, healthy bowl with  │ Description
│ Mediterranean flavors       │
│                             │
│ 🕒 25 min  👥 2 servings    │ Quick Info
│ ⭐ 4.5 rating              │
│                             │
│ Ingredients (4)             │ Section Header
│ • 150g Quinoa              │ Ingredient List
│ • 100g Cherry Tomatoes     │ with Quantities
│ • 50ml Olive Oil           │
│ • 2 cloves Garlic          │
│                             │
│ Instructions                │ Section Header
│ 1. Cook quinoa according... │ Step-by-step
│ 2. Dice tomatoes and...    │ Instructions
│                             │
│ [🍽️ Log This Dish]         │ Action Button
└─────────────────────────────┘
```

### Add/Edit Recipe Screen
```
┌─────────────────────────────┐
│ [←] New Recipe     [Save]   │ Header
├─────────────────────────────┤
│ Recipe Name *               │
│ [Mediterranean Bowl____]    │
│                             │
│ Description                 │
│ [A fresh, healthy bowl...] │
│                             │
│ Prep Time                   │
│ [25] minutes                │
│                             │
│ Servings                    │
│ [2] people                  │
│                             │
│ Ingredients                 │
│ ┌─────────────────────────┐ │
│ │ [Quinoa ▼] [150][g ▼]   │ │ Ingredient Row
│ │                    [✕]  │ │
│ └─────────────────────────┘ │
│ [+ Add Ingredient]          │
│                             │
│ Instructions                │
│ [1. Cook quinoa according...]│ Multi-line Text
│                             │
│        [Cancel] [Save]      │
└─────────────────────────────┘
```

## 4. Track Screen (Consumption Logging)

### Layout
```
┌─────────────────────────────┐
│ Nutrition Tracking [📅]     │ Header with Date Picker
├─────────────────────────────┤
│ Today, Dec 15              │ Current Date
│                             │
│ ┌─────────────────────────┐ │
│ │ [🥗 Log Dish] [🥕 Log   │ │ Quick Log Buttons
│ │               Ingredient]│ │
│ └─────────────────────────┘ │
│                             │
│ Today's Meals               │ Section Header
│ ┌─────────────────────────┐ │
│ │ 🌅 Breakfast             │ │ Meal Section
│ │ • Spinach Omelette      │ │
│ │   8:30 AM • 2 servings  │ │
│ │                         │ │
│ │ 🌞 Lunch                │ │
│ │ • Mediterranean Bowl    │ │
│ │   12:45 PM • 1 serving  │ │
│ │                         │ │
│ │ 🌙 Dinner               │ │
│ │ [+ Add meal]            │ │
│ └─────────────────────────┘ │
│                             │
│ Daily Summary               │ Progress Section
│ Variety Score: 85% ████████░│
│ Ingredients: 8/12 goal     │
└─────────────────────────────┘
```

### Features
- **Quick Logging**: Separate buttons for dishes and ingredients
- **Meal Organization**: Breakfast, lunch, dinner, snacks
- **Time Tracking**: Automatic timestamping with edit capability
- **Daily Progress**: Variety score and ingredient count
- **History**: Swipe to view previous days

### Log Consumption Modal
```
┌─────────────────────────────┐
│ Log Consumption       [✕]   │
├─────────────────────────────┤
│ What did you eat?           │
│ (•) Dish    ( ) Ingredient  │ Radio Buttons
│                             │
│ Select Dish                 │
│ [Mediterranean Bowl ▼]      │ Dropdown
│                             │
│ Quantity                    │
│ [1] [serving ▼]             │ Quantity & Unit
│                             │
│ When?                       │
│ [📅 Today] [🕒 12:45 PM]    │ Date & Time
│                             │
│ Notes (Optional)            │
│ [Delicious and filling...] │
│                             │
│        [Cancel] [Log]       │
└─────────────────────────────┘
```

## 5. Recommendations Screen

### Layout
```
┌─────────────────────────────┐
│ Smart Recommendations  [⚙️] │ Header with Settings
├─────────────────────────────┤
│ Based on your recent meals  │ Subtitle
│                             │
│ 🎯 Recommended for You      │ Section Title
│ ┌─────────────────────────┐ │
│ │ ⭐ Veggie Stir Fry       │ │ Recommendation Card
│ │ 95% freshness score     │ │
│ │                         │ │
│ │ Fresh ingredients:      │ │
│ │ 🥦 Broccoli • 🥕 Carrots│ │
│ │ 🫑 Bell Pepper          │ │
│ │                         │ │
│ │ Why this dish?          │ │
│ │ You haven't had these   │ │
│ │ ingredients for 5+ days │ │
│ │                         │ │
│ │ [👁 View Recipe] [🍽️ Log]│ │
│ └─────────────────────────┘ │
│                             │
│ 🔄 Mix It Up               │ Alternative Section
│ ┌─────────────────────────┐ │
│ │ • Quinoa Power Bowl     │ │ Alternative List
│ │   87% freshness         │ │
│ │ • Asian Fusion Salad    │ │
│ │   82% freshness         │ │
│ │ • [View All (8)]        │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Features
- **Smart Algorithm**: Based on ingredient freshness and consumption history
- **Freshness Scoring**: Visual indicators for ingredient freshness
- **Personalized Explanations**: Why each dish is recommended
- **Quick Actions**: View recipe details or log consumption
- **Settings**: Adjust recommendation preferences (avoidance period)

### Recommendation Settings
```
┌─────────────────────────────┐
│ [←] Recommendation Settings │
├─────────────────────────────┤
│ Avoidance Period            │
│ [3] days                    │
│ Avoid recently consumed     │
│ ingredients for this long   │
│                             │
│ Dietary Restrictions        │
│ ☐ Vegetarian               │
│ ☐ Vegan                    │
│ ☐ Gluten-free              │
│ ☐ Dairy-free               │
│                             │
│ Notification Preferences    │
│ ☑ Daily recommendations    │
│ ☑ Meal reminders          │
│ ☐ Variety score alerts    │
│                             │
│        [Reset] [Save]       │
└─────────────────────────────┘
```

## Common UI Components

### Loading States
- **Skeleton Loading**: For lists and cards
- **Shimmer Effect**: Animated loading placeholders
- **Pull-to-Refresh**: Standard refresh gesture
- **Infinite Scroll**: For large datasets

### Error States
- **Network Error**: Retry button with offline indicator
- **Empty States**: Friendly illustrations with call-to-action
- **Form Validation**: Inline error messages
- **Toast Notifications**: Success/error feedback

### Input Components
- **Search Bar**: With autocomplete suggestions
- **Dropdown Selectors**: For categories, units, etc.
- **Date/Time Pickers**: Native platform pickers
- **Quantity Inputs**: Numeric steppers with units
- **Multi-select**: For tags, dietary restrictions

## Technical Implementation

### State Management Structure
```dart
// App State
class AppState {
  User? user;
  List<Ingredient> ingredients;
  List<Dish> dishes;
  List<ConsumptionLog> consumptionLogs;
  List<Recommendation> recommendations;
  AppSettings settings;
  bool isLoading;
  String? errorMessage;
}

// API Service
class NutriTrackApiService {
  Future<List<Ingredient>> getIngredients();
  Future<List<Dish>> getDishes();
  Future<List<ConsumptionLog>> getConsumption();
  Future<List<Recommendation>> getRecommendations();
  Future<void> logConsumption(ConsumptionLog log);
  // ... other API methods
}

// Local Storage
class LocalStorageService {
  Future<void> cacheIngredients(List<Ingredient> ingredients);
  Future<List<Ingredient>> getCachedIngredients();
  Future<void> saveSettings(AppSettings settings);
  // ... other storage methods
}
```

### Navigation Structure
```dart
// App Router
final appRouter = GoRouter(
  routes: [
    ShellRoute(
      builder: (context, state, child) => MainScaffold(child: child),
      routes: [
        GoRoute(path: '/', builder: (context, state) => HomeScreen()),
        GoRoute(path: '/ingredients', builder: (context, state) => IngredientsScreen()),
        GoRoute(path: '/dishes', builder: (context, state) => DishesScreen()),
        GoRoute(path: '/track', builder: (context, state) => TrackScreen()),
        GoRoute(path: '/recommendations', builder: (context, state) => RecommendationsScreen()),
      ],
    ),
  ],
);
```

### Key Features Implementation

#### Offline Support
- Cache frequently accessed data locally
- Queue actions when offline, sync when online
- Show offline indicator in UI
- Graceful degradation of features

#### Performance Optimization
- Lazy loading for large lists
- Image caching and optimization
- Efficient state management
- Background data sync

#### Accessibility
- Screen reader support
- High contrast mode compatibility
- Large text support
- Voice control integration

#### Platform Integration
- Native share functionality
- Camera integration for food photos
- Health app integration (iOS HealthKit)
- Push notifications for reminders

## Development Phases

### Phase 1: Core Features (MVP)
- [ ] Basic navigation and layout
- [ ] Ingredient CRUD operations
- [ ] Dish CRUD operations
- [ ] Simple consumption logging
- [ ] Basic recommendations

### Phase 2: Enhanced UX
- [ ] Improved UI/UX design
- [ ] Advanced search and filtering
- [ ] Photo integration
- [ ] Offline support
- [ ] Performance optimization

### Phase 3: Smart Features
- [ ] Advanced recommendation algorithm
- [ ] Analytics and insights
- [ ] Goal setting and tracking
- [ ] Social features
- [ ] Health app integration

### Phase 4: Premium Features
- [ ] AI-powered meal planning
- [ ] Barcode scanning
- [ ] Recipe import/export
- [ ] Nutrition analysis
- [ ] Cloud backup and sync

## Testing Strategy

### Unit Testing
- API service methods
- Business logic functions
- Data transformation utilities
- Validation functions

### Widget Testing
- Individual screen components
- Form validation
- Navigation flows
- State management

### Integration Testing
- API integration
- Local storage operations
- End-to-end user flows
- Performance testing

## Deployment

### iOS App Store
- App Store Connect setup
- Screenshots and metadata
- App Review Guidelines compliance
- TestFlight beta distribution

### Configuration
- Environment-specific API URLs
- Feature flags for gradual rollout
- Analytics and crash reporting setup
- Push notification configuration

---

This design document provides a comprehensive foundation for building the NutriTrack iOS app with Flutter. The design emphasizes user experience, performance, and scalability while maintaining consistency with the existing web application's functionality.