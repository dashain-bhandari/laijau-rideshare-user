import { pricePerKmBike, pricePerKmCar } from "../constants/pricing";
import axios from 'axios';

type WeatherCondition = 'Clear' | 'Rain' | 'Snow' | 'Storm';
type Coordinates = {
    latitude: number | undefined;
    longitude: number | undefined;
};

interface WeatherResponse {
    weather: {
        main: string;
        description: string;
    }[];
    main: {
        temp: number;
    };
}

const mapWeatherToCondition = (weatherMain: string): WeatherCondition => {
    switch (weatherMain.toLowerCase()) {
        case 'thunderstorm':
            return 'Storm';
        case 'rain':
        case 'drizzle':
            return 'Rain';
        case 'snow':
            return 'Snow';
        default:
            return 'Clear';
    }
};

const getWeatherMultiplier = (weather: WeatherCondition): number => {
    switch (weather) {
        case 'Clear':
            return 1.0;
        case 'Rain':
            return 1.3;
        case 'Snow':
            return 1.5;
        case 'Storm':
            return 2.0;
        default:
            return 1.0;
    }
};

const getNightTimeMultiplier = (time: Date): number => {
    try {
        const hour = time.getHours();
        if (hour >= 22 || hour < 5) {
            return 1.25;
        }
        return 1.0;
    } catch (error) {
        console.log('Error getting time multiplier:', error);
        return 1.0; // Default multiplier if there's any error
    }
};

// Fetch weather data from OpenWeatherMap API with fallback
const fetchWeatherData = async (coordinates: Coordinates): Promise<{ weather: WeatherCondition; multiplier: number }> => {
    try {
        const API_KEY = "ad3c48965d1993b3688447f56d6e6e6b";
        const response = await axios.get<WeatherResponse>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${API_KEY}`
        );

        const weather = mapWeatherToCondition(response.data.weather[0].main);
        return {
            weather,
            multiplier: getWeatherMultiplier(weather)
        };
    } catch (error) {
        console.log('Error fetching weather data:', error);
        return {
            weather: 'Clear',
            multiplier: 1.0 // Default multiplier if weather fetch fails
        };
    }
};

export const calculatePricings = async ({
    distance,
    vehicleType,
    coordinates
}: {
    distance: number;
    vehicleType: string;
    coordinates: Coordinates;
}) => {
    try {
        // Get weather data with fallback
        const { weather, multiplier: weatherMultiplier } = await fetchWeatherData(coordinates)
            .catch(() => ({ weather: 'Clear' as WeatherCondition, multiplier: 1.0 }));

        console.log("weather", weather)
        console.log("multiplier", weatherMultiplier)
        // Get time multiplier with fallback
        const timeMultiplier = getNightTimeMultiplier(new Date());

        if (vehicleType === "Bike") {
            // For bikes, even in case of API failure, check if we know it's severe weather
            if (weather === 'Storm' || weather === 'Snow') {
                throw new Error('Bike service not available during severe weather conditions');
            }

            let initialPrice = Math.ceil(
                distance *
                pricePerKmBike *
                weatherMultiplier *
                timeMultiplier
            );

            console.log("initial", initialPrice)
            if (initialPrice < 50) {
                initialPrice = 60;
            }

            let minimumPrice = Math.ceil(initialPrice - 0.1 * initialPrice);

            return {
                initialPrice,
                minimumPrice
            };
        } else {
            let initialPrice = Math.ceil(
                distance *
                pricePerKmCar *
                weatherMultiplier *
                timeMultiplier
            );

            if (initialPrice < 200) {
                initialPrice = 220;
            }

            let minimumPrice = Math.ceil(initialPrice - 0.2 * initialPrice);

            return {
                initialPrice,
                minimumPrice
            };
        }
    } catch (error: any) {
        // If there's an error in the main calculation (not weather-related),
        // calculate with default multipliers
        const defaultMultiplier = 1.0;

        if (vehicleType === "Bike") {
            let initialPrice = Math.ceil(
                distance *
                pricePerKmBike *
                defaultMultiplier
            );

            if (initialPrice < 50) {
                initialPrice = 60;
            }

            let minimumPrice = Math.ceil(initialPrice - 0.1 * initialPrice);

            return {
                initialPrice,
                minimumPrice
            };
        } else {
            let initialPrice = Math.ceil(
                distance *
                pricePerKmCar *
                defaultMultiplier
            );

            if (initialPrice < 200) {
                initialPrice = 220;
            }

            let minimumPrice = Math.ceil(initialPrice - 0.2 * initialPrice);

            return {
                initialPrice,
                minimumPrice
            };
        }
    }
};