## GraphQL-Yoga (js) api-request-graphql for https://swapi.dev/api/

```
{
  hello(name: "Tom")
  
  getPerson(id: 1) {
    name
    height
    mass
    hair_color
    skin_color
    eye_color
    birth_year
    gender
    homeworld {
      name
      rotation_period
      orbital_period
      population
      climate
      gravity
      terrain
      residents {
        name
      }
      films {
        title
        episode_id
      }
    }
    films {
      title
      episode_id
      director
      producer
      release_date
      opening_crawl
    }
  }

  getPlanet(id: 1) {
    name
    residents {
      name
    }
    films {
      title
    }
  }

  getFilm(id: 1) {
    title
    characters {
      name
    }
    planets {
      name
    }
  }
  
  getVehicle(id: 14) {
    name
    model
    manufacturer
    cost_in_credits
    length
    max_atmosphering_speed
    crew
    passengers
    cargo_capacity
    consumables
    vehicle_class
    url
    films {
      title
    }
  }
  
  getStarship(id: 3) {
    name
    model
    manufacturer
    cost_in_credits
    length
    max_atmosphering_speed
    crew
    passengers
    cargo_capacity
    consumables
    url
    films {
      title
    }
  }

}
```