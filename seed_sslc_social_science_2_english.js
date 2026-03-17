require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const rawData = [
  {
    "id": 1,
    "chapter": "Weather and Climate",
    "question": "What is the short-term atmospheric condition called?",
    "options": ["Climate", "Weather", "Region", "Rain"],
    "answer": "Weather"
  },
  {
    "id": 2,
    "chapter": "Weather and Climate",
    "question": "What is the long-term average atmospheric condition?",
    "options": ["Climate", "Weather", "Rain", "Wind"],
    "answer": "Climate"
  },
  {
    "id": 3,
    "chapter": "Weather and Climate",
    "question": "What is the Sun to the Earth?",
    "options": ["Planet", "Energy source", "Wind", "Rain"],
    "answer": "Energy source"
  },
  {
    "id": 4,
    "chapter": "Weather and Climate",
    "question": "What is Insolation?",
    "options": ["Rain", "Solar radiation", "Wind", "Pressure"],
    "answer": "Solar radiation"
  },
  {
    "id": 5,
    "chapter": "Weather and Climate",
    "question": "What is conduction?",
    "options": ["Transfer of heat", "Blowing of wind", "Rain", "Radiation"],
    "answer": "Transfer of heat"
  },
  {
    "id": 6,
    "chapter": "Weather and Climate",
    "question": "What is convection?",
    "options": ["Heat rising upwards", "Heat going downwards", "Rain", "Wind"],
    "answer": "Heat rising upwards"
  },
  {
    "id": 7,
    "chapter": "Weather and Climate",
    "question": "What is advection?",
    "options": ["Transfer of heat through wind", "Rain", "Radiation", "Pressure"],
    "answer": "Transfer of heat through wind"
  },
  {
    "id": 8,
    "chapter": "Weather and Climate",
    "question": "What is radiation?",
    "options": ["Thermal radiation", "Rain", "Wind", "Pressure"],
    "answer": "Thermal radiation"
  },
  {
    "id": 9,
    "chapter": "Weather and Climate",
    "question": "Which is an example of a greenhouse gas?",
    "options": ["O₂", "CO₂", "N₂", "He"],
    "answer": "CO₂"
  },
  {
    "id": 10,
    "chapter": "Weather and Climate",
    "question": "What is Heat Budget?",
    "options": ["Heat balance", "Rain", "Wind", "Pressure"],
    "answer": "Heat balance"
  },
  {
    "id": 11,
    "chapter": "Climatic Zones",
    "question": "What causes variation in climate on Earth?",
    "options": ["Sunlight", "Wind", "Rain", "All"],
    "answer": "All"
  },
  {
    "id": 12,
    "chapter": "Climatic Zones",
    "question": "Where is the Tropical zone located?",
    "options": ["Near the Equator", "Poles", "Mid-latitudes", "None"],
    "answer": "Near the Equator"
  },
  {
    "id": 13,
    "chapter": "Climatic Zones",
    "question": "Why are polar regions cold?",
    "options": ["Less sunlight", "More rain", "Wind", "Pressure"],
    "answer": "Less sunlight"
  },
  {
    "id": 14,
    "chapter": "Climatic Zones",
    "question": "Why is rainfall low in deserts?",
    "options": ["Low humidity", "Wind", "Pressure", "Sun"],
    "answer": "Low humidity"
  },
  {
    "id": 15,
    "chapter": "Climatic Zones",
    "question": "Factors that influence climate?",
    "options": ["Latitude", "Altitude", "Distance from sea", "All"],
    "answer": "All"
  },
  {
    "id": 16,
    "chapter": "Climate Change",
    "question": "What is Global Warming?",
    "options": ["Increase in temperature", "Decrease in rainfall", "Wind", "Pressure"],
    "answer": "Increase in temperature"
  },
  {
    "id": 17,
    "chapter": "Climate Change",
    "question": "What is the main cause of climate change?",
    "options": ["Increase in CO₂", "Rain", "Wind", "Pressure"],
    "answer": "Increase in CO₂"
  },
  {
    "id": 18,
    "chapter": "Climate Change",
    "question": "What does the Ozone layer protect us from?",
    "options": ["UV rays", "Rain", "Wind", "Heat"],
    "answer": "UV rays"
  },
  {
    "id": 19,
    "chapter": "Climate Change",
    "question": "What is the Greenhouse Effect?",
    "options": ["Trapping of heat", "Rain", "Wind", "Pressure"],
    "answer": "Trapping of heat"
  },
  {
    "id": 20,
    "chapter": "Climate Change",
    "question": "What is the result of deforestation?",
    "options": ["Increase in CO₂", "Rain", "Wind", "Pressure"],
    "answer": "Increase in CO₂"
  },
  {
    "id": 21,
    "chapter": "Consumer Rights",
    "question": "What are consumer rights?",
    "options": ["Safety", "Information", "Choice", "All"],
    "answer": "All"
  },
  {
    "id": 22,
    "chapter": "Consumer Rights",
    "question": "What should you do against cheating?",
    "options": ["File a complaint", "Keep silent", "Avoid", "Nothing"],
    "answer": "File a complaint"
  },
  {
    "id": 23,
    "chapter": "Consumer Rights",
    "question": "What does MRP mean?",
    "options": ["Maximum Retail Price", "Minimum Price", "No price", "Tax"],
    "answer": "Maximum Retail Price"
  },
  {
    "id": 24,
    "chapter": "Consumer Rights",
    "question": "Which is a quality mark?",
    "options": ["ISI", "ATM", "PIN", "GST"],
    "answer": "ISI"
  },
  {
    "id": 25,
    "chapter": "Consumer Rights",
    "question": "What is the Consumer Protection Act for?",
    "options": ["Protection", "Trade", "Tax", "Wind"],
    "answer": "Protection"
  },
  {
    "id": 26,
    "chapter": "Economy",
    "question": "What is the goal of an economy?",
    "options": ["Satisfying needs", "War", "Fear", "Control"],
    "answer": "Satisfying needs"
  },
  {
    "id": 27,
    "chapter": "Economy",
    "question": "Factors of production?",
    "options": ["Land", "Labour", "Capital", "All"],
    "answer": "All"
  },
  {
    "id": 28,
    "chapter": "Economy",
    "question": "What is money used for?",
    "options": ["Exchange", "Saving", "Value", "All"],
    "answer": "All"
  },
  {
    "id": 29,
    "chapter": "Economy",
    "question": "What is the function of a bank?",
    "options": ["Saving", "Loan", "Investment", "All"],
    "answer": "All"
  },
  {
    "id": 30,
    "chapter": "Economy",
    "question": "What is GDP?",
    "options": ["Total production", "Rain", "Wind", "Pressure"],
    "answer": "Total production"
  },
  {
    "id": 31,
    "chapter": "Weather and Climate",
    "question": "What are the elements of weather?",
    "options": ["Temperature", "Pressure", "Wind", "All"],
    "answer": "All"
  },
  {
    "id": 32,
    "chapter": "Weather and Climate",
    "question": "Which instrument is used to measure temperature?",
    "options": ["Thermometer", "Barometer", "Anemometer", "Hygrometer"],
    "answer": "Thermometer"
  },
  {
    "id": 33,
    "chapter": "Weather and Climate",
    "question": "Which instrument measures atmospheric pressure?",
    "options": ["Barometer", "Thermometer", "Hygrometer", "Rain gauge"],
    "answer": "Barometer"
  },
  {
    "id": 34,
    "chapter": "Weather and Climate",
    "question": "Which instrument measures wind speed?",
    "options": ["Anemometer", "Barometer", "Thermometer", "Hygrometer"],
    "answer": "Anemometer"
  },
  {
    "id": 35,
    "chapter": "Weather and Climate",
    "question": "Which instrument measures humidity?",
    "options": ["Hygrometer", "Rain gauge", "Thermometer", "Barometer"],
    "answer": "Hygrometer"
  },
  {
    "id": 36,
    "chapter": "Climatic Zones",
    "question": "Where is the Temperate zone located?",
    "options": ["Tropical", "Poles", "Mid-latitudes", "Desert"],
    "answer": "Mid-latitudes"
  },
  {
    "id": 37,
    "chapter": "Climatic Zones",
    "question": "Which instrument is used to find the direction of wind?",
    "options": ["Wind vane", "Anemometer", "Barometer", "Hygrometer"],
    "answer": "Wind vane"
  },
  {
    "id": 38,
    "chapter": "Climatic Zones",
    "question": "What happens to temperature in high altitude areas?",
    "options": ["Decreases", "Increases", "No change", "Stable"],
    "answer": "Decreases"
  },
  {
    "id": 39,
    "chapter": "Climatic Zones",
    "question": "Why do coastal areas have moderate climate?",
    "options": ["Water retains heat", "Rain", "Wind", "Pressure"],
    "answer": "Water retains heat"
  },
  {
    "id": 40,
    "chapter": "Climatic Zones",
    "question": "In which country are monsoon winds very important?",
    "options": ["India", "America", "Japan", "Australia"],
    "answer": "India"
  },
  {
    "id": 41,
    "chapter": "Climate Change",
    "question": "What is a result of Global Warming?",
    "options": ["Melting of glaciers", "Increase in rainfall", "Wind", "Pressure"],
    "answer": "Melting of glaciers"
  },
  {
    "id": 42,
    "chapter": "Climate Change",
    "question": "Why is sea level rising?",
    "options": ["Melting of ice", "Rain", "Wind", "Pressure"],
    "answer": "Melting of ice"
  },
  {
    "id": 43,
    "chapter": "Climate Change",
    "question": "What is needed to protect the climate?",
    "options": ["Forest conservation", "Waste", "Air pollution", "Nothing"],
    "answer": "Forest conservation"
  },
  {
    "id": 44,
    "chapter": "Climate Change",
    "question": "What can we do to reduce carbon emission?",
    "options": ["Plant trees", "Reduce fuel use", "Recycle", "All"],
    "answer": "All"
  },
  {
    "id": 45,
    "chapter": "Climate Change",
    "question": "Why is the Ozone layer getting depleted?",
    "options": ["CFC", "CO₂", "O₂", "N₂"],
    "answer": "CFC"
  },
  {
    "id": 46,
    "chapter": "Consumer Rights",
    "question": "What is the duty of a consumer?",
    "options": ["Take bill", "Check quality", "File complaint", "All"],
    "answer": "All"
  },
  {
    "id": 47,
    "chapter": "Consumer Rights",
    "question": "Which court handles consumer complaints?",
    "options": ["Consumer Court", "Supreme Court", "High Court", "District Court"],
    "answer": "Consumer Court"
  },
  {
    "id": 48,
    "chapter": "Consumer Rights",
    "question": "Which mark ensures quality?",
    "options": ["AGMARK", "ATM", "GST", "PAN"],
    "answer": "AGMARK"
  },
  {
    "id": 49,
    "chapter": "Consumer Rights",
    "question": "Why is it important to take a bill?",
    "options": ["For complaint", "As proof", "To prove price", "All"],
    "answer": "All"
  },
  {
    "id": 50,
    "chapter": "Consumer Rights",
    "question": "What should we do to avoid cheating?",
    "options": ["Check price", "Read label", "Take bill", "All"],
    "answer": "All"
  },
  { "id": 51, "chapter": "Economy", "question": "What are the types of economy?", "options": ["Capitalist", "Socialist", "Mixed", "All"], "answer": "All" },
  { "id": 52, "chapter": "Economy", "question": "What is a market?", "options": ["Place of sale", "Country", "House", "War"], "answer": "Place of sale" },
  { "id": 53, "chapter": "Economy", "question": "What is demand?", "options": ["Need", "Supply", "Price", "Profit"], "answer": "Need" },
  { "id": 54, "chapter": "Economy", "question": "What is supply?", "options": ["Distribution", "Demand", "Price", "Profit"], "answer": "Distribution" },
  { "id": 55, "chapter": "Economy", "question": "What determines price?", "options": ["Demand & Supply", "Rain", "Wind", "Pressure"], "answer": "Demand & Supply" },
  { "id": 56, "chapter": "Changing Earth", "question": "What are geomorphic processes?", "options": ["Movements on Earth", "Wind", "Rain", "Pressure"], "answer": "Movements on Earth" },
  { "id": 57, "chapter": "Changing Earth", "question": "What is an earthquake?", "options": ["Shaking of Earth", "Rain", "Wind", "Pressure"], "answer": "Shaking of Earth" },
  { "id": 58, "chapter": "Changing Earth", "question": "What is a hazard?", "options": ["Threat", "Rain", "Wind", "Pressure"], "answer": "Threat" },
  { "id": 59, "chapter": "Changing Earth", "question": "What is a disaster?", "options": ["Large scale destruction", "Rain", "Wind", "Pressure"], "answer": "Large scale destruction" },
  { "id": 60, "chapter": "Changing Earth", "question": "What is Risk?", "options": ["Possibility of loss", "Rain", "Wind", "Pressure"], "answer": "Possibility of loss" },
  { "id": 61, "chapter": "Changing Earth", "question": "What is Vulnerability?", "options": ["Possibility of impact", "Loss", "Rain", "Wind"], "answer": "Possibility of impact" },
  { "id": 62, "chapter": "Changing Earth", "question": "What is Capacity?", "options": ["Ability to resist", "Loss", "Rain", "Wind"], "answer": "Ability to resist" },
  { "id": 63, "chapter": "Changing Earth", "question": "What is the main cause of earthquakes?", "options": ["Movement of plates", "Rain", "Wind", "Pressure"], "answer": "Movement of plates" },
  { "id": 64, "chapter": "Changing Earth", "question": "What type of disaster is a volcanic eruption?", "options": ["Natural disaster", "Man-made", "Economic", "Political"], "answer": "Natural disaster" },
  { "id": 65, "chapter": "Changing Earth", "question": "Which category does a landslide belong to?", "options": ["Geomorphic phenomenon", "Economic", "Political", "Commercial"], "answer": "Geomorphic phenomenon" },
  { "id": 66, "chapter": "Changing Earth", "question": "How is the intensity of an earthquake measured?", "options": ["Richter Scale", "Celsius", "Meter", "Liter"], "answer": "Richter Scale" },
  { "id": 67, "chapter": "Changing Earth", "question": "What is the centre of an earthquake on the surface?", "options": ["Epicentre", "Hypocentre", "Cloud", "Wind"], "answer": "Epicentre" },
  { "id": 68, "chapter": "Changing Earth", "question": "What is the main cause of a tsunami?", "options": ["Earthquake", "Rain", "Wind", "Pressure"], "answer": "Earthquake" },
  { "id": 69, "chapter": "Changing Earth", "question": "What should we do to avoid natural disasters?", "options": ["Precaution", "Neglect", "Delay", "Nothing"], "answer": "Precaution" },
  { "id": 70, "chapter": "Changing Earth", "question": "What is the goal of disaster management?", "options": ["Reduce destruction", "Increase destruction", "Rain", "Wind"], "answer": "Reduce destruction" },
  { "id": 71, "chapter": "Indian Economy", "question": "What is the nature of the Indian economy?", "options": ["Mixed economy", "Capitalist", "Socialist", "None"], "answer": "Mixed economy" },
  { "id": 72, "chapter": "Indian Economy", "question": "What is the primary sector?", "options": ["Agriculture", "Industry", "Service", "Trade"], "answer": "Agriculture" },
  { "id": 73, "chapter": "Indian Economy", "question": "What is the secondary sector?", "options": ["Industry", "Agriculture", "Service", "Trade"], "answer": "Industry" },
  { "id": 74, "chapter": "Indian Economy", "question": "What is the tertiary sector?", "options": ["Service", "Agriculture", "Industry", "Rain"], "answer": "Service" },
  { "id": 75, "chapter": "Indian Economy", "question": "What does GDP indicate?", "options": ["Total production", "Rain", "Wind", "Pressure"], "answer": "Total production" },
  { "id": 76, "chapter": "Indian Economy", "question": "What is National Income?", "options": ["Total income", "Rain", "Wind", "Pressure"], "answer": "Total income" },
  { "id": 77, "chapter": "Indian Economy", "question": "What is economic planning?", "options": ["Development plan", "Rain", "Wind", "Pressure"], "answer": "Development plan" },
  { "id": 78, "chapter": "Indian Economy", "question": "What is the main function of a bank?", "options": ["Deposit", "Loan", "Exchange", "All"], "answer": "All" },
  { "id": 79, "chapter": "Indian Economy", "question": "What is poverty?", "options": ["Inability to meet needs", "Rain", "Wind", "Pressure"], "answer": "Inability to meet needs" },
  { "id": 80, "chapter": "Indian Economy", "question": "What is unemployment?", "options": ["No job", "Rain", "Wind", "Pressure"], "answer": "No job" },
  { "id": 81, "chapter": "Sustainability", "question": "What is sustainable development?", "options": ["Future protection", "Profit", "Rain", "Wind"], "answer": "Future protection" },
  { "id": 82, "chapter": "Sustainability", "question": "What is the goal of sustainable development?", "options": ["Development and protection", "Profit", "Rain", "Wind"], "answer": "Development and protection" },
  { "id": 83, "chapter": "Sustainability", "question": "What is reuse?", "options": ["Using again", "Destroying", "Rain", "Wind"], "answer": "Using again" },
  { "id": 84, "chapter": "Sustainability", "question": "What should we do to reduce waste?", "options": ["Reduce", "Reuse", "Recycle", "All"], "answer": "All" },
  { "id": 85, "chapter": "Sustainability", "question": "Why is water conservation important?", "options": ["For the future", "Rain", "Wind", "Pressure"], "answer": "For the future" },
  { "id": 86, "chapter": "Sustainability", "question": "Why is forest conservation important?", "options": ["Climate control", "Rain", "Wind", "Pressure"], "answer": "Climate control" },
  { "id": 87, "chapter": "Sustainability", "question": "Example of renewable energy?", "options": ["Solar energy", "Coal", "Petrol", "Diesel"], "answer": "Solar energy" },
  { "id": 88, "chapter": "Sustainability", "question": "What should we do to reduce pollution?", "options": ["Plant trees", "Reuse", "Reduce vehicles", "All"], "answer": "All" },
  { "id": 89, "chapter": "Sustainability", "question": "What is the goal of environmental protection?", "options": ["Sustainability", "Profit", "Rain", "Wind"], "answer": "Sustainability" },
  { "id": 90, "chapter": "Sustainability", "question": "What should we do for future generations?", "options": ["Protect resources", "Destroy", "Rain", "Wind"], "answer": "Protect resources" },
  { "id": 91, "chapter": "Weather and Climate", "question": "What is the branch of science that studies weather?", "options": ["Meteorology", "Geology", "Economics", "Biology"], "answer": "Meteorology" },
  { "id": 92, "chapter": "Weather and Climate", "question": "Which instrument is used to measure rainfall?", "options": ["Rain gauge", "Barometer", "Thermometer", "Hygrometer"], "answer": "Rain gauge" },
  { "id": 93, "chapter": "Weather and Climate", "question": "When is temperature usually highest?", "options": ["After noon", "Morning", "Night", "Midnight"], "answer": "After noon" },
  { "id": 94, "chapter": "Weather and Climate", "question": "When is the lowest temperature recorded?", "options": ["Before sunrise", "Noon", "Evening", "Night"], "answer": "Before sunrise" },
  { "id": 95, "chapter": "Weather and Climate", "question": "What is the amount of water vapour in the atmosphere?", "options": ["Humidity", "Pressure", "Heat", "Wind"], "answer": "Humidity" },
  { "id": 96, "chapter": "Climatic Zones", "question": "What is the climate near the Equator?", "options": ["Tropical", "Temperate", "Polar", "Desert"], "answer": "Tropical" },
  { "id": 97, "chapter": "Climatic Zones", "question": "What is the main feature of the Polar zone?", "options": ["Low temperature", "More rain", "Wind", "Pressure"], "answer": "Low temperature" },
  { "id": 98, "chapter": "Climatic Zones", "question": "What winds cause monsoon rains?", "options": ["Monsoon winds", "Western winds", "Northern winds", "Southern winds"], "answer": "Monsoon winds" },
  { "id": 99, "chapter": "Climatic Zones", "question": "How does temperature vary in deserts?", "options": ["Hot days and cold nights", "Stable", "Cold only", "Hot only"], "answer": "Hot days and cold nights" },
  { "id": 100, "chapter": "Climatic Zones", "question": "How many years of data are used to determine climate?", "options": ["35-40 years", "10 years", "5 years", "1 year"], "answer": "35-40 years" },
  { "id": 101, "chapter": "Climate Change", "question": "Which gas is mainly responsible for Global Warming?", "options": ["CO₂", "O₂", "N₂", "He"], "answer": "CO₂" },
  { "id": 102, "chapter": "Climate Change", "question": "What is the result of the Greenhouse Effect?", "options": ["Earth's temperature increases", "Rain decreases", "Wind decreases", "Nothing"], "answer": "Earth's temperature increases" },
  { "id": 103, "chapter": "Climate Change", "question": "Why are ice caps melting?", "options": ["Rise in temperature", "Rain", "Wind", "Pressure"], "answer": "Rise in temperature" },
  { "id": 104, "chapter": "Climate Change", "question": "What should we do to prevent climate change?", "options": ["Forest conservation", "Reduce fuel", "Recycle", "All"], "answer": "All" },
  { "id": 105, "chapter": "Climate Change", "question": "What does the Ozone layer protect us from?", "options": ["UV rays", "Rain", "Wind", "Pressure"], "answer": "UV rays" },
  { "id": 106, "chapter": "Consumer Rights", "question": "What is the consumer's right to safety?", "options": ["Safe product", "Low price", "Rain", "Wind"], "answer": "Safe product" },
  { "id": 107, "chapter": "Consumer Rights", "question": "What is the right to information?", "options": ["Know product details", "Price", "Rain", "Wind"], "answer": "Know product details" },
  { "id": 108, "chapter": "Consumer Rights", "question": "What is the right to choice?", "options": ["Choose for oneself", "Price", "Rain", "Wind"], "answer": "Choose for oneself" },
  { "id": 109, "chapter": "Consumer Rights", "question": "What is the right to be heard?", "options": ["Right to complaint", "Price", "Rain", "Wind"], "answer": "Right to complaint" },
  { "id": 110, "chapter": "Consumer Rights", "question": "Why is consumer education important?", "options": ["Awareness", "Price", "Rain", "Wind"], "answer": "Awareness" },
  { "id": 111, "chapter": "Economy", "question": "What are economic activities?", "options": ["Production", "Distribution", "Consumption", "All"], "answer": "All" },
  { "id": 112, "chapter": "Economy", "question": "What is production?", "options": ["Creation of goods", "Rain", "Wind", "Pressure"], "answer": "Creation of goods" },
  { "id": 113, "chapter": "Economy", "question": "What is consumption?", "options": ["Use", "Selling", "Rain", "Wind"], "answer": "Use" },
  { "id": 114, "chapter": "Economy", "question": "What is distribution?", "options": ["Distribution of goods", "Rain", "Wind", "Pressure"], "answer": "Distribution of goods" },
  { "id": 115, "chapter": "Economy", "question": "What is a market system?", "options": ["Price determination", "Rain", "Wind", "Pressure"], "answer": "Price determination" },
  { "id": 116, "chapter": "Changing Earth", "question": "Why do geomorphic processes occur?", "options": ["Internal movements", "Rain", "Wind", "Pressure"], "answer": "Internal movements" },
  { "id": 117, "chapter": "Changing Earth", "question": "What are the layers of the Earth?", "options": ["Crust", "Mantle", "Core", "All"], "answer": "All" },
  { "id": 118, "chapter": "Changing Earth", "question": "How are mountains formed?", "options": ["Plate movement", "Rain", "Wind", "Pressure"], "answer": "Plate movement" },
  { "id": 119, "chapter": "Changing Earth", "question": "What is a volcano?", "options": ["Eruption of lava", "Rain", "Wind", "Pressure"], "answer": "Eruption of lava" },
  { "id": 120, "chapter": "Changing Earth", "question": "What is the main goal of disaster management?", "options": ["Save lives", "Increase destruction", "Rain", "Wind"], "answer": "Save lives" },
  { "id": 121, "chapter": "Changing Earth", "question": "What is the origin point of an earthquake?", "options": ["Hypocentre", "Epicentre", "Crust", "Mantle"], "answer": "Hypocentre" },
  { "id": 122, "chapter": "Changing Earth", "question": "What is the epicentre?", "options": ["Surface centre on Earth", "Internal centre", "Rain", "Wind"], "answer": "Surface centre on Earth" },
  { "id": 123, "chapter": "Changing Earth", "question": "What are earthquake waves called?", "options": ["Seismic waves", "Rain", "Wind", "Heat"], "answer": "Seismic waves" },
  { "id": 124, "chapter": "Changing Earth", "question": "Where does a tsunami originate?", "options": ["In the ocean", "On land", "In mountains", "In the sky"], "answer": "In the ocean" },
  { "id": 125, "chapter": "Changing Earth", "question": "What is the main cause of a landslide?", "options": ["Rain", "Wind", "Pressure", "Heat"], "answer": "Rain" },
  { "id": 126, "chapter": "Indian Economy", "question": "What is the main occupation sector in India?", "options": ["Agriculture", "Industry", "Service", "Trade"], "answer": "Agriculture" },
  { "id": 127, "chapter": "Indian Economy", "question": "What is needed for industrial development?", "options": ["Capital", "Labour", "Technology", "All"], "answer": "All" },
  { "id": 128, "chapter": "Indian Economy", "question": "Example of service sector?", "options": ["Banking", "Agriculture", "Mining", "Forest"], "answer": "Banking" },
  { "id": 129, "chapter": "Indian Economy", "question": "What is a bank loan for?", "options": ["Business", "Education", "House", "All"], "answer": "All" },
  { "id": 130, "chapter": "Indian Economy", "question": "What should we do to reduce poverty?", "options": ["Create jobs", "Education", "Development", "All"], "answer": "All" },
  { "id": 131, "chapter": "Indian Economy", "question": "What should we do to reduce unemployment?", "options": ["Create employment opportunities", "Education", "Industry", "All"], "answer": "All" },
  { "id": 132, "chapter": "Indian Economy", "question": "What is the work of the Planning Commission?", "options": ["Development planning", "Rain", "Wind", "Pressure"], "answer": "Development planning" },
  { "id": 133, "chapter": "Indian Economy", "question": "What is the Public Sector?", "options": ["Government ownership", "Private ownership", "Mixed", "None"], "answer": "Government ownership" },
  { "id": 134, "chapter": "Indian Economy", "question": "What is the Private Sector?", "options": ["Private ownership", "Government", "Mixed", "None"], "answer": "Private ownership" },
  { "id": 135, "chapter": "Indian Economy", "question": "What is a Mixed Economy?", "options": ["Public + Private", "Agriculture only", "Industry only", "None"], "answer": "Public + Private" },
  { "id": 136, "chapter": "Sustainability", "question": "Who first proposed sustainable development?", "options": ["Brundtland Report", "UN", "India", "Europe"], "answer": "Brundtland Report" },
  { "id": 137, "chapter": "Sustainability", "question": "What are the three pillars of sustainability?", "options": ["Economic", "Social", "Environmental", "All"], "answer": "All" },
  { "id": 138, "chapter": "Sustainability", "question": "How to protect the environment?", "options": ["Plant trees", "Reuse", "Reduce waste", "All"], "answer": "All" },
  { "id": 139, "chapter": "Sustainability", "question": "How to prevent water pollution?", "options": ["Don't dump waste", "Purification", "Conservation", "All"], "answer": "All" },
  { "id": 140, "chapter": "Sustainability", "question": "What is the main cause of air pollution?", "options": ["Vehicles", "Factories", "Smoke", "All"], "answer": "All" },
  { "id": 141, "chapter": "Sustainability", "question": "What is renewable energy?", "options": ["Solar energy", "Wind energy", "Hydro energy", "All"], "answer": "All" },
  { "id": 142, "chapter": "Sustainability", "question": "What is fossil fuel?", "options": ["Coal", "Petrol", "Diesel", "All"], "answer": "All" },
  { "id": 143, "chapter": "Sustainability", "question": "What is the goal of reuse?", "options": ["Reduce waste", "Increase price", "Rain", "Wind"], "answer": "Reduce waste" },
  { "id": 144, "chapter": "Sustainability", "question": "What does Reduce mean?", "options": ["Reduce usage", "Use again", "Rain", "Wind"], "answer": "Reduce usage" },
  { "id": 145, "chapter": "Sustainability", "question": "What does Recycle mean?", "options": ["Remake", "Reduce usage", "Rain", "Wind"], "answer": "Remake" },
  { "id": 146, "chapter": "Sustainability", "question": "What is the result of deforestation?", "options": ["Climate change", "Rain", "Wind", "Pressure"], "answer": "Climate change" },
  { "id": 147, "chapter": "Sustainability", "question": "What is biodiversity?", "options": ["Diversity of living beings", "Rain", "Wind", "Pressure"], "answer": "Diversity of living beings" },
  { "id": 148, "chapter": "Sustainability", "question": "Why should we protect biodiversity?", "options": ["For sustainability", "Profit", "Rain", "Wind"], "answer": "For sustainability" },
  { "id": 149, "chapter": "Sustainability", "question": "How to reduce plastic pollution?", "options": ["Reuse", "Reduce plastic", "Use alternatives", "All"], "answer": "All" },
  { "id": 150, "chapter": "Sustainability", "question": "What should we do for future generations?", "options": ["Protect resources", "Destroy", "Rain", "Wind"], "answer": "Protect resources" },
  { "id": 151, "chapter": "Globalisation", "question": "What is globalisation?", "options": ["Integration of economies", "War", "Fear", "Control"], "answer": "Integration of economies" },
  { "id": 152, "chapter": "Globalisation", "question": "What is the role of technology in globalisation?", "options": ["Connects countries", "Disconnects", "Nothing", "War"], "answer": "Connects countries" },
  { "id": 153, "chapter": "Globalisation", "question": "What is an MNC?", "options": ["Multinational Corporation", "National Corporation", "Small company", "None"], "answer": "Multinational Corporation" },
  { "id": 154, "chapter": "Globalisation", "question": "What is FDI?", "options": ["Foreign Direct Investment", "Finance", "Food", "Forest"], "answer": "Foreign Direct Investment" },
  { "id": 155, "chapter": "Globalisation", "question": "What is the impact of globalisation on consumers?", "options": ["More choice", "Less choice", "No choice", "High price"], "answer": "More choice" },
  { "id": 156, "chapter": "Consumer Awareness", "question": "What is consumer exploitation?", "options": ["Cheating by sellers", "Safety", "Information", "Choice"], "answer": "Cheating by sellers" },
  { "id": 157, "chapter": "Consumer Awareness", "question": "Why is a trademark important?", "options": ["Quality assurance", "Price", "Weight", "Color"], "answer": "Quality assurance" },
  { "id": 158, "chapter": "Consumer Awareness", "question": "What is the purpose of Agmark?", "options": ["Agricultural quality", "Industry", "Service", "Trade"], "answer": "Agricultural quality" },
  { "id": 159, "chapter": "Consumer Awareness", "question": "What is ISI mark for?", "options": ["Industrial products", "Agriculture", "Food", "Clothes"], "answer": "Industrial products" },
  { "id": 160, "chapter": "Consumer Awareness", "question": "What is Hallmarking for?", "options": ["Gold", "Silver", "Iron", "Wood"], "answer": "Gold" },
  { "id": 161, "chapter": "Weather and Climate", "question": "What is the layer of air surrounding the Earth?", "options": ["Atmosphere", "Hydrosphere", "Lithosphere", "Biosphere"], "answer": "Atmosphere" },
  { "id": 162, "chapter": "Weather and Climate", "question": "Which gas is most abundant in the atmosphere?", "options": ["Nitrogen", "Oxygen", "CO₂", "Argon"], "answer": "Nitrogen" },
  { "id": 163, "chapter": "Weather and Climate", "question": "What is the percentage of Oxygen in the atmosphere?", "options": ["21%", "78%", "1%", "0.03%"], "answer": "21%" },
  { "id": 164, "chapter": "Weather and Climate", "question": "Which layer of the atmosphere is closest to Earth?", "options": ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], "answer": "Troposphere" },
  { "id": 165, "chapter": "Weather and Climate", "question": "In which layer do most weather phenomena occur?", "options": ["Troposphere", "Stratosphere", "Exosphere", "Ionosphere"], "answer": "Troposphere" },
  { "id": 166, "chapter": "Climatic Zones", "question": "What is the area between the Tropics called?", "options": ["Torrid Zone", "Temperate Zone", "Frigid Zone", "None"], "answer": "Torrid Zone" },
  { "id": 167, "chapter": "Climatic Zones", "question": "What is the zone with moderate temperature?", "options": ["Temperate Zone", "Torrid Zone", "Frigid Zone", "None"], "answer": "Temperate Zone" },
  { "id": 168, "chapter": "Climatic Zones", "question": "What is the zone near the poles called?", "options": ["Frigid Zone", "Torrid Zone", "Temperate Zone", "None"], "answer": "Frigid Zone" },
  { "id": 169, "chapter": "Climatic Zones", "question": "How does latitude affect climate?", "options": ["Temp decreases from equator to poles", "Increases", "No change", "Random"], "answer": "Temp decreases from equator to poles" },
  { "id": 170, "chapter": "Climatic Zones", "question": "How does altitude affect pressure?", "options": ["Pressure decreases with height", "Increases", "Stable", "None"], "answer": "Pressure decreases with height" },
  { "id": 171, "chapter": "Changing Earth", "question": "What is weathering?", "options": ["Breaking of rocks", "Building of rocks", "Moving of rocks", "None"], "answer": "Breaking of rocks" },
  { "id": 172, "chapter": "Changing Earth", "question": "What is erosion?", "options": ["Wearing away of land", "Building land", "Rain", "Wind"], "answer": "Wearing away of land" },
  { "id": 173, "chapter": "Changing Earth", "question": "Main agent of erosion in rivers?", "options": ["Running water", "Wind", "Glacier", "Waves"], "answer": "Running water" },
  { "id": 174, "chapter": "Changing Earth", "question": "Main agent of erosion in deserts?", "options": ["Wind", "Water", "Ice", "Sea"], "answer": "Wind" },
  { "id": 175, "chapter": "Changing Earth", "question": "What is a delta?", "options": ["Landform at river mouth", "Mountain", "Valley", "Desert"], "answer": "Landform at river mouth" },
  { "id": 176, "chapter": "Public Finance", "question": "What is public revenue?", "options": ["Income of government", "Expenses", "Debt", "Tax"], "answer": "Income of government" },
  { "id": 177, "chapter": "Public Finance", "question": "What is public expenditure?", "options": ["Expense of government", "Income", "Tax", "Debt"], "answer": "Expense of government" },
  { "id": 178, "chapter": "Public Finance", "question": "What is a budget?", "options": ["Financial plan", "Tax", "War", "Fear"], "answer": "Financial plan" },
  { "id": 179, "chapter": "Public Finance", "question": "What is a deficit budget?", "options": ["Expenditure > Revenue", "Revenue > Expenditure", "Equal", "None"], "answer": "Expenditure > Revenue" },
  { "id": 180, "chapter": "Public Finance", "question": "What is a surplus budget?", "options": ["Revenue > Expenditure", "Expenditure > Revenue", "Equal", "None"], "answer": "Revenue > Expenditure" },
  { "id": 181, "chapter": "Indian Economy", "question": "What is human resource development?", "options": ["Improvement of human skills", "Population growth", "Wealth", "Fear"], "answer": "Improvement of human skills" },
  { "id": 182, "chapter": "Indian Economy", "question": "What is the importance of education?", "options": ["Skill development", "Knowledge", "Employment", "All"], "answer": "All" },
  { "id": 183, "chapter": "Indian Economy", "question": "What is the importance of health?", "options": ["Efficiency", "Long life", "Work capacity", "All"], "answer": "All" },
  { "id": 184, "chapter": "Indian Economy", "question": "What is literacy rate?", "options": ["Percentage of educated people", "Population", "Wealth", "Fear"], "answer": "Percentage of educated people" },
  { "id": 185, "chapter": "Indian Economy", "question": "What is life expectancy?", "options": ["Average age of life", "Birth rate", "Death rate", "None"], "answer": "Average age of life" },
  { "id": 186, "chapter": "Indian Economy", "question": "Main objective of NITI Aayog?", "options": ["Economic development", "Tax", "War", "Fear"], "answer": "Economic development" },
  { "id": 187, "chapter": "Indian Economy", "question": "Who is the chairperson of NITI Aayog?", "options": ["Prime Minister", "President", "Fin Minister", "None"], "answer": "Prime Minister" },
  { "id": 188, "chapter": "Indian Economy", "question": "What is liberalisation?", "options": ["Relaxing trade rules", "Control", "Tax", "War"], "answer": "Relaxing trade rules" },
  { "id": 189, "chapter": "Indian Economy", "question": "What is privatisation?", "options": ["Transfer to private sector", "Government sector", "Mixed", "None"], "answer": "Transfer to private sector" },
  { "id": 190, "chapter": "Indian Economy", "question": "What is the impact of LPG?", "options": ["Economic growth", "Trade increase", "Development", "All"], "answer": "All" },
  { "id": 191, "chapter": "Sustainability", "question": "What is an ecosystem?", "options": ["Interaction of living & non-living", "Forest only", "Ocean only", "Desert only"], "answer": "Interaction of living & non-living" },
  { "id": 192, "chapter": "Sustainability", "question": "What is a food chain?", "options": ["Transfer of energy", "Food shop", "Rain", "Wind"], "answer": "Transfer of energy" },
  { "id": 193, "chapter": "Sustainability", "question": "Importance of plants in ecosystem?", "options": ["Producers", "Consumers", "Decomposers", "None"], "answer": "Producers" },
  { "id": 194, "chapter": "Sustainability", "question": "Importance of animals in ecosystem?", "options": ["Consumers", "Producers", "Decomposers", "None"], "answer": "Consumers" },
  { "id": 195, "chapter": "Sustainability", "question": "What is a decomposer?", "options": ["Breaks down waste", "Produces food", "Consumes food", "None"], "answer": "Breaks down waste" },
  { "id": 196, "chapter": "Sustainability", "question": "Impact of pollution on ecosystem?", "options": ["Destruction", "Growth", "Nothing", "Rain"], "answer": "Destruction" },
  { "id": 197, "chapter": "Sustainability", "question": "How to conserve soil?", "options": ["Plant trees", "Terrace farming", "Bunds", "All"], "answer": "All" },
  { "id": 198, "chapter": "Sustainability", "question": "How to conserve water resources?", "options": ["Rain harvest", "Stop waste", "Dams", "All"], "answer": "All" },
  { "id": 199, "chapter": "Sustainability", "question": "What is sustainable agriculture?", "options": ["Eco-friendly farming", "Chemical use", "Deforestation", "None"], "answer": "Eco-friendly farming" },
  { "id": 200, "chapter": "Sustainability", "question": "Goal of environmental education?", "options": ["Awareness", "Protection", "Responsibility", "All"], "answer": "All" },
  { "id": 201, "chapter": "Globalisation", "question": "What is the role of WTO in globalisation?", "options": ["Trade regulation", "War", "Fear", "Control"], "answer": "Trade regulation" },
  { "id": 202, "chapter": "Globalisation", "question": "What is the impact of globalisation on Indian agriculture?", "options": ["Competition", "Technology use", "Market expansion", "All"], "answer": "All" },
  { "id": 203, "chapter": "Globalisation", "question": "What is the impact of globalisation on Indian industry?", "options": ["Growth", "MNC entry", "Competition", "All"], "answer": "All" },
  { "id": 204, "chapter": "Globalisation", "question": "What is the impact of globalisation on employment?", "options": ["New opportunities", "Job loss in some sectors", "Skill demand", "All"], "answer": "All" },
  { "id": 205, "chapter": "Globalisation", "question": "Benefit of globalisation for small scale industries?", "options": ["Limited", "High", "No impact", "None"], "answer": "Limited" },
  { "id": 206, "chapter": "Consumer Awareness", "question": "What is the consumer's right to redressal?", "options": ["Compensation for loss", "Price", "Rain", "Wind"], "answer": "Compensation for loss" },
  { "id": 207, "chapter": "Consumer Awareness", "question": "What is the National Consumer Disputes Redressal Commission?", "options": ["National level court", "State level", "District level", "None"], "answer": "National level court" },
  { "id": 208, "chapter": "Consumer Awareness", "question": "What is the State Consumer Disputes Redressal Commission?", "options": ["State level court", "National", "District", "None"], "answer": "State level court" },
  { "id": 209, "chapter": "Consumer Awareness", "question": "What is the District Consumer Disputes Redressal Forum?", "options": ["District level court", "State", "National", "None"], "answer": "District level court" },
  { "id": 210, "chapter": "Consumer Awareness", "question": "Who can file a consumer complaint?", "options": ["Consumer", "Government", "Voluntary organization", "All"], "answer": "All" },
  { "id": 211, "chapter": "Weather and Climate", "question": "What is wind?", "options": ["Moving air", "Still air", "Rain", "Heat"], "answer": "Moving air" },
  { "id": 212, "chapter": "Weather and Climate", "question": "What causes wind to blow?", "options": ["Pressure difference", "Rain", "Heat", "Clouds"], "answer": "Pressure difference" },
  { "id": 213, "chapter": "Weather and Climate", "question": "What is the Coriolis force?", "options": ["Force due to Earth's rotation", "Wind force", "Rain force", "Heat"], "answer": "Force due to Earth's rotation" },
  { "id": 214, "chapter": "Weather and Climate", "question": "What are planetary winds?", "options": ["Trade winds", "Westerlies", "Polar easterlies", "All"], "answer": "All" },
  { "id": 215, "chapter": "Weather and Climate", "question": "What are local winds?", "options": ["Loo", "Sea breeze", "Land breeze", "All"], "answer": "All" },
  { "id": 216, "chapter": "Climatic Zones", "question": "Why is it hot in the Torrid Zone?", "options": ["Vertical sun rays", "Slanting rays", "Rain", "Wind"], "answer": "Vertical sun rays" },
  { "id": 217, "chapter": "Climatic Zones", "question": "Why is it cool in the Temperate Zone?", "options": ["Slanting sun rays", "Vertical rays", "Rain", "Wind"], "answer": "Slanting sun rays" },
  { "id": 218, "chapter": "Climatic Zones", "question": "How does distance from the sea affect climate?", "options": ["Moderate near sea", "Extreme inland", "No change", "Both A & B"], "answer": "Both A & B" },
  { "id": 219, "chapter": "Climatic Zones", "question": "How do ocean currents affect climate?", "options": ["Warm currents heat", "Cold currents cool", "No change", "Both A & B"], "answer": "Both A & B" },
  { "id": 220, "chapter": "Climatic Zones", "question": "How do mountain ranges affect climate?", "options": ["Block winds", "Cause rain", "Thermal barrier", "All"], "answer": "All" },
  { "id": 221, "chapter": "Changing Earth", "question": "What is biological weathering?", "options": ["Breaking by living beings", "Rain", "Wind", "Heat"], "answer": "Breaking by living beings" },
  { "id": 222, "chapter": "Changing Earth", "question": "What is chemical weathering?", "options": ["Reaction with chemicals", "Breaking by force", "Rain", "Wind"], "answer": "Reaction with chemicals" },
  { "id": 223, "chapter": "Changing Earth", "question": "What is physical weathering?", "options": ["Breaking by physical forces", "Chemical reaction", "Rain", "Wind"], "answer": "Breaking by physical forces" },
  { "id": 224, "chapter": "Changing Earth", "question": "Main agent of erosion in glaciers?", "options": ["Moving ice", "Wind", "Water", "Waves"], "answer": "Moving ice" },
  { "id": 225, "chapter": "Changing Earth", "question": "Main agent of erosion in sea coasts?", "options": ["Sea waves", "Wind", "Rivers", "Glaciers"], "answer": "Sea waves" },
  { "id": 226, "chapter": "Public Finance", "question": "What is tax revenue?", "options": ["Income from taxes", "Fines", "Grants", "Loans"], "answer": "Income from taxes" },
  { "id": 227, "chapter": "Public Finance", "question": "What is non-tax revenue?", "options": ["Fines", "Fees", "Grants", "All"], "answer": "All" },
  { "id": 228, "chapter": "Public Finance", "question": "What is a direct tax?", "options": ["Income tax", "GST", "Sales tax", "Excise"], "answer": "Income tax" },
  { "id": 229, "chapter": "Public Finance", "question": "What is an indirect tax?", "options": ["GST", "Income tax", "Property tax", "Wealth tax"], "answer": "GST" },
  { "id": 230, "chapter": "Public Finance", "question": "What is GST?", "options": ["Goods and Services Tax", "General Sales Tax", "Government Service Tax", "None"], "answer": "Goods and Services Tax" },
  { "id": 231, "chapter": "Indian Economy", "question": "What is human capital?", "options": ["Skill & Knowledge", "Money", "Land", "Buildings"], "answer": "Skill & Knowledge" },
  { "id": 232, "chapter": "Indian Economy", "question": "Importance of vocational education?", "options": ["Job skill", "Knowledge", "Degree", "None"], "answer": "Job skill" },
  { "id": 233, "chapter": "Indian Economy", "question": "What is child labour?", "options": ["Work by children", "Education", "Play", "None"], "answer": "Work by children" },
  { "id": 234, "chapter": "Indian Economy", "question": "What is the legal age for work in India?", "options": ["Above 14", "Above 10", "Above 12", "None"], "answer": "Above 14" },
  { "id": 235, "chapter": "Indian Economy", "question": "What is the importance of social security?", "options": ["Protection to workers", "Money", "Fear", "War"], "answer": "Protection to workers" },
  { "id": 236, "chapter": "Indian Economy", "question": "Main function of SEBI?", "options": ["Regulation of stock market", "Banking", "Tax", "Trade"], "answer": "Regulation of stock market" },
  { "id": 237, "chapter": "Indian Economy", "question": "Main goal of Make in India?", "options": ["Growth of industry", "Tax", "War", "Fear"], "answer": "Growth of industry" },
  { "id": 238, "chapter": "Indian Economy", "question": "Main goal of Digital India?", "options": ["Digital technology", "Agriculture", "Industry", "None"], "answer": "Digital technology" },
  { "id": 239, "chapter": "Indian Economy", "question": "Main goal of Skill India?", "options": ["Skill development", "Education", "Health", "None"], "answer": "Skill development" },
  { "id": 240, "chapter": "Indian Economy", "question": "What is the importance of infrastructure?", "options": ["Basis of development", "Tax", "War", "Fear"], "answer": "Basis of development" },
  { "id": 241, "chapter": "Sustainability", "question": "What is the carbon cycle?", "options": ["Circulation of carbon", "Oxygen", "Nitrogen", "None"], "answer": "Circulation of carbon" },
  { "id": 242, "chapter": "Sustainability", "question": "What is the nitrogen cycle?", "options": ["Circulation of nitrogen", "Oxygen", "Carbon", "None"], "answer": "Circulation of nitrogen" },
  { "id": 243, "chapter": "Sustainability", "question": "What is the water cycle?", "options": ["Circulation of water", "Heat", "Wind", "None"], "answer": "Circulation of water" },
  { "id": 244, "chapter": "Sustainability", "question": "Impact of global warming on biodiversity?", "options": ["Threat of extinction", "Growth", "Nothing", "Rain"], "answer": "Threat of extinction" },
  { "id": 245, "chapter": "Sustainability", "question": "Importance of wetlands?", "options": ["Groundwater recharge", "Flood control", "Biodiversity", "All"], "answer": "All" },
  { "id": 246, "chapter": "Sustainability", "question": "Why should we reduce carbon footprint?", "options": ["Prevent climate change", "Save money", "Rain", "Wind"], "answer": "Prevent climate change" },
  { "id": 247, "chapter": "Sustainability", "question": "What is organic farming?", "options": ["No chemicals", "No water", "No sun", "None"], "answer": "No chemicals" },
  { "id": 248, "chapter": "Sustainability", "question": "How to protect endangered species?", "options": ["Habitat protection", "Ban hunting", "Awareness", "All"], "answer": "All" },
  { "id": 249, "chapter": "Sustainability", "question": "Social aspect of sustainability?", "options": ["Equality", "Justice", "Education", "All"], "answer": "All" },
  { "id": 250, "chapter": "Sustainability", "question": "What should the youth do for sustainability?", "options": ["Lead change", "Be aware", "Practice conservation", "All"], "answer": "All" },
  { "id": 251, "chapter": "Globalisation", "question": "What is the importance of global communication?", "options": ["Connectivity", "Information exchange", "Trade facilitation", "All"], "answer": "All" },
  { "id": 252, "chapter": "Globalisation", "question": "What is the impact of globalisation on travel?", "options": ["Easy movement", "Tourism growth", "Connectivity", "All"], "answer": "All" },
  { "id": 253, "chapter": "Globalisation", "question": "What is the impact of globalisation on culture?", "options": ["Cultural exchange", "Global trends", "Diversity", "All"], "answer": "All" },
  { "id": 254, "chapter": "Globalisation", "question": "What is the challenge for domestic companies due to globalisation?", "options": ["Competition", "Market loss", "Tech gap", "All"], "answer": "All" },
  { "id": 255, "chapter": "Globalisation", "question": "Goal of fair globalisation?", "options": ["Equality", "Benefits for all", "Justice", "All"], "answer": "All" },
  { "id": 256, "chapter": "Consumer Awareness", "question": "What is consumerist culture?", "options": ["Excessive consumption", "Wise buying", "Saving", "None"], "answer": "Excessive consumption" },
  { "id": 257, "chapter": "Consumer Awareness", "question": "Why is consumer awareness needed?", "options": ["Prevent cheating", "Know rights", "Safety", "All"], "answer": "All" },
  { "id": 258, "chapter": "Consumer Awareness", "question": "What is a consumer organization?", "options": ["Group protecting consumers", "Business group", "Government", "None"], "answer": "Group protecting consumers" },
  { "id": 259, "chapter": "Consumer Awareness", "question": "Role of media in consumer awareness?", "options": ["Spread information", "Expose cheating", "Education", "All"], "answer": "All" },
  { "id": 260, "chapter": "Consumer Awareness", "question": "What is a consumer forum?", "options": ["Place for discussion & help", "Market", "Bank", "Court"], "answer": "Place for discussion & help" },
  { "id": 261, "chapter": "Weather and Climate", "question": "What is air pressure?", "options": ["Weight of air", "Heat of air", "Speed of air", "None"], "answer": "Weight of air" },
  { "id": 262, "chapter": "Weather and Climate", "question": "What is an isobar?", "options": ["Line connecting equal pressure", "Equal temp", "Equal rain", "None"], "answer": "Line connecting equal pressure" },
  { "id": 263, "chapter": "Weather and Climate", "question": "What is a cyclone?", "options": ["Low pressure system", "High pressure", "Still air", "Rain"], "answer": "Low pressure system" },
  { "id": 264, "chapter": "Weather and Climate", "question": "What is an anticyclone?", "options": ["High pressure system", "Low pressure", "Rain", "Wind"], "answer": "High pressure system" },
  { "id": 265, "chapter": "Weather and Climate", "question": "What is the direction of wind in a cyclone in Northern Hemisphere?", "options": ["Anticlockwise", "Clockwise", "Straight", "None"], "answer": "Anticlockwise" },
  { "id": 266, "chapter": "Climatic Zones", "question": "What is the climate of the desert region?", "options": ["Arid", "Humid", "Cold", "Polar"], "answer": "Arid" },
  { "id": 267, "chapter": "Climatic Zones", "question": "What is the climate of the mountain region?", "options": ["High altitude climate", "Tropical", "Desert", "None"], "answer": "High altitude climate" },
  { "id": 268, "chapter": "Climatic Zones", "question": "Why is it rainy in the equatorial region?", "options": ["High evaporation", "Convectional rain", "Heat", "All"], "answer": "All" },
  { "id": 269, "chapter": "Climatic Zones", "question": "What is the type of forest in the equatorial region?", "options": ["Evergreen forest", "Deciduous", "Coniferous", "Desert"], "answer": "Evergreen forest" },
  { "id": 270, "chapter": "Climatic Zones", "question": "What is the type of trees in the polar region?", "options": ["Mosses & Lichens", "Teak", "Rosewood", "Pine"], "answer": "Mosses & Lichens" },
  { "id": 271, "chapter": "Changing Earth", "question": "What is biological erosion?", "options": ["Erosion by living beings", "Wind", "Water", "Heat"], "answer": "Erosion by living beings" },
  { "id": 272, "chapter": "Changing Earth", "question": "What is the result of river deposition?", "options": ["Alluvial fans", "Deltas", "Flood plains", "All"], "answer": "All" },
  { "id": 273, "chapter": "Changing Earth", "question": "What is an oxbow lake?", "options": ["Feature of river erosion/deposition", "Mountain", "Desert", "Ocean"], "answer": "Feature of river erosion/deposition" },
  { "id": 274, "chapter": "Changing Earth", "question": "What is a mushroom rock?", "options": ["Desert landform", "Mountain", "Ocean", "River"], "answer": "Desert landform" },
  { "id": 275, "chapter": "Changing Earth", "question": "What is a sand dune?", "options": ["Hill of sand in desert", "Mountain", "Valley", "Lakes"], "answer": "Hill of sand in desert" },
  { "id": 276, "chapter": "Public Finance", "question": "What is a proportional tax?", "options": ["Tax rate is fixed", "Tax increases with income", "Decreases", "None"], "answer": "Tax rate is fixed" },
  { "id": 277, "chapter": "Public Finance", "question": "What is a progressive tax?", "options": ["Increases with income", "Fixed", "Decreases", "None"], "answer": "Increases with income" },
  { "id": 278, "chapter": "Public Finance", "question": "What is a regressive tax?", "options": ["Decreases with income", "Increases", "Fixed", "None"], "answer": "Decreases with income" },
  { "id": 279, "chapter": "Public Finance", "question": "What is the Finance Commission?", "options": ["Constitutional body for fund distribution", "Bank", "Tax office", "None"], "answer": "Constitutional body for fund distribution" },
  { "id": 280, "chapter": "Public Finance", "question": "Who appoints the Finance Commission?", "options": ["President", "Prime Minister", "Speaker", "None"], "answer": "President" },
  { "id": 281, "chapter": "Indian Economy", "question": "Impact of population explosion?", "options": ["Resources pressure", "Unemployment", "Poverty", "All"], "answer": "All" },
  { "id": 282, "chapter": "Indian Economy", "question": "Importance of family planning?", "options": ["Population control", "Health", "Development", "All"], "answer": "All" },
  { "id": 283, "chapter": "Indian Economy", "question": "What is per capita income?", "options": ["Average income per person", "Total income", "Total population", "None"], "answer": "Average income per person" },
  { "id": 284, "chapter": "Indian Economy", "question": "Importance of self-employment?", "options": ["Job creation", "Independence", "Growth", "All"], "answer": "All" },
  { "id": 285, "chapter": "Indian Economy", "question": "Role of entrepreneurship?", "options": ["Economic innovation", "Investment", "Development", "All"], "answer": "All" },
  { "id": 286, "chapter": "Indian Economy", "question": "Main goal of Smart Cities Mission?", "options": ["Urban development", "Rural", "Agriculture", "None"], "answer": "Urban development" },
  { "id": 287, "chapter": "Indian Economy", "question": "Importance of foreign trade?", "options": ["Market expansion", "Currency earning", "Connectivity", "All"], "answer": "All" },
  { "id": 288, "chapter": "Indian Economy", "question": "What is the balance of trade?", "options": ["Export vs Import", "Tax", "War", "Fear"], "answer": "Export vs Import" },
  { "id": 289, "chapter": "Indian Economy", "question": "What is the balance of payments?", "options": ["Total financial transactions", "Trade only", "Income only", "None"], "answer": "Total financial transactions" },
  { "id": 290, "chapter": "Indian Economy", "question": "What is economic growth?", "options": ["Increase in production", "Decrease", "No change", "None"], "answer": "Increase in production" },
  { "id": 291, "chapter": "Sustainability", "question": "What is the importance of global cooperation?", "options": ["Solving global issues", "War", "Fear", "Control"], "answer": "Solving global issues" },
  { "id": 292, "chapter": "Sustainability", "question": "United Nations' role in sustainability?", "options": ["Guidelines & Goals", "War", "Fear", "Control"], "answer": "Guidelines & Goals" },
  { "id": 293, "chapter": "Sustainability", "question": "What are Sustainable Development Goals (SDGs)?", "options": ["17 goals for a better future", "10 goals", "5 goals", "None"], "answer": "17 goals for a better future" },
  { "id": 294, "chapter": "Sustainability", "question": "Goal to 'End Poverty' is which SDG?", "options": ["SDG 1", "SDG 5", "SDG 10", "SDG 15"], "answer": "SDG 1" },
  { "id": 295, "chapter": "Sustainability", "question": "Goal for 'Quality Education' is which SDG?", "options": ["SDG 4", "SDG 1", "SDG 10", "SDG 15"], "answer": "SDG 4" },
  { "id": 296, "chapter": "Sustainability", "question": "Goal for 'Climate Action' is which SDG?", "options": ["SDG 13", "SDG 1", "SDG 5", "SDG 10"], "answer": "SDG 13" },
  { "id": 297, "chapter": "Sustainability", "question": "What is individual responsibility?", "options": ["Small actions count", "Ignore", "Delay", "Nothing"], "answer": "Small actions count" },
  { "id": 298, "chapter": "Sustainability", "question": "How to promote sustainability locally?", "options": ["Awareness", "Community work", "Practice conservation", "All"], "answer": "All" },
  { "id": 299, "chapter": "Sustainability", "question": "What is the vision of a sustainable world?", "options": ["Prosperity for all", "Peace", "Healthy planet", "All"], "answer": "All" },
  { "id": 300, "chapter": "Sustainability", "question": "Ultimate purpose of life on Earth?", "options": ["Live in harmony", "Destroy", "War", "Fear"], "answer": "Live in harmony" }
];

async function seedSocialScience2English() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const parsedQuestions = [];
        for (let item of rawData) {
            const correctIndex = item.options.indexOf(item.answer);
            parsedQuestions.push({
                question: item.question,
                options: item.options,
                correctIndex: correctIndex !== -1 ? correctIndex : 0,
                level: 1,
                board: "Kerala State",
                class: "10th (SSLC)",
                subject: "Social Science II",
                chapter: item.chapter,
                medium: "English"
            });
        }

        let addedCount = 0;
        let skippedCount = 0;

        for (const q of parsedQuestions) {
            const exists = await Question.findOne({
                question: q.question,
                chapter: q.chapter,
                subject: q.subject,
                medium: q.medium,
                class: q.class
            });

            if (!exists) {
                await Question.create(q);
                console.log(`✅ Added: ${q.chapter} | ${q.question.substring(0, 50)}...`);
                addedCount++;
            } else {
                console.log(`⏭️ Skipped: ${q.question.substring(0, 50)}...`);
                skippedCount++;
            }
        }

        console.log(`\n🎉 Seeding completed! Added: ${addedCount} | Skipped: ${skippedCount}`);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedSocialScience2English();
