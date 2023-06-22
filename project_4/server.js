import {createSchema, createYoga} from 'graphql-yoga'
import {createServer} from 'node:http'
import fetch from 'node-fetch';


const typeDefs = `
  type Query {
      hello(name: String): String!
      getPerson(id: Int!): Person
      getFilm(id: Int!): Film
      getPlanet(id: Int!): Planet
      getVehicle(id: Int!): Vehicle
      getStarship(id: Int!): Starship
  }

  type Planet {
      name: String
      population: Int,
      diameter: Int,
      climate: String,
      gravity: String,
      terrain: String,
      surface_water: Int,
      rotation_period: Int
      orbital_period: Int
      residents: [Person]
      films: [Film]
      url: String
  }

  type Film {
      title: String
      episode_id: Int
      opening_crawl: String
      director: String
      producer: String
      release_date: String
      url: String
      characters: [Person]
      planets: [Planet]
      starships: [Starship]
      vehicles: [Vehicle]
  }

  type Person {
      name: String
      height: Int
      mass: Int
      hair_color: String
      skin_color: String
      eye_color: String
      birth_year: String
      gender: String
      films: [Film]
      starships: [Starship]
      vehicles: [Vehicle]
      homeworld: Planet
      url: String
  }
  
  type Starship {
      name: String
      model: String
      manufacturer: String
      cost_in_credits: String
      length: String
      max_atmosphering_speed: String
      crew: String
      passengers: String
      cargo_capacity: String
      consumables: String
      hyperdrive_rating: String
      MGLT: Int
      starship_class: String
      films: [Film]
      url: String
  }
  
  type Vehicle {
      name: String
      model: String
      manufacturer: String
      cost_in_credits: String
      length: String
      max_atmosphering_speed: Int
      crew: Int
      passengers: Int
      cargo_capacity: Int
      consumables: String
      vehicle_class: String
      films: [Film]
      url: String
  }
`;

const resolveFilms = parent => {
    const promises = parent.films.map(async url => {
        const response = await fetch(url);
        return response.json();
    });
    return Promise.all(promises);
};

const resolveResidents = parent => {
    const promises = parent.residents.map(async url => {
        const response = await fetch(url);
        return response.json();
    });
    return Promise.all(promises);
};

const resolveCharacters = parent => {
    const promises = parent.characters.map(async url => {
        const response = await fetch(url);
        return response.json();
    });
    return Promise.all(promises);
};

const resolvePlanets = parent => {
    const promises = parent.planets.map(async url => {
        const response = await fetch(url);
        return response.json();
    });
    return Promise.all(promises);
};

const resolveStarships = parent => {
    const promises = parent.starships.map(async url => {
        const response = await fetch(url);
        return response.json();
    });
    return Promise.all(promises);
};

const resolveVehicles = parent => {
    const promises = parent.vehicles.map(async url => {
        const response = await fetch(url);
        return response.json();
    });
    return Promise.all(promises);
};


const resolvers = {
    Starship: {
        films: resolveFilms,
    },
    Vehicle: {
        films: resolveFilms,
    },
    Film: {
        characters: resolveCharacters,
        planets: resolvePlanets,
        starships: resolveStarships,
        vehicles: resolveVehicles,
    },
    Planet: {
        films: resolveFilms,
        residents: resolveResidents
    },
    Person: {
        homeworld: async parent => {
            const response = await fetch(parent.homeworld);
            return response.json();
        },
        films: resolveFilms,
        starships: resolveStarships,
        vehicles: resolveVehicles,
    },
    Query: {
        hello: (_, {name}) => `Hello ${name || "World"}`,

        getPerson: async (_, {id}) => {
            const response = await fetch(`https://swapi.dev/api/people/${id}/`);
            return response.json();
        },

        getFilm: async (_, {id}) => {
            const response = await fetch(`https://swapi.dev/api/films/${id}/`);
            return response.json();
        },

        getPlanet: async (_, {id}) => {
            const response = await fetch(`https://swapi.dev/api/planets/${id}/`);
            return response.json();
        },

        getStarship: async (_, {id}) => {
            const response = await fetch(`https://swapi.dev/api/starships/${id}/`);
            return response.json();
        },

        getVehicle: async (_, {id}) => {
            const response = await fetch(`https://swapi.dev/api/vehicles/${id}/`);
            return response.json();
        },

    }
};


const yoga = createYoga({
    schema: createSchema({
        typeDefs,
        resolvers
    })
})

const server = createServer(yoga)

server.listen(3000, () => {
    console.info('Server is running on http://localhost:3000/graphql')
})