const airports = {
  Atlanta: [433, 358],
  Dubai: [1132, 423],
  Dallas: [370, 352],
  Tokyo: [1559, 354],
  London: [853, 252],
  Istanbul: [1016, 328],
  Chicago: [418, 323],
  Delhi: [1254, 391],
  Shanghai: [1465, 383],
  California: [254, 340],
  Guangzhou: [1425, 406],
  Seoul: [1501, 344],
  Paris: [870, 289],
  Singapore: [1378, 510],
  Beijing: [1447, 320],
  Amsterdam: [891, 257],
  Madrid: [841, 330],
  NewYork: [507, 314],
  Bangkok: [1372, 474],
  Frankfurt: [902, 281],
  Charlotte: [452, 353],
  BuenosAires: [566,405],
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
