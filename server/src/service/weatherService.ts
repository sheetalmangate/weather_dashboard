import dayjs, { Dayjs } from "dayjs";
import dotenv from "dotenv";
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
    public iconDescription: string
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private city: string = "";

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error("Invalid base url or API key");
      }

      const response: Coordinates[] = await fetch(query).then((res) =>
        res.json()
      );
      return response[0];
    } catch (err) {
      throw err;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    
    if (!locationData) {
      throw new Error("Invalid location data");
    }

    const { name, lat, lon, country, state } = locationData;
    const coordinates: Coordinates = {
      name,
      lat,
      lon,
      country,
      state,
    };
    return coordinates;
    
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const query = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {

    const query = this.buildGeocodeQuery();
    return  await this.fetchLocationData(query).then(locationData => this.destructureLocationData(locationData) );

  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {

    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await fetch(query);

      if(!response) throw new Error("Weather data not found");

      const data = await response.json();
      const currentWeather: Weather = this.parseCurrentWeather(data.list[0]);

      const forecast : Weather[] = this.buildForecastArray(currentWeather, data.list);

      return forecast;

    } catch(err) {
      console.log(err);
      return err;
    }

  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
  
    const currentWeather = new Weather(
      this.city,
      dayjs(response.dt).format("M/D/YYYY"),
      response.main.temp,  
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main,
    );

    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

    const weatherForecast : Weather[] = [currentWeather];
    const filteredWeatherData = weatherData.filter((data:any) => data.dt_txt.includes("12:00:00"));
   
    for( const day of filteredWeatherData ) {
      const tempWeather = new Weather( this.city, dayjs(day.dt).format("MM/DD/YYYY"), day.main.temp,day.wind.speed, day.main.humidity, day.weather[0].icon, day.weather[0].description );
      weatherForecast.push(tempWeather);
    }

    return weatherForecast;

  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates: Coordinates =
        await this.fetchAndDestructureLocationData();
      if (coordinates) {
        this.city = coordinates.name;
        const response = await this.fetchWeatherData(coordinates);
        return response;
      }
      throw new Error("weather data not found");
    } catch (err) {
      throw err;
    }
  }
}

export default new WeatherService();
