## TravelBuddy

TravelGenius is a React-based travel planning application designed to help users explore nearby attractions, restaurants, and hotels using real-time location data and weather forecasts. This project integrates Material UI for modern styling and leverages the Google Maps API for interactive map functionality and location-based recommendations. Additionally, the app features AI-powered recommendations to enhance user experience by providing personalized travel plans.

### Live Link
Visit the site at [TravelBuddy]

### Snapshots
#### Landing Page

#### App Interface


### Features
- **Nearby Places Recommendations:** Get recommendations for attractions, restaurants, and hotels near your location.
- **Real-time Weather Forecast:** Provides current weather conditions to help plan your trip.
- **Interactive Map Integration:** Uses Google Maps API for seamless navigation and location-based suggestions.
- **AI-Powered Travel Plans:** Generate personalized travel plans based on user input (destination, budget, mood, and duration).
- **Modern UI/UX:** Built with Material UI 5 for a sleek and responsive user experience.
- **Multi-criteria Filters:** Customize search results based on preferences like budget, travel mood, and interests.

### Technologies Used
- **Frontend:** React, JavaScript, Material UI
- **APIs:**
  - Google Maps API (Location Search, Places, and Navigation)
  - Travel Advisor API (Tourist Attractions, Hotels, Restaurants)
  - OpenWeatherMap API (Real-time Weather Updates)
  - Google Generative AI API (Smart AI Recommendations)

### Getting Started
To run this project locally, follow these steps:

1. Clone this repository.
   ```bash
   git clone https://github.com/BhaskarAcharjee/TravelGenius.git
   ```
2. Navigate into the project directory.
   ```bash
   cd TravelGenius
   ```
3. Install dependencies.
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add the required API keys:
   ```plaintext
   REACT_APP_ENV=development (optional)
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   REACT_APP_TRAVEL_ADVISOR_API_KEY=your_travel_advisor_api_key
   REACT_APP_OPENWEATHERMAP_API_KEY=your_openweather_api_key
   REACT_APP_GEMINI_API_KEY=your_google_generative_ai_key
   ```
5. Start the development server.
   ```bash
   npm start
   ```
6. Open your browser and go to `http://localhost:3000` to view the application.

### Future Improvements
- Add user authentication and personalized trip history.
- Improve AI recommendations with more detailed itineraries.
- Offline support for saved travel plans.
- Enhanced filtering options for hotels and restaurants.

### License

### Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
