require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const CATEGORIES = [
    'Kerala', 'India', 'Technology', 'Science', 'Physics', 'Chemistry',
    'Biology', 'History', 'Geology', 'Social Science', 'Mathematics',
    'IT', 'Sports', 'Economics', 'General Knowledge', 'Movies'
];

// ─── DATA POOLS ─────────────────────────────────────────────────────────────

const KERALA_POOL = [
    { q: "Capital of Kerala?", a: "Thiruvananthapuram", alt: ["Kochi", "Kozhikode", "Thrissur"] },
    { q: "Official bird of Kerala?", a: "Great Hornbill", alt: ["Peacock", "Kingfisher", "Robin"] },
    { q: "Official language of Kerala?", a: "Malayalam", alt: ["Tamil", "Kannada", "Telugu"] },
    { q: "Longest river in Kerala?", a: "Periyar", alt: ["Bharathapuzha", "Pamba", "Chaliyar"] },
    { q: "Kerala's harvest festival?", a: "Onam", alt: ["Vishu", "Diwali", "Navratri"] },
    { q: "'Father of Malayalam Cinema'?", a: "J.C. Daniel", alt: ["Sathyan", "Prem Nazir", "Thikkurissy"] },
    { q: "Official animal of Kerala?", a: "Indian Elephant", alt: ["Tiger", "Lion", "Leopard"] },
    { q: "Official flower of Kerala?", a: "Kanikonna (Golden Shower)", alt: ["Lotus", "Rose", "Jasmine"] },
    { q: "Which city is known as the 'Queen of Arabian Sea'?", a: "Kochi", alt: ["Kozhikode", "Thiruvananthapuram", "Kollam"] },
    { q: "Kerala was formed on which date?", a: "1 November 1956", alt: ["15 August 1947", "26 January 1950", "1 July 1960"] },
    { q: "Kerala's famous backwater destination?", a: "Alleppey (Alappuzha)", alt: ["Munnar", "Kovalam", "Varkala"] },
    { q: "Largest district in Kerala by area?", a: "Idukki", alt: ["Palakkad", "Wayanad", "Thrissur"] },
    { q: "Which port city in Kerala is known for spice trade?", a: "Kozhikode", alt: ["Kochi", "Kollam", "Kasaragod"] },
    { q: "Famous hill station in Kerala?", a: "Munnar", alt: ["Wayanad", "Idukki", "Palakkad"] },
    { q: "Kerala is bounded to the west by?", a: "Arabian Sea", alt: ["Bay of Bengal", "Indian Ocean", "Lakshadweep Sea"] },
    { q: "Largest lake in Kerala?", a: "Vembanad Lake", alt: ["Ashtamudi Lake", "Sasthamkotta Lake", "Periyar Lake"] },
    { q: "First Chief Minister of Kerala?", a: "E.M.S. Namboodiripad", alt: ["C. Achutha Menon", "K. Karunakaran", "A.K. Antony"] },
    { q: "Kerala is known as the 'Land of ___'?", a: "Spices", alt: ["Gold", "Tigers", "Rivers"] },
    { q: "The famous temple of Padmanabhaswamy is in which city?", a: "Thiruvananthapuram", alt: ["Thrissur", "Kochi", "Guruvayur"] },
    { q: "Thrissur Pooram is held at which temple?", a: "Vadakkumnathan Temple", alt: ["Guruvayur Temple", "Ettumanoor Temple", "Ernakulam Shiva Temple"] }
];

const INDIA_POOL = [
    { q: "National Animal of India?", a: "Tiger", alt: ["Lion", "Elephant", "Leopard"] },
    { q: "National Bird of India?", a: "Peacock", alt: ["Parrot", "Eagle", "Sparrow"] },
    { q: "National Flower of India?", a: "Lotus", alt: ["Rose", "Jasmine", "Marigold"] },
    { q: "First Prime Minister of India?", a: "Jawaharlal Nehru", alt: ["Sardar Patel", "B.R. Ambedkar", "Lal Bahadur Shastri"] },
    { q: "Pink City of India?", a: "Jaipur", alt: ["Jodhpur", "Udaipur", "Ahmedabad"] },
    { q: "India became independent in?", a: "1947", alt: ["1950", "1942", "1930"] },
    { q: "City of Joy in India?", a: "Kolkata", alt: ["Mumbai", "Delhi", "Bengaluru"] },
    { q: "Largest state in India by area?", a: "Rajasthan", alt: ["Uttar Pradesh", "Madhya Pradesh", "Maharashtra"] },
    { q: "Indian Constitution came into effect on?", a: "26 January 1950", alt: ["15 August 1947", "26 November 1949", "2 October 1949"] },
    { q: "National River of India?", a: "Ganga", alt: ["Yamuna", "Godavari", "Brahmaputra"] },
    { q: "National Tree of India?", a: "Banyan", alt: ["Neem", "Peepal", "Mango"] },
    { q: "National Fruit of India?", a: "Mango", alt: ["Banana", "Jackfruit", "Guava"] },
    { q: "Which mountain range is called the Backbone of India?", a: "Vindhya Range", alt: ["Himalayas", "Western Ghats", "Eastern Ghats"] },
    { q: "First President of India?", a: "Dr. Rajendra Prasad", alt: ["Dr. S. Radhakrishnan", "Zakir Hussain", "Varahagiri Venkata Giri"] },
    { q: "Silicon Valley of India?", a: "Bengaluru", alt: ["Hyderabad", "Pune", "Mumbai"] },
    { q: "National Sport of India?", a: "Field Hockey", alt: ["Cricket", "Football", "Kabaddi"] },
    { q: "Gateway of India is located in?", a: "Mumbai", alt: ["Delhi", "Kolkata", "Chennai"] },
    { q: "India's space agency?", a: "ISRO", alt: ["DRDO", "BARC", "HAL"] },
    { q: "Longest river originating in India?", a: "Ganga", alt: ["Godavari", "Narmada", "Krishna"] },
    { q: "Which city hosts the Parliament of India?", a: "New Delhi", alt: ["Mumbai", "Kolkata", "Hyderabad"] }
];

const HISTORY_POOL = [
    { q: "First President of USA?", a: "George Washington", alt: ["Lincoln", "Jefferson", "Adams"] },
    { q: "World War I started in?", a: "1914", alt: ["1918", "1939", "1912"] },
    { q: "Who discovered America?", a: "Christopher Columbus", alt: ["Vasco da Gama", "Magellan", "Cook"] },
    { q: "French Revolution began in?", a: "1789", alt: ["1776", "1815", "1799"] },
    { q: "Who built the Great Wall of China?", a: "Qin Shi Huang", alt: ["Sun Tzu", "Kublai Khan", "Confucius"] },
    { q: "First person on the Moon?", a: "Neil Armstrong", alt: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins"] },
    { q: "Great Pyramid of Giza is in?", a: "Egypt", alt: ["Mexico", "Peru", "Greece"] },
    { q: "Titanic sank in?", a: "1912", alt: ["1905", "1920", "1915"] },
    { q: "Soviet Union leader in WWII?", a: "Joseph Stalin", alt: ["Lenin", "Khrushchev", "Gorbachev"] },
    { q: "Declaration of Independence signed in?", a: "1776", alt: ["1789", "1812", "1763"] },
    { q: "First female PM of UK?", a: "Margaret Thatcher", alt: ["Theresa May", "Angela Merkel", "Indira Gandhi"] },
    { q: "Magna Carta signed in?", a: "1215", alt: ["1066", "1295", "1314"] },
    { q: "Founder of Mongol Empire?", a: "Genghis Khan", alt: ["Kublai Khan", "Tamerlane", "Attila the Hun"] },
    { q: "Renaissance started in which country?", a: "Italy", alt: ["France", "Spain", "Germany"] },
    { q: "Who was the first Emperor of China?", a: "Qin Shi Huang", alt: ["Han Wudi", "Tang Taizong", "Kublai Khan"] },
    { q: "World War II ended in?", a: "1945", alt: ["1944", "1946", "1943"] },
    { q: "Berlin Wall fell in?", a: "1989", alt: ["1982", "1991", "1979"] },
    { q: "Apollo 11 landed on the Moon in?", a: "1969", alt: ["1965", "1972", "1968"] },
    { q: "Russian Revolution occurred in?", a: "1917", alt: ["1905", "1922", "1914"] },
    { q: "Mahatma Gandhi assassinated in?", a: "1948", alt: ["1947", "1950", "1945"] }
];

const PHYSICS_POOL = [
    { q: "Speed of light in vacuum?", a: "3 × 10⁸ m/s", alt: ["3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "1.5 × 10⁸ m/s"] },
    { q: "Unit of force?", a: "Newton", alt: ["Joule", "Pascal", "Watt"] },
    { q: "Unit of energy?", a: "Joule", alt: ["Newton", "Watt", "Coulomb"] },
    { q: "Unit of electric current?", a: "Ampere", alt: ["Volt", "Ohm", "Watt"] },
    { q: "Unit of power?", a: "Watt", alt: ["Joule", "Newton", "Pascal"] },
    { q: "Which force pulls objects towards Earth?", a: "Gravity", alt: ["Friction", "Magnetism", "Inertia"] },
    { q: "What is the SI unit of pressure?", a: "Pascal", alt: ["Newton", "Bar", "Torr"] },
    { q: "Light year is a unit of?", a: "Distance", alt: ["Time", "Speed", "Energy"] },
    { q: "Speed of sound in air at 20°C?", a: "343 m/s", alt: ["300 m/s", "500 m/s", "700 m/s"] },
    { q: "Ohm's Law relates?", a: "Voltage, Current, Resistance", alt: ["Mass, Velocity, Force", "Power, Resistance, Time", "Energy, Work, Power"] },
    { q: "Who discovered gravity?", a: "Isaac Newton", alt: ["Einstein", "Galileo", "Faraday"] },
    { q: "What causes a rainbow?", a: "Dispersion of sunlight by water droplets", alt: ["Reflection from clouds", "Diffraction by dust", "Absorption by ozone"] },
    { q: "Absolute zero is equal to?", a: "-273.15°C", alt: ["0°C", "-100°C", "-200°C"] },
    { q: "Law of conservation of energy states?", a: "Energy cannot be created or destroyed", alt: ["Energy equals mass times velocity squared", "Force equals mass times acceleration", "Work equals force times displacement"] },
    { q: "Who developed the theory of relativity?", a: "Albert Einstein", alt: ["Isaac Newton", "Niels Bohr", "Max Planck"] },
    { q: "What is the unit of frequency?", a: "Hertz", alt: ["Newton", "Joule", "Watt"] },
    { q: "Electrical resistance is measured in?", a: "Ohm", alt: ["Volt", "Ampere", "Watt"] },
    { q: "Which type of lens converges light?", a: "Convex lens", alt: ["Concave lens", "Plane lens", "Prism"] },
    { q: "What is inertia?", a: "Resistance of an object to change in motion", alt: ["Force due to gravity", "Rate of change of speed", "Energy stored in motion"] },
    { q: "Nuclear fission involves?", a: "Splitting of atomic nucleus", alt: ["Joining of atoms", "Electron excitation", "Proton emission"] }
];

const CHEMISTRY_POOL_Q = [
    { q: "Chemical formula for water?", a: "H₂O", alt: ["H₂O₂", "HO", "OH"] },
    { q: "Chemical formula for salt (common)?", a: "NaCl", alt: ["KCl", "CaCl₂", "MgCl₂"] },
    { q: "Chemical formula for carbon dioxide?", a: "CO₂", alt: ["CO", "C₂O", "CO₃"] },
    { q: "Atomic number of Carbon?", a: "6", alt: ["8", "12", "4"] },
    { q: "Atomic number of Oxygen?", a: "8", alt: ["6", "16", "7"] },
    { q: "Metal that is liquid at room temperature?", a: "Mercury", alt: ["Gallium", "Bromine", "Iron"] },
    { q: "pH of pure water?", a: "7", alt: ["5", "9", "14"] },
    { q: "Hardest natural substance?", a: "Diamond", alt: ["Gold", "Iron", "Quartz"] },
    { q: "Lightest element?", a: "Hydrogen", alt: ["Helium", "Lithium", "Carbon"] },
    { q: "Which gas is needed for combustion?", a: "Oxygen", alt: ["Nitrogen", "Carbon Dioxide", "Helium"] },
    { q: "Chemical symbol for Gold?", a: "Au", alt: ["Go", "Gd", "Ag"] },
    { q: "Chemical symbol for Silver?", a: "Ag", alt: ["Si", "Sv", "Au"] },
    { q: "Chemical symbol for Iron?", a: "Fe", alt: ["Ir", "In", "Fr"] },
    { q: "Which acid is in vinegar?", a: "Acetic acid", alt: ["Citric acid", "Hydrochloric acid", "Sulfuric acid"] },
    { q: "Main component of natural gas?", a: "Methane (CH₄)", alt: ["Ethane", "Propane", "Butane"] },
    { q: "Rust is a form of?", a: "Iron Oxide", alt: ["Iron Carbonate", "Iron Sulfate", "Iron Chloride"] },
    { q: "Boiling point of water at sea level?", a: "100°C", alt: ["90°C", "120°C", "80°C"] },
    { q: "What is the pH of an acid?", a: "Less than 7", alt: ["More than 7", "Equal to 7", "Equal to 14"] },
    { q: "Noble gas used in electric signs?", a: "Neon", alt: ["Krypton", "Argon", "Helium"] },
    { q: "Chemical symbol for Sodium?", a: "Na", alt: ["So", "Sm", "N"] }
];

const BIOLOGY_POOL = [
    { q: "Which organ pumps blood?", a: "Heart", alt: ["Lungs", "Liver", "Kidney"] },
    { q: "Which organ performs gas exchange?", a: "Lungs", alt: ["Heart", "Kidneys", "Liver"] },
    { q: "Largest organ of the human body?", a: "Skin", alt: ["Liver", "Lungs", "Brain"] },
    { q: "Which organ produces insulin?", a: "Pancreas", alt: ["Liver", "Stomach", "Kidneys"] },
    { q: "Which organ filters blood?", a: "Kidneys", alt: ["Heart", "Liver", "Spleen"] },
    { q: "DNA stands for?", a: "Deoxyribonucleic Acid", alt: ["Dioxynucleic Acid", "Diribonucleic Acid", "Dinuclear Acid"] },
    { q: "Powerhouse of the cell?", a: "Mitochondria", alt: ["Nucleus", "Ribosome", "Golgi Body"] },
    { q: "Which blood group is Universal Donor?", a: "O negative", alt: ["A positive", "AB positive", "B negative"] },
    { q: "Number of chromosomes in a human cell?", a: "46", alt: ["23", "44", "48"] },
    { q: "Green pigment in plants?", a: "Chlorophyll", alt: ["Carotene", "Melanin", "Anthocyanin"] },
    { q: "Process of food making in plants?", a: "Photosynthesis", alt: ["Respiration", "Transpiration", "Fermentation"] },
    { q: "Smallest bone in the human body?", a: "Stapes (in ear)", alt: ["Radius", "Fibula", "Patella"] },
    { q: "How many bones in an adult human body?", a: "206", alt: ["200", "215", "190"] },
    { q: "Cell that carries oxygen in blood?", a: "Red Blood Cell (RBC)", alt: ["White Blood Cell", "Platelet", "Plasma"] },
    { q: "Which organ produces bile?", a: "Liver", alt: ["Gallbladder", "Pancreas", "Stomach"] },
    { q: "What is the basic unit of life?", a: "Cell", alt: ["Atom", "Molecule", "Organ"] },
    { q: "Heart has how many chambers?", a: "4", alt: ["2", "3", "5"] },
    { q: "Normal human body temperature?", a: "37°C (98.6°F)", alt: ["35°C", "39°C", "40°C"] },
    { q: "Which vitamin is produced by sunlight?", a: "Vitamin D", alt: ["Vitamin A", "Vitamin C", "Vitamin K"] },
    { q: "Blood type that is Universal Receiver?", a: "AB positive", alt: ["O positive", "A negative", "B positive"] }
];

const SCIENCE_POOL = [
    { q: "Closest planet to the Sun?", a: "Mercury", alt: ["Venus", "Mars", "Earth"] },
    { q: "Largest planet in our solar system?", a: "Jupiter", alt: ["Saturn", "Neptune", "Uranus"] },
    { q: "Main gas in Earth's atmosphere?", a: "Nitrogen (78%)", alt: ["Oxygen", "Argon", "Carbon Dioxide"] },
    { q: "Natural satellite of Earth?", a: "Moon", alt: ["Phobos", "Europa", "Titan"] },
    { q: "What is the Red Planet?", a: "Mars", alt: ["Venus", "Jupiter", "Saturn"] },
    { q: "Force responsible for ocean tides?", a: "Gravity of the Moon", alt: ["Rotation of Earth", "Solar Radiation", "Wind"] },
    { q: "Which planet has the most moons?", a: "Saturn", alt: ["Jupiter", "Uranus", "Neptune"] },
    { q: "How long does light take to reach Earth from the Sun?", a: "About 8 minutes", alt: ["1 second", "1 hour", "1 day"] },
    { q: "Stars are primarily made of?", a: "Hydrogen and Helium", alt: ["Carbon and Oxygen", "Iron and Nickel", "Silicon and Sulfur"] },
    { q: "What is a black hole?", a: "Region in space where gravity is so strong nothing escapes", alt: ["A collapsing star that emits blue light", "A galaxy with no stars", "An asteroid belt"] },
    { q: "Process by which water changes to vapor?", a: "Evaporation", alt: ["Condensation", "Precipitation", "Sublimation"] },
    { q: "What type of energy does solar panel produce?", a: "Electrical energy from light", alt: ["Thermal energy", "Mechanical energy", "Chemical energy"] },
    { q: "Who invented the telescope?", a: "Hans Lippershey", alt: ["Galileo", "Newton", "Kepler"] },
    { q: "Sound travels fastest through?", a: "Solids", alt: ["Liquids", "Gases", "Vacuum"] },
    { q: "Study of earthquakes is called?", a: "Seismology", alt: ["Geology", "Meteorology", "Volcanology"] },
    { q: "Which planet is known as Earth's twin?", a: "Venus", alt: ["Mars", "Mercury", "Saturn"] },
    { q: "Aurora Borealis is also called?", a: "Northern Lights", alt: ["Southern Lights", "Starfall", "Solar Flare"] },
    { q: "What layer of atmosphere contains ozone?", a: "Stratosphere", alt: ["Troposphere", "Mesosphere", "Thermosphere"] },
    { q: "What is the universe primarily composed of?", a: "Dark matter and Dark energy", alt: ["Stars and Galaxies", "Gas and Dust", "Planets and Moons"] },
    { q: "First artificial satellite launched?", a: "Sputnik 1 (by USSR)", alt: ["Explorer 1", "Vostok 1", "Apollo 1"] }
];

const TECH_POOL = [
    { q: "CEO of Google?", a: "Sundar Pichai", alt: ["Satya Nadella", "Tim Cook", "Mark Zuckerberg"] },
    { q: "CEO of Microsoft?", a: "Satya Nadella", alt: ["Bill Gates", "Sundar Pichai", "Steve Ballmer"] },
    { q: "Who founded Apple?", a: "Steve Jobs, Steve Wozniak, Ronald Wayne", alt: ["Bill Gates", "Jeff Bezos", "Mark Zuckerberg"] },
    { q: "Python was created by?", a: "Guido van Rossum", alt: ["James Gosling", "Brendan Eich", "Dennis Ritchie"] },
    { q: "JavaScript was created by?", a: "Brendan Eich", alt: ["Guido van Rossum", "James Gosling", "Linus Torvalds"] },
    { q: "Linux kernel was created by?", a: "Linus Torvalds", alt: ["Richard Stallman", "Dennis Ritchie", "Ken Thompson"] },
    { q: "Who founded Amazon?", a: "Jeff Bezos", alt: ["Elon Musk", "Larry Page", "Mark Zuckerberg"] },
    { q: "What does CPU stand for?", a: "Central Processing Unit", alt: ["Core Processing Unit", "Computer Power Unit", "Circuit Processing Unit"] },
    { q: "What does GPU stand for?", a: "Graphics Processing Unit", alt: ["General Processing Unit", "Grid Power Unit", "Graphic Parallel Unit"] },
    { q: "Who invented World Wide Web?", a: "Tim Berners-Lee", alt: ["Bill Gates", "Vint Cerf", "Alan Turing"] },
    { q: "First programming language?", a: "Fortran (1957)", alt: ["C", "COBOL", "Assembly"] },
    { q: "What does HTML stand for?", a: "HyperText Markup Language", alt: ["HyperTool Markup Language", "HyperText Main Language", "High-Text Markup Language"] },
    { q: "What does SQL stand for?", a: "Structured Query Language", alt: ["Sequential Query Logic", "Simple Query Language", "Standard Query List"] },
    { q: "Who founded Tesla?", a: "Martin Eberhard and Marc Tarpenning", alt: ["Elon Musk", "Jeff Bezos", "Bill Gates"] },
    { q: "First iPhone was released in?", a: "2007", alt: ["2005", "2009", "2010"] },
    { q: "What is the main language for Android development?", a: "Kotlin / Java", alt: ["Swift", "C++", "Python"] },
    { q: "What is Cloud Computing?", a: "Providing computing services over the internet", alt: ["Computing using cloud-shaped servers", "Weather prediction software", "Storage on physical hard drives"] },
    { q: "What does AI stand for?", a: "Artificial Intelligence", alt: ["Automated Interface", "Advanced Interaction", "Applied Integration"] },
    { q: "Who founded Microsoft?", a: "Bill Gates and Paul Allen", alt: ["Steve Jobs", "Jeff Bezos", "Larry Page"] },
    { q: "First computer mouse inventor?", a: "Douglas Engelbart", alt: ["Bill Gates", "Steve Jobs", "Alan Turing"] }
];

const IT_POOL = [
    { q: "Full form of RAM?", a: "Random Access Memory", alt: ["Read Access Memory", "Rapid Access Module", "Run Access Memory"] },
    { q: "Full form of ROM?", a: "Read Only Memory", alt: ["Random Only Memory", "Read Output Memory", "Rapid Output Module"] },
    { q: "Full form of HTTP?", a: "HyperText Transfer Protocol", alt: ["HyperText Terminal Protocol", "High Transfer Text Protocol", "Host Transfer Text Protocol"] },
    { q: "Full form of IP (in networking)?", a: "Internet Protocol", alt: ["Intranet Port", "Integrated Protocol", "Interface Port"] },
    { q: "What is a firewall?", a: "Security system that monitors network traffic", alt: ["A physical barrier for servers", "A backup system for databases", "A programming language for web"] },
    { q: "What does URL stand for?", a: "Uniform Resource Locator", alt: ["Universal Resource Link", "Uniform Reference Location", "United Resource Locator"] },
    { q: "What is an operating system?", a: "Software that manages hardware and software resources", alt: ["A security program for computers", "A type of database software", "A web browser"] },
    { q: "Binary number system uses digits?", a: "0 and 1", alt: ["0 to 9", "0 to 7", "0 to 15"] },
    { q: "What does VPN stand for?", a: "Virtual Private Network", alt: ["Verified Public Network", "Virtual Peripheral Node", "Virtual Protected Network"] },
    { q: "What is phishing?", a: "Cyber attack using deceptive emails to steal information", alt: ["Fishing for data on social media", "A type of network protocol", "Scanning physical documents"] },
    { q: "What is an algorithm?", a: "Step-by-step procedure to solve a problem", alt: ["A type of computer virus", "A programming language", "A data storage format"] },
    { q: "What does USB stand for?", a: "Universal Serial Bus", alt: ["Unified Storage Block", "Universal System Board", "User Serial Bridge"] },
    { q: "1 Terabyte equals how many Gigabytes?", a: "1024 GB", alt: ["100 GB", "512 GB", "2048 GB"] },
    { q: "What is open-source software?", a: "Software with publicly accessible source code", alt: ["Free commercial software", "Software with no user interface", "A government-funded OS"] },
    { q: "Which company developed the Android OS?", a: "Google", alt: ["Apple", "Microsoft", "Samsung"] },
    { q: "What is malware?", a: "Malicious software designed to damage systems", alt: ["A type of hardware failure", "A coding framework", "A network protocol"] },
    { q: "What does API stand for?", a: "Application Programming Interface", alt: ["Advanced Program Integration", "Application Port Interface", "Automated Protocol Interface"] },
    { q: "What does Wi-Fi stand for?", a: "Wireless Fidelity", alt: ["Wide Field Internet", "Wireless Frequency Interface", "Web Interface"] },
    { q: "Which layer does HTTP operate at?", a: "Application Layer", alt: ["Transport Layer", "Network Layer", "Data Link Layer"] },
    { q: "What is encryption?", a: "Converting data into a coded form for security", alt: ["Copying data to multiple servers", "Compressing files to save space", "Converting text to audio"] }
];

const SPORTS_POOL = [
    { q: "Cricket World Cup 2023 winner?", a: "Australia", alt: ["India", "England", "South Africa"] },
    { q: "Most Olympic gold medals (all-time athlete)?", a: "Michael Phelps (23 golds)", alt: ["Usain Bolt", "Carl Lewis", "Mark Spitz"] },
    { q: "Fastest man in the world (100m record)?", a: "Usain Bolt (9.58s)", alt: ["Yohan Blake", "Tyson Gay", "Asafa Powell"] },
    { q: "FIFA World Cup 2022 winner?", a: "Argentina", alt: ["France", "Morocco", "Croatia"] },
    { q: "Wimbledon is which type of tournament?", a: "Tennis (Grand Slam)", alt: ["Football", "Golf", "Badminton"] },
    { q: "How many players in a cricket team?", a: "11", alt: ["9", "12", "10"] },
    { q: "PV Sindhu is known for which sport?", a: "Badminton", alt: ["Tennis", "Table Tennis", "Squash"] },
    { q: "Virat Kohli plays which sport?", a: "Cricket", alt: ["Football", "Hockey", "Tennis"] },
    { q: "Lionel Messi plays for which country?", a: "Argentina", alt: ["Brazil", "Portugal", "Spain"] },
    { q: "Tour de France is related to which sport?", a: "Cycling", alt: ["Running", "Triathlon", "Swimming"] },
    { q: "Which country hosted 2020 Olympics (held in 2021)?", a: "Japan (Tokyo)", alt: ["China", "France", "USA"] },
    { q: "Formula 1 2023 World Champion?", a: "Max Verstappen", alt: ["Lewis Hamilton", "Charles Leclerc", "Fernando Alonso"] },
    { q: "Which sport uses a 'shuttlecock'?", a: "Badminton", alt: ["Tennis", "Squash", "Table Tennis"] },
    { q: "Chess world champion (2023)?", a: "Ding Liren", alt: ["Magnus Carlsen", "Ian Nepomniachtchi", "Fabiano Caruana"] },
    { q: "How many medals does a gold medal athlete receive at Olympics?", a: "One", alt: ["Two", "Three", "Four"] },
    { q: "Which country won most cricket World Cups?", a: "Australia (6 times)", alt: ["India", "West Indies", "England"] },
    { q: "Which sport does Neeraj Chopra play?", a: "Javelin Throw (Athletics)", alt: ["Cricket", "Tennis", "Swimming"] },
    { q: "Penalty kick in football taken from how many meters?", a: "11 meters", alt: ["8 meters", "15 meters", "12 meters"] },
    { q: "IPL stands for?", a: "Indian Premier League", alt: ["Indian Premier Leagues", "India Primary League", "Indian Pro League"] },
    { q: "First Indian to win Olympic gold medal individually?", a: "Abhinav Bindra", alt: ["Saina Nehwal", "Leander Paes", "Neeraj Chopra"] }
];

const ECONOMICS_POOL = [
    { q: "Currency of USA?", a: "US Dollar", alt: ["Euro", "Pound", "Yen"] },
    { q: "Currency of Japan?", a: "Japanese Yen", alt: ["Won", "Yuan", "Baht"] },
    { q: "Currency of UK?", a: "British Pound Sterling", alt: ["Euro", "Dollar", "Franc"] },
    { q: "Currency of India?", a: "Indian Rupee", alt: ["Dollar", "Taka", "Rial"] },
    { q: "Currency of China?", a: "Renminbi (Yuan)", alt: ["Won", "Yen", "Baht"] },
    { q: "Currency of European Union?", a: "Euro", alt: ["Pound", "Dollar", "Franc"] },
    { q: "World's largest economy (by GDP)?", a: "United States", alt: ["China", "Japan", "Germany"] },
    { q: "GDP stands for?", a: "Gross Domestic Product", alt: ["General Domestic Product", "Gross Direct Product", "General Direct Product"] },
    { q: "Inflation means?", a: "Rise in general price levels over time", alt: ["Fall in prices", "Rise in employment", "Rise in production"] },
    { q: "Stock market index in India?", a: "SENSEX and NIFTY", alt: ["DOW and NASDAQ", "FTSE and DAX", "Nikkei and Hang Seng"] },
    { q: "Reserve Bank of India (RBI) controls?", a: "Monetary Policy", alt: ["Fiscal Policy", "Trade Policy", "Defence Budget"] },
    { q: "What does IMF stand for?", a: "International Monetary Fund", alt: ["International Market Fund", "Integrated Monetary Finance", "International Modern Fund"] },
    { q: "What is a budget deficit?", a: "When government spending exceeds revenue", alt: ["When exports exceed imports", "When tax revenue exceeds spending", "When inflation exceeds 5%"] },
    { q: "Currency of UAE?", a: "Dirham", alt: ["Riyal", "Dinar", "Dollar"] },
    { q: "Currency of Saudi Arabia?", a: "Saudi Riyal", alt: ["Dirham", "Dinar", "Dollar"] },
    { q: "What does WTO stand for?", a: "World Trade Organization", alt: ["World Tax Organization", "Western Trade Office", "World Technology Order"] },
    { q: "Currency of Russia?", a: "Russian Ruble", alt: ["Kopek", "Grivna", "Zloty"] },
    { q: "Largest stock exchange in the world?", a: "NYSE (New York Stock Exchange)", alt: ["NASDAQ", "LSE", "BSE"] },
    { q: "Adam Smith is known as?", a: "Father of Modern Economics", alt: ["Father of Communism", "Father of Capitalism", "Father of Liberalism"] },
    { q: "What is FDI?", a: "Foreign Direct Investment", alt: ["Federal Domestic Income", "Foreign Domestic Index", "Financial Direct Interest"] }
];

const GEOLOGY_POOL = [
    { q: "Hardest natural mineral?", a: "Diamond", alt: ["Quartz", "Corundum", "Topaz"] },
    { q: "What is magma?", a: "Molten rock below Earth's surface", alt: ["Lava that has cooled", "Rock formed from pressure", "Sediment under ocean"] },
    { q: "Lava is magma that?", a: "Has reached the Earth's surface", alt: ["Is underground", "Is millions of years old", "Has been compressed"] },
    { q: "Richter scale measures?", a: "Earthquake magnitude", alt: ["Wind speed", "Rainfall", "Volcano temperature"] },
    { q: "Erosion is caused by?", a: "Wind, water, and ice", alt: ["Earthquakes only", "Volcanic eruptions", "Tidal waves"] },
    { q: "Which type of rock is formed from lava?", a: "Igneous rock", alt: ["Sedimentary rock", "Metamorphic rock", "Limestone"] },
    { q: "Sedimentary rocks are formed by?", a: "Layers of sediment compressed over time", alt: ["Heating of igneous rocks", "Volcanic eruptions", "Cooling of magma"] },
    { q: "Metamorphic rocks are formed by?", a: "Heat and pressure on existing rocks", alt: ["Cooling of lava", "Sediment deposits", "Chemical reactions in water"] },
    { q: "The Earth's crust is divided into?", a: "Tectonic plates", alt: ["Hemispheres", "Layers", "Belts"] },
    { q: "What is a fault in geology?", a: "A fracture in Earth's crust", alt: ["A type of rock layer", "A volcanic vent", "A tidal phenomenon"] },
    { q: "What causes earthquakes?", a: "Movement of tectonic plates", alt: ["Ocean currents", "Volcanic eruptions underwater", "Changes in atmospheric pressure"] },
    { q: "Deepest ocean in the world?", a: "Pacific Ocean (Mariana Trench)", alt: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"] },
    { q: "What is stalactite?", a: "Calcium deposit hanging from cave ceiling", alt: ["Rising from cave floor", "Type of crystal", "Underwater rock formation"] },
    { q: "Ring of Fire refers to?", a: "Earthquake and volcano zone around the Pacific Ocean", alt: ["Desert regions around Africa", "Mountain ranges in Asia", "Polar ice regions"] },
    { q: "Pumice is which type of rock?", a: "Igneous (volcanic)", alt: ["Sedimentary", "Metamorphic", "Organic"] },
    { q: "Most abundant metal in Earth's crust?", a: "Aluminum", alt: ["Iron", "Silicon", "Calcium"] },
    { q: "Fossil fuels are formed from?", a: "Remains of ancient plants and animals", alt: ["Chemical reactions in soil", "Volcanic ash", "Sandstone compression"] },
    { q: "Greatest mountain range on Earth?", a: "Himalayas", alt: ["Andes", "Rockies", "Alps"] },
    { q: "What is a delta in geography?", a: "Land formed at river's mouth by sediment", alt: ["Mountain plateau", "Ocean trench", "Canyon formation"] },
    { q: "Mohs scale measures?", a: "Mineral hardness", alt: ["Earthquake intensity", "Rock density", "Volcanic pressure"] }
];

const SOCIAL_SCIENCE_POOL = [
    { q: "What is democracy?", a: "Government by and for the people", alt: ["Rule by one person", "Rule by religious leaders", "Rule by military"] },
    { q: "Magna Carta was signed in?", a: "1215", alt: ["1066", "1350", "1492"] },
    { q: "What is a constitution?", a: "Supreme law governing a nation", alt: ["A type of election system", "A branch of military law", "A type of treaty"] },
    { q: "What is communism?", a: "Economic system where the state owns all production", alt: ["System where individuals own property", "System based on trade guilds", "System of military governance"] },
    { q: "What is capitalism?", a: "Economic system based on private ownership", alt: ["State-controlled economy", "Barter economy", "Religious economy"] },
    { q: "Industrial Revolution began in?", a: "18th century Britain", alt: ["17th century France", "19th century Germany", "18th century USA"] },
    { q: "UDHR was adopted in?", a: "10 December 1948", alt: ["1945", "1950", "1956"] },
    { q: "Cold War was primarily between?", a: "USA and USSR", alt: ["UK and France", "Germany and Russia", "China and USA"] },
    { q: "What is suffrage?", a: "Right to vote in elections", alt: ["Right to free speech", "Right to bear arms", "Right to own property"] },
    { q: "What is socialism?", a: "Economic system with collective ownership of production", alt: ["System where one person rules", "Military-led government", "Free market economy"] },
    { q: "United Nations was founded in?", a: "1945", alt: ["1919", "1939", "1950"] },
    { q: "What is federalism?", a: "Division of powers between national and state governments", alt: ["Single government system", "Military-controlled system", "Direct democracy"] },
    { q: "First country to give women the right to vote?", a: "New Zealand (1893)", alt: ["USA", "Australia", "UK"] },
    { q: "What is propaganda?", a: "Information used to influence public opinion", alt: ["Scientific fact-checking", "Military strategy", "Economic theory"] },
    { q: "Karl Marx co-wrote which manifesto?", a: "The Communist Manifesto", alt: ["The Capitalist Manifesto", "The Social Contract", "Das Kapital only"] },
    { q: "What is geopolitics?", a: "Influence of geography on international politics", alt: ["Study of local politics", "Military planning", "Economic planning"] },
    { q: "What is the most widely spoken language?", a: "Mandarin Chinese (native speakers)", alt: ["English", "Spanish", "Hindi"] },
    { q: "What is the World Bank?", a: "International organization providing loans for development", alt: ["Bank of all world currencies", "A US federal bank", "Largest commercial bank globally"] },
    { q: "Apartheid was a system of?", a: "Racial segregation in South Africa", alt: ["Religious rule in India", "Military governance in France", "Caste system in Japan"] },
    { q: "What is a monarchy?", a: "System of rule by a king or queen", alt: ["Rule by elected officials", "Rule by military generals", "Rule by religious leaders"] }
];

const MOVIES_POOL = [
    { q: "Who directed 'Inception'?", a: "Christopher Nolan", alt: ["Steven Spielberg", "James Cameron", "Quentin Tarantino"] },
    { q: "Which movie won the first Oscar for Best Picture?", a: "Wings", alt: ["Sunrise", "The Racket", "Seventh Heaven"] },
    { q: "What is the highest-grossing film of all time (unadjusted)?", a: "Avatar", alt: ["Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"] },
    { q: "Who played Jack in 'Titanic'?", a: "Leonardo DiCaprio", alt: ["Brad Pitt", "Tom Cruise", "Johnny Depp"] },
    { q: "Which film has the line: 'I'm going to make him an offer he can't refuse'?", a: "The Godfather", alt: ["Goodfellas", "Scarface", "Casino"] },
    { q: "Who is the voice of Woody in 'Toy Story'?", a: "Tom Hanks", alt: ["Tim Allen", "John Ratzenberger", "Don Rickles"] },
    { q: "Which 1994 movie features a character named Forrest Gump?", a: "Forrest Gump", alt: ["Pulp Fiction", "The Lion King", "Speed"] },
    { q: "Who directed 'Jaws'?", a: "Steven Spielberg", alt: ["George Lucas", "Alfred Hitchcock", "Martin Scorsese"] },
    { q: "Which actor played Iron Man in the MCU?", a: "Robert Downey Jr.", alt: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"] },
    { q: "What is the name of the kingdom in 'Frozen'?", a: "Arendelle", alt: ["Corona", "DunBroch", "Agrabah"] },
    { q: "Who played Joker in 'The Dark Knight'?", a: "Heath Ledger", alt: ["Joaquin Phoenix", "Jack Nicholson", "Jared Leto"] },
    { q: "Which movie features a theme park with cloned dinosaurs?", a: "Jurassic Park", alt: ["King Kong", "The Lost World", "Westworld"] },
    { q: "First feature-length animated movie released?", a: "Snow White and the Seven Dwarfs", alt: ["Pinocchio", "Fantasia", "Dumbo"] },
    { q: "Who directed 'Pulp Fiction'?", a: "Quentin Tarantino", alt: ["Guy Ritchie", "David Fincher", "Bryan Singer"] },
    { q: "Which film features the character 'Darth Vader'?", a: "Star Wars", alt: ["Star Trek", "The Matrix", "Blade Runner"] },
    { q: "Who played Katniss Everdeen in 'The Hunger Games'?", a: "Jennifer Lawrence", alt: ["Emma Watson", "Shailene Woodley", "Hailee Steinfeld"] },
    { q: "Which 2019 film follows a poor family infiltrating a wealthy household?", a: "Parasite", alt: ["The Irishman", "Joker", "1917"] },
    { q: "Who directed 'Schindler's List'?", a: "Steven Spielberg", alt: ["James Cameron", "Ron Howard", "Ridley Scott"] },
    { q: "Which film features the line: 'May the Force be with you'?", a: "Star Wars", alt: ["E.T.", "Back to the Future", "The Terminator"] },
    { q: "Who played the main character in 'The Matrix'?", a: "Keanu Reeves", alt: ["Laurence Fishburne", "Hugo Weaving", "Carrie-Anne Moss"] }
];

const GENERAL_KNOWLEDGE_POOL = [
    { q: "Who invented the telephone?", a: "Alexander Graham Bell", alt: ["Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"] },
    { q: "Who invented the light bulb?", a: "Thomas Edison", alt: ["Nikola Tesla", "Benjamin Franklin", "James Watt"] },
    { q: "Who discovered penicillin?", a: "Alexander Fleming", alt: ["Louis Pasteur", "Joseph Lister", "Marie Curie"] },
    { q: "Who invented the printing press?", a: "Johannes Gutenberg", alt: ["Leonardo da Vinci", "Isaac Newton", "Galileo Galilei"] },
    { q: "Who invented the airplane?", a: "Wright Brothers (Orville & Wilbur)", alt: ["Santos Dumont", "Hiram Maxim", "Glenn Curtiss"] },
    { q: "Tallest building in the world?", a: "Burj Khalifa (Dubai)", alt: ["Shanghai Tower", "Abraj Al-Bait Clock Tower", "Ping An Finance Centre"] },
    { q: "Largest ocean in the world?", a: "Pacific Ocean", alt: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"] },
    { q: "Largest country by area?", a: "Russia", alt: ["Canada", "China", "USA"] },
    { q: "Most populated country?", a: "India (2023)", alt: ["China", "USA", "Indonesia"] },
    { q: "Smallest country in the world?", a: "Vatican City", alt: ["Monaco", "San Marino", "Liechtenstein"] },
    { q: "What is the capital of France?", a: "Paris", alt: ["Rome", "Berlin", "Madrid"] },
    { q: "What is the capital of Japan?", a: "Tokyo", alt: ["Osaka", "Kyoto", "Hiroshima"] },
    { q: "Language with most native speakers?", a: "Mandarin Chinese", alt: ["English", "Spanish", "Hindi"] },
    { q: "Which continent has the most countries?", a: "Africa (54 countries)", alt: ["Europe", "Asia", "South America"] },
    { q: "Longest river in the world?", a: "Nile (Africa)", alt: ["Amazon", "Yangtze", "Mississippi"] },
    { q: "Largest desert in the world?", a: "Sahara Desert", alt: ["Antarctica", "Gobi Desert", "Arabian Desert"] },
    { q: "Highest mountain in the world?", a: "Mount Everest", alt: ["K2", "Kangchenjunga", "Lhotse"] },
    { q: "Number of countries in the world?", a: "195", alt: ["180", "196", "200"] },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", alt: ["Michelangelo", "Raphael", "Rembrandt"] },
    { q: "Author of Harry Potter?", a: "J.K. Rowling", alt: ["J.R.R. Tolkien", "C.S. Lewis", "Roald Dahl"] }
];

const MATH_OPERATIONS = [
    { op: "addition", fn: (a, b) => a + b, sym: "+" },
    { op: "subtraction", fn: (a, b) => a - b, sym: "-" },
    { op: "multiplication", fn: (a, b) => a * b, sym: "×" },
];

// ─── GENERATORS ─────────────────────────────────────────────────────────────

function pickFrom(pool, level, index) {
    return pool[(index * 7 + level * 3) % pool.length];
}

function generateMathQuestion(level, index) {
    const tier = Math.floor((level - 1) / 50); // 0,1,2,3
    const opIdx = (index + level) % MATH_OPERATIONS.length;
    const op = MATH_OPERATIONS[opIdx];

    let a, b, answer, question;
    const seed = level * 13 + index * 7;

    if (tier === 0) {
        // Easy: small numbers
        a = (seed % 20) + 5;
        b = (seed % 15) + 3;
    } else if (tier === 1) {
        // Medium
        a = (seed % 50) + 20;
        b = (seed % 30) + 10;
    } else if (tier === 2) {
        // Hard
        a = (seed % 200) + 50;
        b = (seed % 50) + 10;
    } else {
        // Very hard
        a = (seed % 500) + 100;
        b = (seed % 100) + 20;
    }

    if (op.op === "subtraction" && a < b) { const tmp = a; a = b; b = tmp; }
    answer = op.fn(a, b);

    question = `[Level ${level}] What is ${a} ${op.sym} ${b}?`;

    const wrong1 = answer + (seed % 5) + 1;
    const wrong2 = answer - (seed % 4) - 1;
    const wrong3 = answer + 10;
    const options = [answer.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()]
        .sort(() => Math.random() - 0.5);

    return {
        question,
        options,
        correctIndex: options.indexOf(answer.toString()),
        category: 'Mathematics',
        level
    };
}

function generateFromPool(pool, level, index, category) {
    const item = pickFrom(pool, level, index);
    const question = `Level ${level}: ${item.q}`;
    const options = [item.a, ...item.alt].sort(() => Math.random() - 0.5);
    return {
        question,
        options,
        correctIndex: options.indexOf(item.a),
        category,
        level
    };
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        await Question.deleteMany({});
        console.log('🗑️ Database cleared.');

        const allQuestions = [];

        for (let level = 1; level <= 200; level++) {
            for (const category of CATEGORIES) {
                for (let qIdx = 0; qIdx < 15; qIdx++) {
                    let q;

                    switch (category) {
                        case 'Mathematics':
                            q = generateMathQuestion(level, qIdx);
                            break;
                        case 'Kerala':
                            q = generateFromPool(KERALA_POOL, level, qIdx, category);
                            break;
                        case 'India':
                            q = generateFromPool(INDIA_POOL, level, qIdx, category);
                            break;
                        case 'History':
                            q = generateFromPool(HISTORY_POOL, level, qIdx, category);
                            break;
                        case 'Physics':
                            q = generateFromPool(PHYSICS_POOL, level, qIdx, category);
                            break;
                        case 'Chemistry':
                            q = generateFromPool(CHEMISTRY_POOL_Q, level, qIdx, category);
                            break;
                        case 'Biology':
                            q = generateFromPool(BIOLOGY_POOL, level, qIdx, category);
                            break;
                        case 'Science':
                            q = generateFromPool(SCIENCE_POOL, level, qIdx, category);
                            break;
                        case 'Technology':
                            q = generateFromPool(TECH_POOL, level, qIdx, category);
                            break;
                        case 'IT':
                            q = generateFromPool(IT_POOL, level, qIdx, category);
                            break;
                        case 'Sports':
                            q = generateFromPool(SPORTS_POOL, level, qIdx, category);
                            break;
                        case 'Economics':
                            q = generateFromPool(ECONOMICS_POOL, level, qIdx, category);
                            break;
                        case 'Geology':
                            q = generateFromPool(GEOLOGY_POOL, level, qIdx, category);
                            break;
                        case 'Social Science':
                            q = generateFromPool(SOCIAL_SCIENCE_POOL, level, qIdx, category);
                            break;
                        case 'General Knowledge':
                            q = generateFromPool(GENERAL_KNOWLEDGE_POOL, level, qIdx, category);
                            break;
                        case 'Movies':
                            q = generateFromPool(MOVIES_POOL, level, qIdx, category);
                            break;
                        default:
                            q = generateFromPool(GENERAL_KNOWLEDGE_POOL, level, qIdx, category);
                    }

                    allQuestions.push(q);
                }
            }
            if (level % 25 === 0) console.log(`⏳ Prepared up to Level ${level}...`);
        }

        console.log(`🚀 Inserting ${allQuestions.length} questions...`);
        const chunkSize = 2000;
        for (let i = 0; i < allQuestions.length; i += chunkSize) {
            const chunk = allQuestions.slice(i, i + chunkSize);
            await Question.insertMany(chunk);
            console.log(`✅ Progress: ${i + chunk.length}/${allQuestions.length}`);
        }

        console.log('🏁 SEEDING COMPLETE: 200 levels × 15 categories × 15 questions = 45,000 entries');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
}

seed();
