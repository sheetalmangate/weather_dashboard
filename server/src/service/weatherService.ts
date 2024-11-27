import { Dayjs } from "dayjs";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: Dayjs | string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number,
    public icon: string,
    public desc: string
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private city: string = "";

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';

  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {

      if( !this.baseURL || !this.apiKey ) {
        throw new Error( "Invalid base url or API key" );
      }

      const response:Coordinates[] = await fetch(query).then((res)=>res.json())
      return response[0];
      
    }catch(err) {

    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if( !locationData ) {
      throw new Error("city not found")
    }

    const { name, lat, lon, country, state } = locationData;
    const coordinates: Coordinates = { name, lat, lon, country, state }

    return coordinates;


  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const query = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {

    const data = await this.fetchLocationData( this.buildGeocodeQuery());
    if(data)
      return this.destructureLocationData(data);

    throw new Error("Location not found");

  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {

      this.city = city;
      const coordinates:Coordinates = await this.fetchAndDestructureLocationData();
      if(coordinates) {
        this.city = coordinates.name;
        const weather = await this.fetchWeatherData( coordinates );
        return weather
      }

      throw new Error("weather data not found");
    } catch(err) {
      throw err;
    }
  }
}

export default new WeatherService();
