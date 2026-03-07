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
    { q: "Thrissur Pooram is held at which temple?", a: "Vadakkumnathan Temple", alt: ["Guruvayur Temple", "Ettumanoor Temple", "Ernakulam Shiva Temple"] },
    { q: "Which district in Kerala is known as the 'Land of Looms and Lores'?", a: "Kannur", alt: ["Kasaragod", "Kozhikode", "Palakkad"] },
    { q: "The silent valley national park is located in?", a: "Palakkad", alt: ["Idukki", "Wayanad", "Pathanamthitta"] },
    { q: "Which Kerala ruler is known as the 'Maker of Modern Travancore'?", a: "Marthanda Varma", alt: ["Swathi Thirunal", "Dharma Raja", "Ayilyam Thirunal"] },
    { q: "The snake boat race of Kerala is called?", a: "Vallam Kali", alt: ["Kalaripayattu", "Pulikali", "Theyyam"] },
    { q: "Which is the smallest district in Kerala by area?", a: "Alappuzha", alt: ["Kasaragod", "Pathanamthitta", "Wayanad"] },
    { q: "The first fully literate district in India (in Kerala)?", a: "Kottayam", alt: ["Ernakulam", "Thrissur", "Palakkad"] },
    { q: "Which city is known as the 'Cultural Capital of Kerala'?", a: "Thrissur", alt: ["Kochi", "Kozhikode", "Thiruvananthapuram"] },
    { q: "Which is the first hydro-electric project in Kerala?", a: "Pallivasal", alt: ["Idukki", "Sabarigiri", "Kuttiyadi"] },
    { q: "The first Malayali to become the President of India?", a: "K.R. Narayanan", alt: ["V.K. Krishna Menon", "K.P.S. Menon", "C. Sankaran Nair"] },
    { q: "Which district is known as the 'Gateway to Kerala'?", a: "Palakkad", alt: ["Ernakulam", "Idukki", "Kollam"] },
    { q: "The famous Sabarimala temple is in which district?", a: "Pathanamthitta", alt: ["Idukki", "Kottayam", "Palakkad"] },
    { q: "Which Kerala city is known as the 'Land of Three Seas'?", a: "Kanyakumari (historical)", alt: ["Kochi", "Kollam", "Kasaragod"] },
    { q: "The first digital district in Kerala?", a: "Kannur", alt: ["Ernakulam", "Thiruvananthapuram", "Kozhikode"] },
    { q: "Which island in Kochi is famous for its Chinese fishing nets?", a: "Fort Kochi", alt: ["Willingdon Island", "Vypin", "Bolgatty"] },
    { q: "The first university in Kerala?", a: "University of Kerala", alt: ["MG University", "Calicut University", "CUSAT"] },
    { q: "Which river is called the 'Yellow River of Kerala'?", a: "Kuttiyadi", alt: ["Periyar", "Pamba", "Bharathapuzha"] },
    { q: "The first Malayalam printing press was at?", a: "Kottayam", alt: ["Kochi", "Thrissur", "Kollam"] },
    { q: "Which district in Kerala has the longest coastline?", a: "Kannur", alt: ["Kollam", "Alappuzha", "Kasharagod"] },
    { q: "The first solar-powered international airport in Kerala?", a: "CIAL (Kochi)", alt: ["Trivandrum", "Calicut", "Kannur"] },
    { q: "Which district is known as the 'Rice Bowl of Kerala'?", a: "Kuttanad (Alappuzha)", alt: ["Palakkad", "Thrissur", "Wayanad"] },
    { q: "The first wildlife sanctuary in Kerala?", a: "Periyar", alt: ["Wayanad", "Silent Valley", "Eravikulam"] },
    { q: "Which Kerala personality is known as 'Kerala Gandhi'?", a: "K. Kelappan", alt: ["A.K. Gopalan", "E.M.S. Namboodiripad", "P. Krishna Pillai"] },
    { q: "Sabarigiri is the second largest hydroelectric project in?", a: "Kerala", alt: ["Tamil Nadu", "Karnataka", "Andhra Pradesh"] },
    { q: "Which is the highest peak in Kerala?", a: "Anamudi", alt: ["Mullayanagiri", "Agasthyarkoodam", "Chembra Peak"] },
    { q: "The famous Bekal Fort is in which district?", a: "Kasaragod", alt: ["Kannur", "Wayanad", "Kozhikode"] },
    { q: "Which river is known as the 'Life line of Kerala'?", a: "Periyar", alt: ["Pamba", "Bharathapuzha", "Chaliyar"] },
    { q: "Who is known as 'Kerala Vyasa'?", a: "Kodungallur Kunjikkuttan Thampuran", alt: ["Vallathol", "Ezhuthachan", "Cherusseri"] },
    { q: "The first newspaper in Malayalam?", a: "Rajyasamacharam", alt: ["Malayala Manorama", "Mathrubhumi", "Deepika"] },
    { q: "Which Kerala district has the most number of rivers?", a: "Kasaragod", alt: ["Palakkad", "Idukki", "Ernakulam"] },
    { q: "The Athirappilly falls are in which district?", a: "Thrissur", alt: ["Ernakulam", "Idukki", "Wayanad"] },
    { q: "Who founded the 'SNDP Yogam'?", a: "Sree Narayana Guru", alt: ["Ayyankali", "Sahodaran Ayyappan", "Kumaran Asan"] },
    { q: "Which is the largest artificial lake in Kerala?", a: "Idukki Reservoir", alt: ["Neyyar Dam", "Malampuzha Dam", "Peechi Dam"] },
    { q: "The first rocket launch in India was from?", a: "Thumba (Kerala)", alt: ["Sriharikota", "Chandipur", "Pokhran"] },
    { q: "Which district is known as the 'Cashew Capital of the World'?", a: "Kollam", alt: ["Kochi", "Kasaragod", "Kannur"] },
    { q: "The first railway line in Kerala was between?", a: "Tirur and Beypore", alt: ["Kochi and Shoranur", "Trivandrum and Kollam", "Kannur and Mangalore"] },
    { q: "Who is known as the 'Jhansi Rani of Travancore'?", a: "Accamma Cherian", alt: ["A.V. Kuttimalu Amma", "Anna Chandy", "Lalithambika Antharjanam"] }
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
    { q: "Which city hosts the Parliament of India?", a: "New Delhi", alt: ["Mumbai", "Kolkata", "Hyderabad"] },
    { q: "Which state is known as the 'Land of Five Rivers'?", a: "Punjab", alt: ["Haryana", "Rajasthan", "Uttar Pradesh"] },
    { q: "Who is known as the 'Iron Man of India'?", a: "Sardar Patel", alt: ["Subhash Chandra Bose", "B.R. Ambedkar", "Jawaharlal Nehru"] },
    { q: "The highest mountain peak in India is?", a: "Kangchenjunga", alt: ["Mount Everest", "K2", "Nanda Devi"] },
    { q: "Which is the largest fresh water lake in India?", a: "Wular Lake", alt: ["Chilika Lake", "Dal Lake", "Pulicat Lake"] },
    { q: "The first Indian woman to win an Olympic medal?", a: "Karnam Malleswari", alt: ["Saina Nehwal", "Mary Kom", "P.V. Sindhu"] },
    { q: "Which city is known as the 'Diamond City of India'?", a: "Surat", alt: ["Mumbai", "Jaipur", "Hyderabad"] },
    { q: "The largest desert in India is?", a: "Thar Desert", alt: ["Ladakh Desert", "Spiti Desert", "Rann of Kutch"] },
    { q: "Which state in India has the longest coastline?", a: "Gujarat", alt: ["Maharashtra", "Tamil Nadu", "Andhra Pradesh"] },
    { q: "Who wrote the national anthem of India?", a: "Rabindranath Tagore", alt: ["Bankim Chandra Chatterjee", "Sarojini Naidu", "Mahatma Gandhi"] },
    { q: "The classic dance form 'Kathakali' originated in?", a: "Kerala", alt: ["Tamil Nadu", "Andhra Pradesh", "Karnataka"] },
    { q: "Which is the oldest mountain range in India?", a: "Aravalli Range", alt: ["Himalayas", "Western Ghats", "Vindhya Range"] },
    { q: "The 'Sun Temple' of India is located in?", a: "Konark", alt: ["Madurai", "Hampi", "Khajuraho"] },
    { q: "Who was the first woman Prime Minister of India?", a: "Indira Gandhi", alt: ["Sonia Gandhi", "Pratibha Patil", "Sarojini Naidu"] },
    { q: "Which Indian city is known as the 'Tea City of India'?", a: "Dibrugarh", alt: ["Darjeeling", "Munnar", "Guwahati"] },
    { q: "The 'Kaziranga National Park' is famous for?", a: "One-horned Rhinoceros", alt: ["Bengal Tiger", "Asiatic Lion", "Elephant"] },
    { q: "Which state is known as the 'Spices Garden of India'?", a: "Kerala", alt: ["Tamil Nadu", "Andhra Pradesh", "Karnataka"] },
    { q: "The Indian standard time is based on the longitude of?", a: "Mirzapur (82.5°E)", alt: ["Delhi", "Mumbai", "Kolkata"] },
    { q: "Which is the largest museum in India?", a: "Indian Museum (Kolkata)", alt: ["National Museum (Delhi)", "Salar Jung Museum (Hyderabad)", "Government Museum (Chennai)"] },
    { q: "Who founded the 'Swatantra Party' in India?", a: "C. Rajagopalachari", alt: ["Sardar Patel", "Jawaharlal Nehru", "Morarji Desai"] },
    { q: "Which state is known as the 'Fruit Bowl of India'?", a: "Himachal Pradesh", alt: ["Uttarakhand", "Jammu and Kashmir", "Sikkim"] },
    { q: "First Indian to win the Nobel Prize?", a: "Rabindranath Tagore", alt: ["C.V. Raman", "Mother Teresa", "Amartya Sen"] },
    { q: "Which is the largest cave temple in India?", a: "Kailasa Temple (Ellora)", alt: ["Ajanta Caves", "Elephanta Caves", "Badami Caves"] },
    { q: "India's first satellite name?", a: "Aryabhata", alt: ["Bhaskara", "Rohini", "INSAT"] },
    { q: "In which year did India win its first Cricket World Cup?", a: "1983", alt: ["2007", "2011", "1975"] },
    { q: "Which Indian state has the highest literacy rate?", a: "Kerala", alt: ["Mizoram", "Goa", "Maharashtra"] },
    { q: "Who is known as the 'Nightingale of India'?", a: "Sarojini Naidu", alt: ["Lata Mangeshkar", "Asha Bhosle", "Indira Gandhi"] },
    { q: "The Indian standard meridian passes through which state?", a: "Uttar Pradesh", alt: ["Bihar", "West Bengal", "Odisha"] },
    { q: "Which is the largest producer of silk in India?", a: "Karnataka", alt: ["Andhra Pradesh", "Tamil Nadu", "West Bengal"] },
    { q: "Who was the first Indian to go into space?", a: "Rakesh Sharma", alt: ["Kalpana Chawla", "Sunita Williams", "Ravish Malhotra"] },
    { q: "The first Indian woman to climb Mount Everest was?", a: "Bachendri Pal", alt: ["Santosh Yadav", "Arunima Sinha", "Premlata Agrawal"] }
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
    { q: "Mahatma Gandhi assassinated in?", a: "1948", alt: ["1947", "1950", "1945"] },
    { q: "The 'Black Death' pandemic peaked in Europe during which century?", a: "14th Century", alt: ["12th Century", "16th Century", "18th Century"] },
    { q: "Who was the primary author of the Declaration of Independence?", a: "Thomas Jefferson", alt: ["John Adams", "Benjamin Franklin", "Thomas Paine"] },
    { q: "The Battle of Waterloo was fought in which year?", a: "1815", alt: ["1805", "1825", "1795"] },
    { q: "Who was the first woman to win a Nobel Prize?", a: "Marie Curie", alt: ["Mother Teresa", "Jane Addams", "Irène Joliot-Curie"] },
    { q: "Which ancient civilization built Machu Picchu?", a: "The Incas", alt: ["The Aztecs", "The Mayans", "The Olmecs"] },
    { q: "The 'Cold War' ended with the dissolution of which nation?", a: "Soviet Union", alt: ["East Germany", "Yugoslavia", "Czechoslovakia"] },
    { q: "The 'Industrial Revolution' began in which country?", a: "Great Britain", alt: ["Germany", "France", "USA"] },
    { q: "Who was the Roman emperor when Rome was burned in 64 AD?", a: "Nero", alt: ["Caligula", "Tiberius", "Claudius"] },
    { q: "The 'Treaty of Versailles' ended which war?", a: "World War I", alt: ["World War II", "Napoleonic Wars", "Crimean War"] },
    { q: "Who was the first human to travel into space?", a: "Yuri Gagarin", alt: ["Alan Shepard", "John Glenn", "Neil Armstrong"] },
    { q: "The 'Aztec Empire' was located in which modern-day country?", a: "Mexico", alt: ["Peru", "Brazil", "Chile"] },
    { q: "Who was the leader of the civil rights movement in the USA in the 1960s?", a: "Martin Luther King Jr.", alt: ["Malcolm X", "Rosa Parks", "John F. Kennedy"] },
    { q: "Ancient Mesopotamian civilization was located in which modern country?", a: "Iraq", alt: ["Iran", "Egypt", "Syria"] },
    { q: "Who was the last Tsar of Russia?", a: "Nicholas II", alt: ["Alexander III", "Peter the Great", "Ivan the Terrible"] },
    { q: "Which civilization built the pyramids of Giza?", a: "Ancient Egyptians", alt: ["Mesopotamians", "Greeks", "Romans"] },
    { q: "Who was known as the 'Iron Chancellor' of Germany?", a: "Otto von Bismarck", alt: ["Helmuth von Moltke", "Wilhelm I", "Friedrich III"] },
    { q: "The 'Thirty Years' War' was primarily fought in which region?", a: "Central Europe", alt: ["Western Europe", "Northern Europe", "Southern Europe"] },
    { q: "Who was the Queen of Egypt who had relationships with Julius Caesar and Mark Antony?", a: "Cleopatra", alt: ["Nefertiti", "Hatshepsut", "Twosret"] },
    { q: "The 'Silk Road' connected China with which region?", a: "Europe and the Mediterranean", alt: ["South America", "Sub-Saharan Africa", "Australia"] },
    { q: "Who was the primary leader of the Indian Independence Movement against British rule?", a: "Mahatma Gandhi", alt: ["Jawaharlal Nehru", "Subhash Chandra Bose", "Sardar Patel"] }
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
    { q: "Nuclear fission involves?", a: "Splitting of atomic nucleus", alt: ["Joining of atoms", "Electron excitation", "Proton emission"] },
    { q: "What is the acceleration due to gravity on Earth (approx)?", a: "9.8 m/s²", alt: ["8.9 m/s²", "10.5 m/s²", "7.5 m/s²"] },
    { q: "Which subatomic particle has a positive charge?", a: "Proton", alt: ["Electron", "Neutron", "Positron"] },
    { q: "What is the primary state of matter in stars?", a: "Plasma", alt: ["Gas", "Liquid", "Solid"] },
    { q: "The process of a solid changing directly to gas is called?", a: "Sublimation", alt: ["Evaporation", "Condensation", "Deposition"] },
    { q: "Which scientist discovered the electron?", a: "J.J. Thomson", alt: ["Ernest Rutherford", "James Chadwick", "Niels Bohr"] },
    { q: "What is the unit of magnetic flux?", a: "Weber", alt: ["Tesla", "Gauss", "Henry"] },
    { q: "Which property of light describes its ability to bend around corners?", a: "Diffraction", alt: ["Refraction", "Reflection", "Polarization"] },
    { q: "What is the escape velocity from Earth (approx)?", a: "11.2 km/s", alt: ["7.9 km/s", "15.5 km/s", "25 km/s"] },
    { q: "Who formulated the laws of electromagnetic induction?", a: "Michael Faraday", alt: ["James Clerk Maxwell", "Andre-Marie Ampère", "Hans Christian Ørsted"] },
    { q: "What is the unit of capacitance?", a: "Farad", alt: ["Henry", "Siemens", "Coulomb"] },
    { q: "Which type of electromagnetic radiation has the shortest wavelength?", a: "Gamma rays", alt: ["X-rays", "Ultraviolet", "Radio waves"] },
    { q: "The 'Big Bang Theory' explains the origin of?", a: "The Universe", alt: ["The Solar System", "The Earth", "Life"] },
    { q: "What is the most abundant element in the universe?", a: "Hydrogen", alt: ["Helium", "Oxygen", "Carbon"] },
    { q: "Which phenomenon explains why the sky is blue?", a: "Rayleigh scattering", alt: ["Tyndall effect", "Refraction", "Reflection"] },
    { q: "What is the unit of radioactivity?", a: "Becquerel", alt: ["Curie", "Gray", "Sievert"] },
    { q: "Who proposed the uncertainty principle?", a: "Werner Heisenberg", alt: ["Erwin Schrödinger", "Max Born", "Wolfgang Pauli"] },
    { q: "What is the color of light with the longest wavelength in the visible spectrum?", a: "Red", alt: ["Blue", "Green", "Violet"] },
    { q: "A 'quantum' refers to?", a: "The smallest discrete unit of a physical property", alt: ["A large amount of energy", "A type of subatomic particle", "A mathematical constant"] },
    { q: "What is the refractive index of vacuum?", a: "1.0", alt: ["1.33", "1.5", "0.0"] },
    { q: "Which force holds protons and neutrons together in a nucleus?", a: "Strong nuclear force", alt: ["Weak nuclear force", "Electromagnetic force", "Gravity"] },
    { q: "What is the unit of work?", a: "Joule", alt: ["Watt", "Newton", "Pascal"] },
    { q: "Which law states that For every action, there is an equal and opposite reaction?", a: "Newton's Third Law", alt: ["Newton's First Law", "Newton's Second Law", "Law of Universal Gravitation"] },
    { q: "What is the process of heat transfer in a fluid (liquid or gas)?", a: "Convection", alt: ["Conduction", "Radiation", "Sublimation"] },
    { q: "Which type of mirror is used in car headlights?", a: "Concave mirror", alt: ["Convex mirror", "Plane mirror", "Spherical mirror"] },
    { q: "The rate of change of momentum of an object is proportional to?", a: "Applied force", alt: ["Mass", "Velocity", "Acceleration"] },
    { q: "What is the unit of luminous intensity?", a: "Candela", alt: ["Lumen", "Lux", "Watt"] },
    { q: "Which scientist discovered X-rays?", a: "Wilhelm Conrad Röntgen", alt: ["Marie Curie", "Ernest Rutherford", "Max Planck"] },
    { q: "The bending of light when it passes from one medium to another is called?", a: "Refraction", alt: ["Reflection", "Diffraction", "Absorption"] },
    { q: "What is the unit of electrical potential difference?", a: "Volt", alt: ["Ampere", "Ohm", "Watt"] },
    { q: "Which particle is responsible for carrying electrical charge in a traditional circuit?", a: "Electron", alt: ["Proton", "Neutron", "Positron"] }
];

const SPORTS_POOL = [
    { q: "Who is known as the 'Little Master' in cricket?", a: "Sachin Tendulkar", alt: ["Virat Kohli", "Sourav Ganguly", "MS Dhoni"] },
    { q: "Winner of FIFA World Cup 2022?", a: "Argentina", alt: ["France", "Brazil", "Germany"] },
    { q: "Usain Bolt is famous for which sport?", a: "Sprinting", alt: ["Swimming", "Long Jump", "Cycling"] },
    { q: "How many players in a football team (on field)?", a: "11", alt: ["10", "12", "7"] },
    { q: "Olympic Games are held every ___ years?", a: "4 years", alt: ["2 years", "5 years", "1 year"] },
    { q: "Which sport is related to 'Grand Slam'?", a: "Tennis", alt: ["Golf", "Badminton", "Cricket"] },
    { q: "How many rings are in the Olympic logo?", a: "5", alt: ["4", "6", "3"] },
    { q: "National sport of Japan?", a: "Sumo Wrestling", alt: ["Judo", "Karate", "Baseball"] },
    { q: "Tiger Woods is related to which sport?", a: "Golf", alt: ["Tennis", "Polo", "Chess"] },
    { q: "Dimension of a cricket pitch?", a: "22 yards", alt: ["20 yards", "24 yards", "25 yards"] },
    { q: "Where is the 'Lord's' cricket ground located?", a: "London", alt: ["Sydney", "Mumbai", "Cape Town"] },
    { q: "How many colors make up the Olympic rings?", a: "5 (Blue, Yellow, Black, Green, Red)", alt: ["4", "6", "3"] },
    { q: "Who has won the most Ballon d'Or awards?", a: "Lionel Messi", alt: ["Cristiano Ronaldo", "Pele", "Maradona"] },
    { q: "Which country has won the most FIFA World Cups?", a: "Brazil", alt: ["Germany", "Italy", "Argentina"] },
    { q: "The term 'Birdie' is used in which sport?", a: "Golf", alt: ["Badminton", "Tennis", "Hockey"] },
    { q: "Who is known as the 'Flying Sikh' of India?", a: "Milkha Singh", alt: ["Sandeep Singh", "Abhinav Bindra", "Dhyan Chand"] },
    { q: "How many players are there in a Basketball team (on court)?", a: "5", alt: ["7", "6", "11"] },
    { q: "Which city hosted the first modern Olympic Games in 1896?", a: "Athens", alt: ["Paris", "London", "Rome"] },
    { q: "In which sport would you use a 'Puck'?", a: "Ice Hockey", alt: ["Field Hockey", "Golf", "Polo"] },
    { q: "Who holds the record for the most centuries in international cricket?", a: "Sachin Tendulkar", alt: ["Virat Kohli", "Ricky Ponting", "Kumar Sangakkara"] },
    { q: "Which country is the birthplace of Golf?", a: "Scotland", alt: ["England", "Ireland", "France"] },
    { q: "What is the length of a Marathon race?", a: "42.195 km", alt: ["40 km", "45 km", "50 km"] },
    { q: "Which trophy is awarded in women's team tennis?", a: "Billie Jean King Cup (Fed Cup)", alt: ["Davis Cup", "Wightman Cup", "Hopman Cup"] },
    { q: "Who is known as 'The Greatest' in boxing?", a: "Muhammad Ali", alt: ["Mike Tyson", "Joe Frazier", "Sugar Ray Leonard"] },
    { q: "How many players are in a Volleyball team?", a: "6", alt: ["5", "7", "4"] },
    { q: "Which sport features a 'Checkmate'?", a: "Chess", alt: ["Scrabble", "Bridge", "Ludo"] },
    { q: "Who won the first-ever Cricket World Cup in 1975?", a: "West Indies", alt: ["Australia", "England", "India"] },
    { q: "Which surface is the French Open tennis tournament played on?", a: "Clay", alt: ["Grass", "Hard", "Carpet"] },
    { q: "What is the maximum break possible in Snooker?", a: "147", alt: ["155", "140", "150"] },
    { q: "Which country hosts the 'Tour de France' cycling race?", a: "France", alt: ["Italy", "Spain", "Belgium"] },
    { q: "Who is the most decorated Olympian of all time?", a: "Michael Phelps", alt: ["Usain Bolt", "Simone Biles", "Larisa Latynina"] },
    { q: "Which sport uses a 'Shuttlecock'?", a: "Badminton", alt: ["Tennis", "Table Tennis", "Squash"] },
    { q: "How many balls are on a pool table at the start of an 8-ball game?", a: "16 (including cue ball)", alt: ["15", "9", "21"] },
    { q: "Which country has won the most Olympic gold medals?", a: "USA", alt: ["China", "Russia", "Germany"] },
    { q: "What is the national sport of Canada?", a: "Lacrosse / Ice Hockey", alt: ["Baseball", "Basketball", "Soccer"] },
    { q: "Who was the 'Wizard of Hockey'?", a: "Dhyan Chand", alt: ["Dhanraj Pillay", "Sardar Singh", "Balbir Singh Sr."] },
    { q: "Which city is the headquarters of the ICC?", a: "Dubai", alt: ["London", "Mumbai", "Melbourne"] },
    { q: "What is the duration of a standard Kabaddi match?", a: "40 minutes", alt: ["30 minutes", "50 minutes", "60 minutes"] },
    { q: "Which country is home to the 'All Blacks' rugby team?", a: "New Zealand", alt: ["Australia", "South Africa", "England"] },
    { q: "Who is the first Indian women to reach an Olympic final in wrestling?", a: "Vinesh Phogat / Sakshi Malik", alt: ["Bajrang Punia", "Geeta Phogat", "Babita Kumari"] },
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
    { q: "First Indian to win Olympic gold medal individually?", a: "Abhinav Bindra", alt: ["Saina Nehwal", "Leander Paes", "Neeraj Chopra"] },
    { q: "Who is known as the 'God of Cricket'?", a: "Sachin Tendulkar", alt: ["Brian Lara", "Ricky Ponting", "Donald Bradman"] },
    { q: "Which country hosted the first-ever FIFA World Cup?", a: "Uruguay", alt: ["Brazil", "Italy", "France"] },
    { q: "Who won the Wimbledon 2023 Men's title?", a: "Carlos Alcaraz", alt: ["Novak Djokovic", "Roger Federer", "Rafael Nadal"] },
    { q: "What is the distance of a half-marathon?", a: "21.0975 km", alt: ["20 km", "25 km", "10 km"] },
    { q: "In which city is the 'Eden Gardens' cricket stadium located?", a: "Kolkata", alt: ["Mumbai", "London", "Sydney"] },
    { q: "Who is the first person to run a mile in under 4 minutes?", a: "Roger Bannister", alt: ["Usain Bolt", "Eliud Kipchoge", "Carl Lewis"] },
    { q: "Which country won the most medals in the 2020 Tokyo Olympics?", a: "USA", alt: ["China", "Japan", "Great Britain"] },
    { q: "The 'Ryder Cup' is awarded in which sport?", a: "Golf", alt: ["Tennis", "Polo", "Rugby"] },
    { q: "Who played for both Manchester United and Real Madrid?", a: "Cristiano Ronaldo", alt: ["Lionel Messi", "Zinedine Zidane", "Ronaldinho"] },
    { q: "Which country is known as the 'Home of Cricket'?", a: "England", alt: ["Australia", "India", "South Africa"] }
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
    { q: "What is FDI?", a: "Foreign Direct Investment", alt: ["Federal Domestic Income", "Foreign Domestic Index", "Financial Direct Interest"] },
    { q: "What is a Monopoly?", a: "Market structure with a single seller", alt: ["Market with many buyers", "Market with only two sellers", "Market with no regulation"] },
    { q: "What does 'Laissez-faire' mean?", a: "Government non-interference in economy", alt: ["High tax system", "Strict trade regulations", "State-controlled production"] },
    { q: "Currency of Switzerland?", a: "Swiss Franc", alt: ["Euro", "Dollar", "Guilder"] },
    { q: "Who is the author of 'The Wealth of Nations'?", a: "Adam Smith", alt: ["John Maynard Keynes", "Karl Marx", "David Ricardo"] },
    { q: "What is an 'Oligopoly'?", a: "Market dominated by a few large firms", alt: ["Market with millions of small firms", "Market with no sellers", "Market controlled by consumers"] },
    { q: "Currency of South Africa?", a: "Rand", alt: ["Shilling", "Dinar", "Pound"] },
    { q: "What is 'Microeconomics'?", a: "Study of individual agents and markets", alt: ["Study of national economies", "Study of global trade", "Study of financial history"] },
    { q: "What is 'Macroeconomics'?", a: "Study of economy as a whole", alt: ["Study of personal finance", "Study of local grocery stores", "Study of individual consumer behavior"] },
    { q: "What is the main function of the World Bank?", a: "Providing loans to developing countries for capital programs", alt: ["Printing world currency", "Regulating stock markets", "Running global taxes"] },
    { q: "What is 'Fiscal Policy'?", a: "Use of government spending and tax to influence economy", alt: ["Bank interest rate adjustments", "Import/Export regulations", "Environmental protection rules"] }
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
    { q: "Mohs scale measures?", a: "Mineral hardness", alt: ["Earthquake intensity", "Rock density", "Volcanic pressure"] },
    { q: "What is 'Petrology'?", a: "Study of rocks", alt: ["Study of plants", "Study of pets", "Study of planets"] },
    { q: "Which layer of Earth is the hottest?", a: "Inner Core", alt: ["Outer Core", "Mantle", "Crust"] },
    { q: "The 'Mantle' of the Earth is located?", a: "Between the crust and the outer core", alt: ["At the very center", "On top of the crust", "In the atmosphere"] },
    { q: "What is an 'Archipelago'?", a: "A group of islands", alt: ["A large desert", "A type of volcano", "A deep canyon"] },
    { q: "Which type of rock is Coal?", a: "Sedimentary", alt: ["Igneous", "Metamorphic", "Volcanic"] },
    { q: "What is 'Pangea'?", a: "The ancient supercontinent", alt: ["A type of tectonic plate", "A volcanic eruption", "A deep sea trench"] },
    { q: "Which mineral is known as 'Fool's Gold'?", a: "Pyrite", alt: ["Quartz", "Mica", "Gypsum"] },
    { q: "What is the main component of limestone?", a: "Calcium Carbonate", alt: ["Silicon Dioxide", "Iron Oxide", "Carbon"] },
    { q: "Which state of the Earth's core is liquid?", a: "Outer Core", alt: ["Inner Core", "Mantle", "Crust"] },
    { q: "The Grand Canyon was carved primarily by which river?", a: "Colorado River", alt: ["Mississippi River", "Nile River", "Amazon River"] }
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

const CHEMISTRY_POOL_Q = [
    { q: "Chemical symbol for water?", a: "H2O", alt: ["CO2", "O2", "NaCl"] },
    { q: "Chemical symbol for Gold?", a: "Au", alt: ["Ag", "Fe", "Cu"] },
    { q: "Atomic number of Hydrogen?", a: "1", alt: ["2", "6", "8"] },
    { q: "Most abundant gas in Earth's atmosphere?", a: "Nitrogen", alt: ["Oxygen", "Carbon Dioxide", "Argon"] },
    { q: "pH of pure water?", a: "7", alt: ["0", "14", "5"] },
    { q: "Table salt is?", a: "Sodium Chloride", alt: ["Potassium Chloride", "Calcium Carbonate", "Magnesium Sulfate"] },
    { q: "Gas produced during photosynthesis?", a: "Oxygen", alt: ["Carbon Dioxide", "Nitrogen", "Methane"] },
    { q: "Hardest natural substance?", a: "Diamond", alt: ["Gold", "Iron", "Granite"] },
    { q: "Chemical symbol for Silver?", a: "Ag", alt: ["Au", "Si", "Sl"] },
    { q: "Element with symbol Fe?", a: "Iron", alt: ["Lead", "Copper", "Tin"] },
    { q: "What is the common name for solid carbon dioxide?", a: "Dry ice", alt: ["Soft ice", "Cold ice", "White ice"] },
    { q: "Which element has the lowest boiling point?", a: "Helium", alt: ["Hydrogen", "Nitrogen", "Oxygen"] },
    { q: "Who is known as the 'Father of Modern Chemistry'?", a: "Antoine Lavoisier", alt: ["John Dalton", "Robert Boyle", "Dmitri Mendeleev"] },
    { q: "Which gas is used in fire extinguishers?", a: "Carbon Dioxide", alt: ["Oxygen", "Nitrogen", "Helium"] },
    { q: "What is the chemical formula for Marble?", a: "CaCO3", alt: ["NaCl", "CaO", "Ca(OH)2"] },
    { q: "Which acid is present in lemons?", a: "Citric acid", alt: ["Acetic acid", "Tartaric acid", "Malic acid"] },
    { q: "The atomic number of Carbon is?", a: "6", alt: ["12", "14", "8"] },
    { q: "Which metal is liquid at room temperature?", a: "Mercury", alt: ["Bromine", "Gallium", "Cesium"] },
    { q: "What is the most reactive metal?", a: "Francium", alt: ["Potassium", "Sodium", "Lithium"] },
    { q: "Which element is used in pencils?", a: "Graphite", alt: ["Lead", "Charcoal", "Silicon"] },
    { q: "What is the primary component of natural gas?", a: "Methane", alt: ["Ethane", "Propane", "Butane"] },
    { q: "Which gas has the smell of rotten eggs?", a: "Hydrogen sulfide", alt: ["Sulfur dioxide", "Ammonia", "Carbon monoxide"] },
    { q: "What is the chemical name for vitamin C?", a: "Ascorbic acid", alt: ["Citric acid", "Acetic acid", "Folic acid"] },
    { q: "Which element is known as the 'king of chemicals'?", a: "Sulfuric acid (H2SO4)", alt: ["Hydrochloric acid", "Nitric acid", "Phosphoric acid"] },
    { q: "The process of rusting of iron is an example of?", a: "Oxidation", alt: ["Reduction", "Sublimation", "Evaporation"] },
    { q: "Which gas is responsible for the 'greenhouse effect'?", a: "Carbon dioxide", alt: ["Methane", "Nitrous oxide", "Water vapor"] },
    { q: "What is the main metal in Bronze?", a: "Copper", alt: ["Iron", "Zinc", "Tin"] },
    { q: "Which element is essential for all living organisms?", a: "Carbon", alt: ["Silicon", "Iron", "Gold"] },
    { q: "What is the chemical symbol for Potassium?", a: "K", alt: ["P", "Po", "Pt"] },
    { q: "Which element is used in making computer chips?", a: "Silicon", alt: ["Germanium", "Gallium", "Iron"] },
    { q: "What is the process of converting milk into curd called?", a: "Fermentation", alt: ["Pasteurization", "Homogenization", "Vaporization"] },
    { q: "Which gas is filled in balloons to make them fly?", a: "Helium", alt: ["Hydrogen", "Nitrogen", "Oxygen"] },
    { q: "What is the chemical formula for common baking soda?", a: "NaHCO3", alt: ["Na2CO3", "NaOH", "KOH"] },
    { q: "Which element is found in all organic compounds?", a: "Carbon", alt: ["Hydrogen", "Oxygen", "Nitrogen"] },
    { q: "What is the main component of glass?", a: "Silica (SiO2)", alt: ["Sodium carbonate", "Calcium oxide", "Alumina"] },
    { q: "Which element is a non-metal but reflects light?", a: "Iodine", alt: ["Sulfur", "Phosphorus", "Carbon"] },
    { q: "What is the chemical symbol for Lead?", a: "Pb", alt: ["Le", "Ld", "Pl"] },
    { q: "Which gas is used in the manufacture of ammonia?", a: "Nitrogen", alt: ["Oxygen", "Hydrogen", "Argon"] },
    { q: "What is the lightest element?", a: "Hydrogen", alt: ["Helium", "Lithium", "Oxygen"] },
    { q: "Which acid is found in vinegar?", a: "Acetic acid", alt: ["Citric acid", "Formic acid", "Lactic acid"] },
    { q: "What is the chemical symbol for Neon?", a: "Ne", alt: ["N", "Ni", "No"] },
    { q: "Which metal is the best conductor of electricity?", a: "Silver", alt: ["Copper", "Gold", "Aluminum"] },
    { q: "What is the common name for Nitrous Oxide?", a: "Laughing gas", alt: ["Tear gas", "Mustard gas", "Phosgene"] },
    { q: "Which element is the primary reason for the hardness of diamond?", a: "Carbon", alt: ["Boron", "Silicon", "Nitrogen"] },
    { q: "What is the chemical symbol for Magnesium?", a: "Mg", alt: ["Ma", "Mn", "Me"] },
    { q: "Which gas is released during the reaction of an acid with a carbonate?", a: "Carbon dioxide", alt: ["Hydrogen", "Oxygen", "Nitrogen"] },
    { q: "What is the chemical name for common salt?", a: "Sodium Chloride", alt: ["Sodium Carbonate", "Sodium Bicarbonate", "Potassium Chloride"] },
    { q: "Which noble gas is used in advertising signs?", a: "Neon", alt: ["Helium", "Argon", "Xenon"] },
    { q: "What is the most abundant metal in the Earth's crust?", a: "Aluminum", alt: ["Iron", "Calcium", "Magnesium"] },
    { q: "Which radioactive element is used in smoke detectors?", a: "Americium", alt: ["Uranium", "Plutonium", "Radon"] }
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
    { q: "Blood type that is Universal Receiver?", a: "AB positive", alt: ["O positive", "A negative", "B positive"] },
    { q: "Smallest unit of heredity?", a: "Gene", alt: ["Cell", "Chromsome", "DNA"] },
    { q: "Which part of the brain controls balance and coordination?", a: "Cerebellum", alt: ["Cerebrum", "Brainstem", "Thalamus"] },
    { q: "How many liters of blood are in the average adult body?", a: "About 5 liters", alt: ["2 liters", "8 liters", "10 liters"] },
    { q: "What is the main function of white blood cells?", a: "Fighting infection", alt: ["Carrying oxygen", "Clotting blood", "Providing energy"] },
    { q: "Which protein is the main component of hair and nails?", a: "Keratin", alt: ["Collagen", "Elastin", "Fibrin"] },
    { q: "What is the largest part of the human brain?", a: "Cerebrum", alt: ["Cerebellum", "Brainstem", "Hypothalamus"] },
    { q: "Which organ is responsible for detoxifying chemicals in the body?", a: "Liver", alt: ["Kidneys", "Pancreas", "Spleen"] },
    { q: "What is the name of the pigment that gives skin its color?", a: "Melanin", alt: ["Hemoglobin", "Carotene", "Bilirubin"] },
    { q: "Which bone is commonly known as the 'funny bone'?", a: "Humerus (Ulnar nerve)", alt: ["Femur", "Tibia", "Radius"] },
    { q: "What is the process of cell division that results in two identical daughter cells?", a: "Mitosis", alt: ["Meiosis", "Binary fission", "Fertilization"] }
];

const SCIENCE_POOL = [
    { q: "Planet known as the Red Planet?", a: "Mars", alt: ["Venus", "Jupiter", "Saturn"] },
    { q: "Largest planet in our solar system?", a: "Jupiter", alt: ["Earth", "Neptune", "Saturn"] },
    { q: "Closest star to Earth?", a: "Sun", alt: ["Proxima Centauri", "Sirius", "Alpha Centauri"] },
    { q: "What gas do plants absorb?", a: "Carbon Dioxide", alt: ["Oxygen", "Nitrogen", "Hydrogen"] },
    { q: "Number of planets in our solar system?", a: "8", alt: ["9", "7", "10"] },
    { q: "Hottest planet in our solar system?", a: "Venus", alt: ["Mercury", "Mars", "Jupiter"] },
    { q: "What is the force that keeps us on Earth?", a: "Gravity", alt: ["Magnetism", "Air Pressure", "Friction"] },
    { q: "Which planet has the most rings?", a: "Saturn", alt: ["Jupiter", "Uranus", "Neptune"] },
    { q: "What is the center of an atom called?", a: "Nucleus", alt: ["Electron", "Proton", "Neutron"] },
    { q: "Moon's gravity compared to Earth?", a: "1/6th", alt: ["Half", "Double", "Same"] },
    { q: "Which planet is known as the 'Morning Star'?", a: "Venus", alt: ["Mars", "Mercury", "Jupiter"] },
    { q: "What is the largest moon of Saturn?", a: "Titan", alt: ["Ganymede", "Europa", "Io"] },
    { q: "Which galaxy is Earth located in?", a: "Milky Way", alt: ["Andromeda", "Sombrero", "Triangulum"] },
    { q: "What is the name of the first artificial satellite?", a: "Sputnik 1", alt: ["Explorer 1", "Vanguard 1", "Telstar"] },
    { q: "Which planet is known as the 'Blue Planet'?", a: "Earth", alt: ["Neptune", "Uranus", "Saturn"] },
    { q: "What is the name of the brightest star in the night sky?", a: "Sirius", alt: ["Polaris", "Betelgeuse", "Rigel"] },
    { q: "Which comet is visible from Earth every 75-76 years?", a: "Halley's Comet", alt: ["Hale-Bopp", "Hyakutake", "Shoemaker-Levy 9"] },
    { q: "What is the study of the universe called?", a: "Astronomy", alt: ["Astrology", "Geology", "Meteorology"] },
    { q: "Which planet is the smallest in our solar system?", a: "Mercury", alt: ["Mars", "Venus", "Neptune"] },
    { q: "What is the name of the largest volcano in the solar system?", a: "Olympus Mons (Mars)", alt: ["Mauna Loa", "Mount Etna", "Mount Fuji"] },
    { q: "Which gas makes up the majority of the Sun?", a: "Hydrogen", alt: ["Helium", "Oxygen", "Carbon"] },
    { q: "What is the distance between the Earth and the Sun?", a: "1 Astronomical Unit (AU)", alt: ["1 Light Year", "1 Parsec", "1 Million Miles"] },
    { q: "Which planet was reclassified as a 'dwarf planet' in 2006?", a: "Pluto", alt: ["Eris", "Ceres", "Haumea"] },
    { q: "What is the boundary around a black hole called?", a: "Event Horizon", alt: ["Singularity", "Photon Sphere", "Accretion Disk"] },
    { q: "Which instrument is used to measure earthquake intensity?", a: "Seismograph", alt: ["Barometer", "Hygrometer", "Anemometer"] },
    { q: "What is the main component of the Earth's core?", a: "Iron", alt: ["Nickel", "Silicon", "Magnesium"] },
    { q: "Which layer of the atmosphere contains the ozone layer?", a: "Stratosphere", alt: ["Troposphere", "Mesosphere", "Thermosphere"] },
    { q: "What is the name of the most famous space telescope?", a: "Hubble", alt: ["James Webb", "Kepler", "Spitzer"] },
    { q: "Which planet rotates on its side?", a: "Uranus", alt: ["Neptune", "Saturn", "Jupiter"] },
    { q: "What is the name of the path an object takes around a star?", a: "Orbit", alt: ["Trajectory", "Path", "Circuit"] },
    { q: "Which scientist proposed the laws of planetary motion?", a: "Johannes Kepler", alt: ["Nicolaus Copernicus", "Tycho Brahe", "Galileo Galilei"] },
    { q: "What is the name of the point where gravity is so strong nothing can escape?", a: "Black Hole", alt: ["White Dwarf", "Neutron Star", "Red Giant"] },
    { q: "Which planet is known as the 'Green Planet'?", a: "Uranus", alt: ["Neptune", "Earth", "Saturn"] },
    { q: "What is the name of the second-largest planet in our solar system?", a: "Saturn", alt: ["Jupiter", "Neptune", "Uranus"] },
    { q: "Which gas is responsible for the smell of rain?", a: "Ozone (plus geosmin)", alt: ["Nitrogen", "Oxygen", "Carbon dioxide"] },
    { q: "What is the name of the first woman in space?", a: "Valentina Tereshkova", alt: ["Sally Ride", "Svetlana Savitskaya", "Mae Jemison"] },
    { q: "Which planet has the shortest day?", a: "Jupiter", alt: ["Saturn", "Earth", "Mars"] },
    { q: "What is the name of the dwarf planet in the asteroid belt?", a: "Ceres", alt: ["Pluto", "Eris", "Haumea"] },
    { q: "Which type of star is the Sun?", a: "Yellow Dwarf", alt: ["Red Giant", "White Dwarf", "Blue Supergiant"] },
    { q: "What is the name of the force that keeps planets in orbit?", a: "Gravitational force", alt: ["Centrifugal force", "Magnetic force", "Nuclear force"] },
    { q: "What is the study of weather called?", a: "Meteorology", alt: ["Geology", "Astronomy", "Ecology"] },
    { q: "Which planet is the windiest in our solar system?", a: "Neptune", alt: ["Saturn", "Jupiter", "Uranus"] },
    { q: "What is the coldest place in the solar system?", a: "Uranus", alt: ["Neptune", "Pluto", "Triton"] },
    { q: "Which star is at the center of our solar system?", a: "The Sun", alt: ["Polaris", "Sirius", "Betelgeuse"] },
    { q: "What is the name of the largest moon in the solar system?", a: "Ganymede", alt: ["Titan", "Callisto", "Io"] },
    { q: "Which galaxy is closest to the Milky Way?", a: "Andromeda", alt: ["Sombrero", "Triangulum", "Whirlpool"] },
    { q: "What is the name of the first human to fly in space?", a: "Yuri Gagarin", alt: ["Neil Armstrong", "Alan Shepard", "Buzz Aldrin"] },
    { q: "Which planet is known for its Great Red Spot?", a: "Jupiter", alt: ["Mars", "Saturn", "Neptune"] },
    { q: "What is the name of the probe that first left the solar system?", a: "Voyager 1", alt: ["Pioneer 10", "Voyager 2", "New Horizons"] },
    { q: "Which type of celestial body is Ceres?", a: "Dwarf Planet", alt: ["Asteroid", "Comet", "Moon"] }
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
    { q: "First computer mouse inventor?", a: "Douglas Engelbart", alt: ["Bill Gates", "Steve Jobs", "Alan Turing"] },
    { q: "What does BIOS stand for?", a: "Basic Input Output System", alt: ["Base Integrated Operating System", "Binary Input Output Standard", "Basic Internal Operating System"] },
    { q: "Which company owns the YouTube platform?", a: "Google (Alphabet)", alt: ["Microsoft", "Meta", "Amazon"] },
    { q: "What is the most popular social media platform by active users?", a: "Facebook", alt: ["Instagram", "TikTok", "YouTube"] },
    { q: "Who is the co-founder of Facebook along with Mark Zuckerberg?", a: "Eduardo Saverin", alt: ["Jack Dorsey", "Evan Spiegel", "Jan Koum"] },
    { q: "What does SSD stand for?", a: "Solid State Drive", alt: ["Solid Static Device", "Simple State Drive", "Standard Storage Device"] },
    { q: "Which company developed the Java programming language?", a: "Sun Microsystems", alt: ["Microsoft", "IBM", "Oracle"] },
    { q: "What is the main purpose of a router?", a: "Directing data packets between networks", alt: ["Storing web pages", "Creating graphics", "Printing documents"] },
    { q: "What does IoT stand for?", a: "Internet of Things", alt: ["Internet of Tools", "Internal Operating Technology", "Integrated Online Tasks"] },
    { q: "Who is known as the 'Father of the Computer'?", a: "Charles Babbage", alt: ["Alan Turing", "John von Neumann", "Ada Lovelace"] },
    { q: "Which coding language is often used for data science and AI?", a: "Python", alt: ["PHP", "Ruby", "Swift"] }
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
    { q: "What is encryption?", a: "Converting data into a coded form for security", alt: ["Copying data to multiple servers", "Compressing files to save space", "Converting text to audio"] },
    { q: "What is a bit?", a: "The smallest unit of data in a computer", alt: ["A character", "A byte", "A nibble"] },
    { q: "What is a byte?", a: "8 bits", alt: ["4 bits", "16 bits", "32 bits"] },
    { q: "What does DNS stand for?", a: "Domain Name System", alt: ["Data Network System", "Digital Name Server", "Domain Network Service"] },
    { q: "What is a cookie in web browsing?", a: "A small piece of data stored on the user's computer", alt: ["A type of virus", "A cache file", "A password manager"] },
    { q: "What does FTP stand for?", a: "File Transfer Protocol", alt: ["Fast Text Protocol", "File Terminal Port", "Format Transfer Process"] },
    { q: "What is a GUI?", a: "Graphical User Interface", alt: ["General User Integration", "Global Unit Interface", "Graphical Utility Index"] },
    { q: "What is the primary function of an antivirus program?", a: "Protecting against and removing malware", alt: ["Speeding up the internet", "Cleaning the keyboard", "Managing email"] },
    { q: "What does PDF stand for?", a: "Portable Document Format", alt: ["Personal Data File", "Portable Data Folder", "Public Document File"] },
    { q: "What is a kernel in an OS?", a: "The core part of the operating system that manages system resources", alt: ["The user interface", "The file manager", "The security guard"] },
    { q: "What is cloud storage?", a: "Storing data on remote servers accessible via internet", alt: ["Storing data on physical external drives", "Storing data on the monitor", "A type of physical backup tape"] }
];


const MOVIES_POOL = [
    { q: "Which movie is known as the first Malayalam talkie?", a: "Balan", alt: ["Vigathakumaran", "Neelakuyil", "Chemmeen"] },
    { q: "First Indian 3D movie?", a: "My Dear Kuttichathan", alt: ["Sholay", "Robot", "Ra.One"] },
    { q: "Who directed the movie 'Chemmeen'?", a: "Ramu Kariat", alt: ["Adoor Gopalakrishnan", "G. Aravindan", "P. Padmarajan"] },
    { q: "Which actor holds the record for playing most lead roles in world cinema?", a: "Prem Nazir", alt: ["Mohanlal", "Mammootty", "Amitabh Bachchan"] },
    { q: "First Malayalam movie to win National Award for Best Film?", a: "Neelakuyil", alt: ["Chemmeen", "Swayamvaram", "Nirmalyam"] },
    { q: "Who is the 'Superstar' of Tamil Cinema?", a: "Rajinikanth", alt: ["Kamal Haasan", "Vijay", "Ajith"] },
    { q: "First Indian movie to be nominated for Oscar?", a: "Mother India", alt: ["Lagaan", "Salaam Bombay", "RRR"] },
    { q: "Who played the lead role in 'Manichitrathazhu'?", a: "Mohanlal & Shobana", alt: ["Mammootty", "Jayaram", "Suresh Gopi"] },
    { q: "Which Telugu movie won the Oscar for Best Original Song in 2023?", a: "RRR", alt: ["Pushpa", "Baahubali", "Eega"] },
    { q: "Director of 'Baahubali' series?", a: "S.S. Rajamouli", alt: ["Prashanth Neel", "Sukumar", "Trivikram"] },
    { q: "First Kannada movie to cross 1000 crores?", a: "KGF: Chapter 2", alt: ["Kantara", "Vikrant Rona", "777 Charlie"] },
    { q: "Who played 'Rocky Bhai' in KGF?", a: "Yash", alt: ["Sudeep", "Puneeth Rajkumar", "Rishab Shetty"] },
    { q: "Which film is known as the highest-grossing Indian film of all time?", a: "Dangal", alt: ["Baahubali 2", "RRR", "Pathaan"] },
    { q: "Who is known as the 'Lalettan' of Malayalam cinema?", a: "Mohanlal", alt: ["Mammootty", "Prithviraj", "Dulquer Salmaan"] },
    { q: "First Malayalam movie to cross 100 crores?", a: "Pulimurugan", alt: ["Lucifer", "Drishyam", "2018"] },
    { q: "The movie 'Kantara' is based on which ritual?", a: "Bhoota Kola", alt: ["Theyyam", "Kathakali", "Yakshagana"] },
    { q: "Who is the lead actor in 'Pushpa: The Rise'?", a: "Allu Arjun", alt: ["Ram Charan", "Mahesh Babu", "Prabhas"] },
    { q: "Which movie won the Best Film award at the 95th Academy Awards?", a: "Everything Everywhere All at Once", alt: ["Top Gun: Maverick", "The Whale", "All Quiet on the Western Front"] },
    { q: "Who directed 'Oppenheimer'?", a: "Christopher Nolan", alt: ["Steven Spielberg", "Martin Scorsese", "James Cameron"] },
    { q: "First Malayalam movie directed by a woman?", a: "Chithrakoodam (P. Janaki Amma)", alt: ["Mitr, My Friend", "Manivathoorile Aayiram Sivarathrikal", "Thira"] },
    { q: "Who played 'Kunjali Marakkar' in the 2021 film?", a: "Mohanlal", alt: ["Mammootty", "Prithviraj", "Tovino Thomas"] },
    { q: "Which film has the highest number of National Awards for an actor in India?", a: "Mammootty, Amitabh Bachchan, Kamal Haasan (3 each)", alt: ["Mohanlal", "Shah Rukh Khan", "Aamir Khan"] },
    { q: "Which Hollywood movie features a giant shark called Megalodon?", a: "The Meg", alt: ["Jaws", "Deep Blue Sea", "Sharknado"] },
    { q: "Who played 'Iron Man' in the Marvel Cinematic Universe?", a: "Robert Downey Jr.", alt: ["Chris Evans", "Chris Hemsworth", "Mark Ruffalo"] },
    { q: "First sound film made in India?", a: "Alam Ara", alt: ["Raja Harishchandra", "Kismet", "Devdas"] },
    { q: "Which movie series features the character 'Jack Sparrow'?", a: "Pirates of the Caribbean", alt: ["Harry Potter", "Lord of the Rings", "Star Wars"] },
    { q: "Who is the director of 'Interstellar'?", a: "Christopher Nolan", alt: ["Quentin Tarantino", "David Fincher", "Ridley Scott"] },
    { q: "Which Indian actor is known as the 'Angry Young Man'?", a: "Amitabh Bachchan", alt: ["Dilip Kumar", "Rajesh Khanna", "Dharmendra"] },
    { q: "First color film in Malayalam?", a: "Kandam Becha Kottu", alt: ["Chemmeen", "Thacholi Othenan", "Nellu"] },
    { q: "The character 'Hogwarts' belongs to which movie franchise?", a: "Harry Potter", alt: ["Marvel", "DC", "Star Trek"] },
    { q: "Who is known as the 'Universal Star' in Tamil Cinema?", a: "Kamal Haasan", alt: ["Rajinikanth", "Ajith", "Suriya"] },
    { q: "First Kannada sound film?", a: "Sati Sulochana", alt: ["Bhakta Dhruva", "Sati Savithri", "Harishchandra"] },
    { q: "Who directed 'The Godfather'?", a: "Francis Ford Coppola", alt: ["Martin Scorsese", "Steven Spielberg", "Ridley Scott"] },
    { q: "Which movie features the song 'Naatu Naatu'?", a: "RRR", alt: ["Pushpa", "Baahubali", "Sarkaru Vaari Paata"] },
    { q: "Who is the 'Megastar' of Telugu Cinema?", a: "Chiranjeevi", alt: ["Balakrishna", "Nagarjuna", "Venkatesh"] },
    // Hollywood / English
    { q: "Who directed 'Inception'?", a: "Christopher Nolan", alt: ["Steven Spielberg", "James Cameron", "Quentin Tarantino"] },
    { q: "What is the highest-grossing film of all time?", a: "Avatar", alt: ["Avengers: Endgame", "Titanic", "Star Wars"] },
    { q: "Who played Jack in 'Titanic'?", a: "Leonardo DiCaprio", alt: ["Brad Pitt", "Tom Cruise", "Johnny Depp"] },
    { q: "Who is the voice of Woody in 'Toy Story'?", a: "Tom Hanks", alt: ["Tim Allen", "John Ratzenberger", "Don Rickles"] },

    // Malayalam
    { q: "Who is known as the 'Complete Actor' in Malayalam cinema?", a: "Mohanlal", alt: ["Mammootty", "Suresh Gopi", "Jayaram"] },
    { q: "Which Malayalam movie won the first National Film Award for Best Feature Film?", a: "Chemmeen", alt: ["Neelakuyil", "Swayamvaram", "Elippathayam"] },
    { q: "Who directed the movie 'Drishyam'?", a: "Jeethu Joseph", alt: ["Lijo Jose Pellissery", "Aashiq Abu", "Alphonse Puthren"] },
    { q: "Who is the lead actor in 'Lucifer'?", a: "Mohanlal", alt: ["Prithviraj", "Tovino Thomas", "Fahadh Faasil"] },
    { q: "Which film is considered the first '3D' movie in India (Malayalam)?", a: "My Dear Kuttichathan", alt: ["Padayottam", "Jwaala", "Vidyarthigale Ithile Ithile"] },

    // Hindi (Bollywood)
    { q: "Who is known as the 'Baadshah of Bollywood'?", a: "Shah Rukh Khan", alt: ["Aamir Khan", "Salman Khan", "Akshay Kumar"] },
    { q: "Which Hindi movie is known as the 'Greatest of All Time'?", a: "Sholay", alt: ["Mughal-E-Azam", "Lagaan", "Dilwale Dulhania Le Jayenge"] },
    { q: "Who directed the movie 'Lagaan'?", a: "Ashutosh Gowariker", alt: ["Sanjay Leela Bhansali", "Karan Johar", "Rajkumar Hirani"] },
    { q: "Who played the lead role in 'Dangal'?", a: "Aamir Khan", alt: ["Shah Rukh Khan", "Salman Khan", "Ranbir Kapoor"] },

    // Tamil (Kollywood)
    { q: "Who is called 'Superstar' in Tamil cinema?", a: "Rajinikanth", alt: ["Kamal Haasan", "Vijay", "Ajith"] },
    { q: "Who directed the epic film 'Ponniyin Selvan'?", a: "Mani Ratnam", alt: ["Shankar", "Vetrimaaran", "Pa. Ranjith"] },
    { q: "Which Tamil movie features the character 'Chitti' the Robot?", a: "Enthiran", alt: ["Sivaji", "2.0", "Anniyan"] },
    { q: "Who is known as 'Ulaganayagan'?", a: "Kamal Haasan", alt: ["Rajinikanth", "Suriya", "Vikram"] },

    // Telugu (Tollywood)
    { q: "Which Telugu movie became a global phenomenon and won an Oscar for 'Naatu Naatu'?", a: "RRR", alt: ["Baahubali", "Pushpa", "Eega"] },
    { q: "Who directed the 'Baahubali' series?", a: "S.S. Rajamouli", alt: ["Sukumar", "Trivikram Srinivas", "Puri Jagannadh"] },
    { q: "Who is the lead actor of 'Pushpa: The Rise'?", a: "Allu Arjun", alt: ["Mahesh Babu", "Prabhas", "Ram Charan"] },
    { q: "Who is known as 'Mega Star' in Tollywood?", a: "Chiranjeevi", alt: ["Pawan Kalyan", "NTR Jr", "Balakrishna"] },

    // Kannada (Sandalwood)
    { q: "Which Kannada movie series broke records across India starting in 2018?", a: "K.G.F", alt: ["Kantara", "777 Charlie", "Vikrant Rona"] },
    { q: "Who is the lead actor in 'K.G.F'?", a: "Yash", alt: ["Rishab Shetty", "Rakshit Shetty", "Sudeep"] },
    { q: "Which Kannada film gained massive popularity for its 'Bhoota Kola' theme?", a: "Kantara", alt: ["K.G.F", "Raajakumara", "Lucia"] },
    { q: "Who is known as 'Power Star' in Kannada cinema?", a: "Puneeth Rajkumar", alt: ["Darshan", "Yash", "Upendra"] }
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
    { q: "Author of Harry Potter?", a: "J.K. Rowling", alt: ["J.R.R. Tolkien", "C.S. Lewis", "Roald Dahl"] },
    { q: "Which is the largest internal organ in human body?", a: "Liver", alt: ["Lungs", "Brain", "Heart"] },
    { q: "What is the capital of Italy?", a: "Rome", alt: ["Milan", "Venice", "Florence"] },
    { q: "Who was the first man to step on the Moon?", a: "Neil Armstrong", alt: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins"] },
    { q: "Which gas is used in the fire extinguisher?", a: "CO2", alt: ["Oxygen", "Nitrogen", "Hydrogen"] },
    { q: "What is the largest animal on Earth?", a: "Blue Whale", alt: ["Elephant", "Giraffe", "Shark"] },
    { q: "Which country is called the 'Land of White Elephants'?", a: "Thailand", alt: ["India", "Sri Lanka", "Myanmar"] },
    { q: "Who is known as the 'Iron Lady'?", a: "Margaret Thatcher", alt: ["Indira Gandhi", "Angela Merkel", "Sonia Gandhi"] },
    { q: "Which planet is known as the 'Earth's Twin'?", a: "Venus", alt: ["Mars", "Mercury", "Jupiter"] },
    { q: "What is the capital of Australia?", a: "Canberra", alt: ["Sydney", "Melbourne", "Perth"] },
    { q: "Who is the author of 'The Origin of Species'?", a: "Charles Darwin", alt: ["Isaac Newton", "Albert Einstein", "Stephen Hawking"] },
    { q: "Which is the smallest continent in the world?", a: "Australia", alt: ["Europe", "Antarctica", "South America"] },
    { q: "What is the capital of Canada?", a: "Ottawa", alt: ["Toronto", "Vancouver", "Montreal"] },
    { q: "Who founded the 'League of Nations'?", a: "Woodrow Wilson", alt: ["Theodor Roosevelt", "Franklin D. Roosevelt", "Winston Churchill"] },
    { q: "Which is the largest island in the world?", a: "Greenland", alt: ["New Guinea", "Borneo", "Madagascar"] },
    { q: "Who is the 'Father of Economics'?", a: "Adam Smith", alt: ["Karl Marx", "John Maynard Keynes", "Alfred Marshall"] },
    { q: "What is the capital of Russia?", a: "Moscow", alt: ["Saint Petersburg", "Kiev", "Minsk"] },
    { q: "Which instrument is used to measure humidity?", a: "Hygrometer", alt: ["Barometer", "Thermometer", "Anemometer"] },
    { q: "Who was the first woman to win a Nobel Prize?", a: "Marie Curie", alt: ["Mother Teresa", "Jane Addams", "Irène Joliot-Curie"] },
    { q: "What is the capital of Brazil?", a: "Brasília", alt: ["Rio de Janeiro", "São Paulo", "Salvador"] },
    { q: "Which is the highest waterfall in the world?", a: "Angel Falls", alt: ["Niagara Falls", "Victoria Falls", "Iguazu Falls"] },
    { q: "What is the capital of Germany?", a: "Berlin", alt: ["Munich", "Hamburg", "Frankfurt"] },
    { q: "Which is the hottest planet in our solar system?", a: "Venus", alt: ["Mercury", "Mars", "Jupiter"] },
    { q: "Who discovered America?", a: "Christopher Columbus", alt: ["Vasco da Gama", "Amerigo Vespucci", "John Cabot"] },
    { q: "What is the currency of United Kingdom?", a: "Pound Sterling", alt: ["Euro", "Dollar", "Franc"] },
    { q: "Which is the longest bone in the human body?", a: "Femur", alt: ["Tibia", "Fibula", "Humerus"] },
    { q: "Who is the author of 'Romeo and Juliet'?", a: "William Shakespeare", alt: ["John Milton", "Charles Dickens", "Mark Twain"] },
    { q: "What is the chemical symbol for Gold?", a: "Au", alt: ["Ag", "Gd", "Go"] },
    { q: "Which is the largest bird in the world?", a: "Ostrich", alt: ["Emu", "Eagle", "Albatross"] },
    { q: "What is the capital of Spain?", a: "Madrid", alt: ["Barcelona", "Seville", "Valencia"] },
    { q: "Who is known as the 'Father of Geometry'?", a: "Euclid", alt: ["Pythagoras", "Archimedes", "Newton"] }
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
    const tier = Math.floor((level - 1) / 50); // 0, 1, 2, 3
    const ops = [
        { sym: "+", fn: (a, b) => a + b },
        { sym: "-", fn: (a, b) => a - b },
        { sym: "×", fn: (a, b) => a * b }
    ];

    // Added division for higher tiers
    if (tier >= 2) {
        ops.push({ sym: "÷", fn: (a, b) => Math.floor(a / b) });
    }

    const opIdx = (index * 7 + level * 3) % ops.length;
    const op = ops[opIdx];

    let a, b, answer, question;
    // Enhanced seed for more variety
    const seed = (level * 1000) + (index * 13) + (level * index * 7);

    if (tier === 0) {
        // Level 1-50: Easy
        a = (seed % 15) + 5;
        b = (seed % 10) + 2;
    } else if (tier === 1) {
        // Level 51-100: Medium
        a = (seed % 40) + 15;
        b = (seed % 25) + 5;
    } else if (tier === 2) {
        // Level 101-150: Hard
        a = (seed % 150) + 30;
        b = (seed % 40) + 10;
        if (op.sym === "÷") a = b * ((seed % 12) + 2); // Ensure clean division
    } else {
        // Level 151-200: Very Hard
        a = (seed % 500) + 100;
        b = (seed % 100) + 20;
        if (op.sym === "÷") a = b * ((seed % 15) + 3);
        if (op.sym === "×") { a = (seed % 50) + 10; b = (seed % 30) + 5; } // Keep multiplication manageable
    }

    if (op.sym === "-" && a < b) { const tmp = a; a = b; b = tmp; }
    answer = op.fn(a, b);

    question = `[Level ${level}] What is ${a} ${op.sym} ${b}?`;

    const wrong1 = answer + (seed % 7) + 1;
    const wrong2 = answer - ((seed % 5) + 1);
    const wrong3 = answer + 10;
    
    let options = [answer.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()];
    // Ensure all options are unique
    options = [...new Set(options)];
    while (options.length < 4) {
        options.push((answer + options.length + 5).toString());
    }
    
    options.sort(() => Math.random() - 0.5);

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
                for (let qIdx = 0; qIdx < 10; qIdx++) {
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

        console.log('🏁 SEEDING COMPLETE: 200 levels × 16 categories × 10 questions = 32,000 entries (2000 per category)');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
}

seed();
