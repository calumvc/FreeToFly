const airports = {
  Atlanta: [426, 900 - 624],
  Dubai: [1044, 900 - 582],
  Dallas: [373, 900 - 619],
  Tokyo: [1444, 900 - 598],
  London: [800, 900 - 720],
  Istanbul: [924, 900 - 667],
  Chicago: [413, 900 - 667],
  Delhi: [1142, 900 - 598],
  Shanghai: [1333, 900 - 619],
  California: [271, 900 - 645],
  Guangzhou: [1302, 900 - 571],
  Seoul: [1360, 900 - 645],
  Paris: [808, 900 - 704],
  Singapore: [1257, 900 - 455],
  Beijing: [1315, 900 - 656],
  Amsterdam: [817, 900 - 725],
  Madrid: [786, 900 - 661],
  NewYork: [471, 900 - 661],
  Bangkok: [1244, 900 - 518],
  Frankfurt: [835, 900 - 714],
  Charlotte: [444, 900 - 635],
  LasVegas: [288, 900 - 640],
  KualaLumpur: [1248, 900 - 465],
};

export let currentAirports = [];
let currentAirportNames = [];

export function createAirport(colour) {
  const airportKeys = Object.keys(airports);
  if (airportKeys.length == currentAirports.length) {
    console.log("U tried to make a new airport but we dont have that many :p");
    return;
  }
  let airportName;
  let randInt;

  // Get random airport that hasn't been selected before
  do {
    randInt = Math.floor(Math.random() * airportKeys.length);
    airportName = airportKeys[randInt];
  } while (currentAirportNames.includes(airportName));

  const airport = new Object({
    name: airportName,
    location: airports[airportName],
    colour: colour,
  });

  currentAirportNames.push(airport.name);
  currentAirports.push(airport);
  return airport;
}
