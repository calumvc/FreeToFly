const airports = {
  Atlanta: (426, 624),
  Dubai: (1044, 582),
  Dallas: (373, 619),
  Tokyo: (1444, 598),
  London: (800, 720),
  Istanbul: (924, 667),
  Chicago: (413, 667),
  Delhi: (1142, 598),
  Shanghai: (1333, 619),
  California: (271, 645),
  Guangzhou: (1302, 571),
  Seoul: (1360, 645),
  Paris: (808, 704),
  Singapore: (1257, 455),
  Beijing: (1315, 656),
  Amsterdam: (817, 725),
  Madrid: (786, 661),
  NewYork: (471, 661),
  Bangkok: (1244, 518),
  Frankfurt: (835, 714),
  Charlotte: (444, 635),
  LasVegas: (288, 640),
  KualaLumpur: (1248, 465),
};

let currentAirports = [];

function createAirport(colour) {
  const airportKeys = Object.keys(airports);
  let airportName;
  let randInt;

  // Get random airport that hasn't been selected before
  do {
    randInt = Math.floor(Math.random() * airportKeys.length);
    airportName = airportKeys[randInt];
  } while (airportName in currentAirports);

  const airport = new Object({
    name: airportName,
    location: airports[airportName],
    colour: colour,
  });

  currentAirports.push(airport.name);
  return airport;
}
