/**
 * Large per-letter word pool (A-Z) used by the spectator to generate words
 * that start with the 1st and 2nd letters of the hidden master word.
 * Contains 30+ varied, high-frequency words for every letter.
 */
export const LETTER_WORDS: Record<string, string[]> = {
  A: [
    "Anchor", "Arrow", "Airplane", "Astronaut", "Atlas", "Avocado", "Acorn", "Amber",
    "Apex", "Alchemy", "Artifact", "Arch", "Alley", "Armor", "Antenna", "Avenue",
    "Aurora", "Almanac", "Atlas", "Abyss", "Agent", "Alien", "Alloy", "Altar",
    "Anchor", "Apex", "Apparel", "Apron", "Arcade", "Arena", "Armor", "Atom"
  ],
  B: [
    "Beacon", "Bridge", "Bicycle", "Breeze", "Balcony", "Banner", "Barrel", "Basin",
    "Battery", "Blizzard", "Boulder", "Branch", "Bubble", "Bullet", "Bumper", "Bundle",
    "Bunker", "Button", "Badge", "Bamboo", "Bandit", "Banker", "Bazaar", "Beetle",
    "Blaster", "Blossom", "Booster", "Bottle", "Broadcast", "Bronze", "Buffet", "Bungalow"
  ],
  C: [
    "Castle", "Compass", "Canyon", "Crystal", "Camera", "Candle", "Canvas", "Capstan",
    "Caravan", "Carbon", "Cargo", "Carousel", "Carton", "Cascade", "Cathedral", "Cavern",
    "Ceiling", "Cement", "Century", "Ceramic", "Chalice", "Channel", "Chariot", "Charter",
    "Circuit", "Cistern", "Citadel", "Clavier", "Cobalt", "Column", "Comet", "Corridor"
  ],
  D: [
    "Diamond", "Dragon", "Dynamo", "Dagger", "Damage", "Danger", "Daylight", "Decade",
    "Deck", "Delta", "Demon", "Depot", "Desert", "Device", "Dial", "Diesel",
    "Digital", "Diploma", "Disaster", "Disc", "Display", "Distance", "District", "Dividend",
    "Docket", "Doctor", "Doctrine", "Domain", "Dome", "Donkey", "Dozen", "Dragon"
  ],
  E: [
    "Engine", "Echo", "Eclipse", "Empire", "Eagle", "Earth", "Elbow", "Element",
    "Embassy", "Emerald", "Enclave", "Enigma", "Enterprise", "Entry", "Enzyme", "Epic",
    "Episode", "Equator", "Eraser", "Essence", "Estate", "Ether", "Ethic", "Evening",
    "Event", "Evidence", "Exchange", "Exile", "Exit", "Exodus", "Expedition", "Export"
  ],
  F: [
    "Falcon", "Fountain", "Forest", "Feather", "Fabric", "Factory", "Façade", "Fantasy",
    "Ferry", "Fiber", "Field", "Filter", "Finger", "Finish", "Firewall", "Fixture",
    "Flame", "Flash", "Flavor", "Flight", "Float", "Flood", "Floor", "Flora",
    "Flower", "Fluid", "Flux", "Folder", "Footprint", "Forecast", "Format", "Fortress"
  ],
  G: [
    "Galaxy", "Gateway", "Glacier", "Gears", "Gale", "Gallery", "Gallon", "Gambit",
    "Garage", "Garden", "Garment", "Gasoline", "Gathering", "Gauge", "Gemstone", "General",
    "Genius", "Geode", "Gesture", "Geyser", "Ghost", "Giant", "Giggle", "Girdle",
    "Glass", "Glider", "Glimpse", "Globe", "Glory", "Glow", "Goblet", "Gondola"
  ],
  H: [
    "Horizon", "Harbor", "Hedgehog", "Hazard", "Highway", "Habitat", "Halberd", "Halo",
    "Hammer", "Hammock", "Handbag", "Handle", "Hangar", "Harvest", "Haven", "Headline",
    "Headphone", "Heater", "Heaven", "Heavy", "Helmet", "Herald", "Heritage", "Hero",
    "Hexagon", "Hollow", "Homage", "Honey", "Honor", "Hospital", "Hostage", "Hurricane"
  ],
  I: [
    "Island", "Iceberg", "Impulse", "Identity", "Icon", "Idea", "Idol", "Igloo",
    "Ignition", "Illusion", "Image", "Impact", "Import", "Impression", "Incense", "Index",
    "Indigo", "Infantry", "Inferno", "Infinity", "Inflation", "Ingot", "Inheritance", "Initial",
    "Injury", "Inkwell", "Inlet", "Innovation", "Insect", "Insight", "Instance", "Interval"
  ],
  J: [
    "Jacket", "Jungle", "Journey", "Javelin", "Jade", "Jailer", "Janitor", "Jargon",
    "Jasmine", "Jewel", "Jigsaw", "Jingle", "Jockey", "Joint", "Journal", "Judge",
    "Juggler", "Juice", "Jumbo", "Junction", "Junket", "Jupiter", "Juror", "Justice"
  ],
  K: [
    "Knight", "Kingdom", "Kangaroo", "Keystone", "Kayak", "Kettle", "Keyhole", "Keypad",
    "Kiln", "Kite", "Kitten", "Knapsack", "Knoll", "Knot", "Knuckle", "Krypton",
    "Kebab", "Kennel", "Kernel", "Keyboard", "Kimono", "Kindle", "Kingpin", "Kitchen"
  ],
  L: [
    "Lantern", "Legend", "Laser", "Labyrinth", "Ladder", "Lagoon", "Lament", "Landscape",
    "Latitude", "Launcher", "Laundry", "Lava", "Leader", "Leaflet", "League", "Leather",
    "Legacy", "Leopard", "Letter", "Liberty", "Library", "License", "Lifeboat", "Lightning",
    "Limestone", "Lineage", "Liquid", "Lizard", "Lobby", "Locksmith", "Locomotive", "Logistics"
  ],
  M: [
    "Mirage", "Monolith", "Meteor", "Magnet", "Machine", "Magazine", "Magician", "Magma",
    "Majesty", "Mallet", "Mammoth", "Mandate", "Manifest", "Manor", "Mansion", "Mantel",
    "Manual", "Maple", "Marble", "Margin", "Marina", "Market", "Marshal", "Master",
    "Matrix", "Meadow", "Mechanic", "Medal", "Medium", "Melody", "Memoir", "Merchant"
  ],
  N: [
    "Nebula", "Navigator", "Needle", "Nexus", "Nation", "Nature", "Nausea", "Navy",
    "Nectar", "Nemesis", "Neon", "Nest", "Network", "Neutral", "Neutron", "Newspaper",
    "Nickel", "Nightfall", "Nimbus", "Nitrogen", "Noble", "Nomad", "Notebook", "Novel",
    "Nozzle", "Nuclear", "Nucleus", "Nugget", "Number", "Numeral", "Nursery", "Nylon"
  ],
  O: [
    "Orbit", "Oracle", "Octopus", "Oasis", "Object", "Oblivion", "Observer", "Obsidian",
    "Ocean", "Octagon", "Octave", "Odor", "Officer", "Offset", "Oilfield", "Omega",
    "Omen", "Opal", "Operand", "Opinion", "Optics", "Option", "Opus", "Oracle",
    "Orchard", "Order", "Ore", "Organ", "Origin", "Ornament", "Outlaw", "Outpost"
  ],
  P: [
    "Pyramid", "Phantom", "Pulse", "Planet", "Package", "Packet", "Padlock", "Palace",
    "Palette", "Panther", "Paper", "Parable", "Parade", "Paradise", "Paragraph", "Parapet",
    "Parchment", "Particle", "Partner", "Passage", "Passport", "Pasture", "Patent", "Pathfinder",
    "Patrol", "Pattern", "Pavilion", "Payment", "Peak", "Pebble", "Pelican", "Pendulum"
  ],
  Q: [
    "Quartz", "Quiver", "Quarry", "Quest", "Quadrant", "Quad", "Quake", "Quantum",
    "Quarter", "Quartet", "Quasar", "Queen", "Query", "Quickstep", "Quiet", "Quilt",
    "Quintet", "Quiz", "Quota", "Quorum", "Quill", "Quiver", "Quarry", "Quantum"
  ],
  R: [
    "Radar", "Riddle", "Rocket", "River", "Rabbit", "Radiance", "Radius", "Raft",
    "Railroad", "Rainbow", "Rally", "Rampart", "Ranger", "Ransom", "Rapid", "Rapture",
    "Ration", "Rattle", "Ravine", "Razor", "Reactor", "Rebel", "Receipt", "Record",
    "Refinery", "Reflex", "Refuge", "Regime", "Region", "Relic", "Remedy", "Rescue"
  ],
  S: [
    "Sphinx", "Satellite", "Shadow", "Summit", "Saddle", "Safari", "Saga", "Sailor",
    "Salamander", "Saloon", "Sample", "Sanctuary", "Sandstone", "Sapphire", "Satellite", "Saturn",
    "Savanna", "Scale", "Scandal", "Scavenger", "Scenic", "Scepter", "Scholar", "School",
    "Schooner", "Science", "Scope", "Scout", "Scroll", "Sculpture", "Sector", "Sediment"
  ],
  T: [
    "Tower", "Thunder", "Telescope", "Turbine", "Tablecloth", "Tablet", "Tactics", "Tailor",
    "Talent", "Talisman", "Tanker", "Tap", "Target", "Tariff", "Tavern", "Technology",
    "Temple", "Tempo", "Tenancy", "Tenant", "Tender", "Tentacle", "Terminal", "Terrace",
    "Terrain", "Territory", "Testament", "Texture", "Theater", "Theory", "Thermal", "Threshold"
  ],
  U: [
    "Umbrella", "Universe", "Urchin", "Utility", "Ultrasound", "Umbra", "Umpire", "Unicorn",
    "Uniform", "Union", "Unit", "Universe", "Upgrade", "Uplink", "Uranium", "Urban",
    "Urn", "Utensil", "Utmost", "Utopia", "Underpass", "Underwood", "Unravel", "Upbeat"
  ],
  V: [
    "Vortex", "Volcano", "Vault", "Vanguard", "Vacancy", "Vaccine", "Vacuum", "Valence",
    "Valet", "Valley", "Valor", "Valve", "Vampire", "Vanilla", "Vapor", "Vase",
    "Vector", "Vehicle", "Velocity", "Velvet", "Vendor", "Venture", "Verdict", "Vessel",
    "Vestige", "Vibration", "Vicar", "Victim", "Victor", "Video", "Village", "Vintage"
  ],
  W: [
    "Waterfall", "Whistle", "Windmill", "Weapon", "Wagon", "Waistcoat", "Wallet", "Walnut",
    "Walrus", "Wanderer", "Wardrobe", "Warehouse", "Warfare", "Warrant", "Warrior", "Watchman",
    "Waterloo", "Waxwork", "Waypoint", "Weather", "Weaver", "Webbing", "Welcome", "Wellhead",
    "Wheelbarrow", "Whisper", "Wilderness", "Window", "Windpipe", "Winner", "Wiretap", "Wizard"
  ],
  X: [
    "Xenon", "Xylophone", "Xerox", "X-ray", "Xanthic", "Xenolith", "Xiphoid", "Xenoblast",
    "Xystus", "Xerophyte", "Xenon", "Xylophone", "Xerox", "Xerox", "X-ray", "Xanthic"
  ],
  Y: [
    "Yacht", "Yarn", "Yield", "Yoke", "Yardarm", "Yardstick", "Yearbook", "Yearling",
    "Yeast", "Yellowtail", "Yeti", "Yogurt", "Yorkshire", "Youngster", "Yucca", "Yule"
  ],
  Z: [
    "Zephyr", "Zodiac", "Zenith", "Zeppelin", "Zamboni", "Zebra", "Zero", "Zigzag",
    "Zinc", "Zipper", "Zircon", "Zither", "Zone", "Zoology", "Zucchini", "Zirconium"
  ]
};
