const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Question = require("../models/Question");

const BOARD = "Kerala State";
const CLASS_NAME = "+2";
const MEDIUM = "English";

function q(question, options, correctIndex) {
  return { question, options, correctIndex };
}

const chapterBanks = [
  {
    subject: "History 1",
    chapter: "Bricks, Beads and Bones",
    questions: [
      q("The Harappan civilisation is also known as the ____ civilisation.", ["Vedic", "Indus Valley", "Mauryan", "Megalithic"], 1),
      q("The Mature Harappan period is generally dated between:", ["1500-1000 BCE", "2600-1900 BCE", "600-300 BCE", "320-185 BCE"], 1),
      q("The Great Bath was discovered at:", ["Harappa", "Kalibangan", "Mohenjodaro", "Lothal"], 2),
      q("Which Harappan site is famous for its dockyard?", ["Dholavira", "Lothal", "Rakhigarhi", "Banawali"], 1),
      q("Which site is well known for its water reservoirs and unique town planning?", ["Dholavira", "Harappa", "Chanhudaro", "Kot Diji"], 0),
      q("Most Harappan seals were made of:", ["Copper", "Steatite", "Iron", "Granite"], 1),
      q("The Harappan script remains:", ["Fully translated", "Partly translated", "Undeciphered", "Written only in Sanskrit"], 2),
      q("Evidence of a ploughed field has been found at:", ["Kalibangan", "Mohenjodaro", "Lothal", "Sutkagendor"], 0),
      q("Which Harappan site is known for bead-making?", ["Chanhudaro", "Harappa", "Ropar", "Banawali"], 0),
      q("Archaeobotanists study ancient:", ["Metal tools", "Plant remains", "Stone sculptures", "Burial urns"], 1),
      q("The Harappan system of weights followed mainly a:", ["Decimal system", "Binary system", "Roman system", "Sexagesimal system"], 1),
      q("Most Harappan seals were usually:", ["Round", "Triangular", "Square", "Oval"], 2),
      q("Harappan houses were commonly built around a:", ["Temple tower", "Central courtyard", "Public theatre", "Open battlefield"], 1),
      q("The citadel in Harappan cities was usually built on a:", ["River island", "Raised platform", "Natural cave", "Dense forest"], 1),
      q("A striking feature of Harappan construction was the use of:", ["Mud huts only", "Baked bricks", "Marble blocks", "Wooden towers"], 1),
      q("Our knowledge of the Harappan civilisation comes mainly from:", ["Epic poetry", "Archaeological evidence", "Temple chronicles", "Folk songs alone"], 1),
      q("Faience in the Harappan context was a:", ["Natural gem", "Glazed artificial substance", "Type of grain", "Bronze weapon"], 1),
      q("Important cereals consumed by the Harappans included:", ["Wheat and barley", "Tea and coffee", "Maize and potato", "Rubber and jute"], 0),
      q("Harappan trade links extended to:", ["Japan", "Mesopotamia", "South America", "Australia"], 1),
      q("Harappan burials often contained:", ["Only iron swords", "Pottery and ornaments", "Printed manuscripts", "Stone idols only"], 1),
    ],
  },
  {
    subject: "History 1",
    chapter: "Kings, Farmers and Towns",
    questions: [
      q("According to Buddhist and Jaina texts, the number of mahajanapadas was:", ["8", "12", "16", "24"], 2),
      q("The most powerful mahajanapada in early historic India was:", ["Avanti", "Magadha", "Kamboja", "Kuru"], 1),
      q("Most of Ashoka's inscriptions were written in:", ["Greek", "Prakrit", "Tamil", "Persian"], 1),
      q("The Brahmi script was deciphered by:", ["Alexander Cunningham", "James Prinsep", "John Marshall", "Mortimer Wheeler"], 1),
      q("Ashoka is best known for spreading the idea of:", ["Dhamma", "Divine right", "Feudalism", "Mercantilism"], 0),
      q("The tax paid by cultivators, often stated as one-sixth of the produce, was called:", ["Bhaga", "Begar", "Jizya", "Taccavi"], 0),
      q("Early coins used in the subcontinent were often:", ["Gold dinars", "Punch-marked coins", "Paper currency", "Plastic tokens"], 1),
      q("The term gahapati referred to a:", ["Forest hunter", "Wealthy householder", "Buddhist monk", "Royal spy"], 1),
      q("Setthis were generally:", ["Merchants and bankers", "Potters", "Village guards", "Temple dancers"], 0),
      q("An inscription is a writing engraved on:", ["Palm leaves", "Hard surfaces", "Cloth", "Leather"], 1),
    ],
  },
  {
    subject: "History 1",
    chapter: "Kinship, Caste and Class",
    questions: [
      q("The Mahabharata was composed primarily in:", ["Prakrit", "Pali", "Sanskrit", "Persian"], 2),
      q("The critical edition of the Mahabharata was prepared at:", ["Nalanda", "BORI, Pune", "Taxila", "Sanchi"], 1),
      q("Patriliny means tracing descent through the:", ["Mother", "Teacher", "Father", "Sister"], 2),
      q("The rule of exogamy required a person to marry:", ["Within the same gotra", "Outside the gotra", "Only within the village", "Only within the varna"], 1),
      q("Virilocal practice means that after marriage the bride generally goes to the:", ["Maternal uncle's home", "Husband's household", "Royal court", "Monastery"], 1),
      q("Draupadi in the Mahabharata was married to:", ["Arjuna alone", "Five Pandava brothers", "Duryodhana", "Karna"], 1),
      q("The Manusmriti is traditionally attributed to:", ["Panini", "Valmiki", "Manu", "Patanjali"], 2),
      q("The varna scheme in Brahmanical texts divided society into:", ["2 groups", "3 groups", "4 groups", "5 groups"], 2),
      q("Ekalavya in the Mahabharata is associated with the:", ["Nishadas", "Shakas", "Yavanas", "Kushanas"], 0),
      q("Satavahana queens are notable because some of them used:", ["Greek titles", "Their father's gotra name", "Roman coins as names", "Tribal totems as names"], 1),
    ],
  },
  {
    subject: "History 1",
    chapter: "Thinkers, Beliefs and Buildings",
    questions: [
      q("Siddhartha Gautama was born at:", ["Sarnath", "Kushinagara", "Lumbini", "Rajagriha"], 2),
      q("Mahavira is regarded in Jain tradition as the:", ["First Tirthankara", "Tenth Tirthankara", "Twenty-fourth Tirthankara", "Last Mauryan ruler"], 2),
      q("The teachings of the Buddha were preserved in the:", ["Vedas", "Tripitaka", "Ramayana", "Arthashastra"], 1),
      q("The Buddha delivered his first sermon at:", ["Sarnath", "Vaishali", "Pataliputra", "Shravasti"], 0),
      q("The Buddha attained enlightenment at:", ["Kapilavastu", "Bodh Gaya", "Lumbini", "Mathura"], 1),
      q("A stupa was mainly built to house:", ["Royal courts", "Relics", "Trade guilds", "Military barracks"], 1),
      q("Walking clockwise around a stupa is called:", ["Pradakshina", "Yajna", "Abhisheka", "Tapasya"], 0),
      q("Sanchi is famous for its:", ["Rock-cut palace", "Buddhist stupa", "Iron pillar", "Observatory"], 1),
      q("A torana in Buddhist architecture is a:", ["Water tank", "Gateway", "Prayer bell", "Brick kiln"], 1),
      q("A chaitya was primarily a:", ["Prayer hall", "Market place", "Royal archive", "Granary"], 0),
      q("The sangha in Buddhism refers to the community of:", ["Farmers", "Monks and nuns", "Kings", "Merchants"], 1),
      q("The central ethical principle of Jainism is:", ["Conquest by war", "Ahimsa", "Animal sacrifice", "Royal authority"], 1),
      q("The Upanishads discuss ideas related to:", ["Atman and Brahman", "Gunpowder warfare", "Feudal rent", "Oceanic trade only"], 0),
      q("The term bhakti means:", ["Tax payment", "Devotion", "Conquest", "Trade"], 1),
      q("Among ancient Indian rulers, Ashoka is especially associated with support for:", ["Buddhism", "Roman law", "Christianity", "Zoroastrianism"], 0),
      q("Mahayana Buddhism gave great importance to:", ["Image worship of the Buddha", "Vedic sacrifice only", "Animal sacrifice", "Sea trade"], 0),
      q("The garbhagriha in a temple is the:", ["Audience hall", "Sanctum", "Kitchen", "Outer wall"], 1),
      q("Amaravati became famous for its:", ["Stupa sculptures", "Copper mines", "Military camps", "Roman theatre"], 0),
      q("Yakshi figures in early Indian art are often linked with:", ["Fertility and abundance", "Naval warfare", "Tax collection", "Script decipherment"], 0),
      q("The Buddha recommended a path between luxury and severe austerity known as the:", ["Silk Route", "Middle Path", "Royal Road", "War Path"], 1),
    ],
  },
  {
    subject: "History 2",
    chapter: "Through the Eyes of Travellers",
    questions: [
      q("Al-Biruni came to India from:", ["China", "Khwarizm in Central Asia", "Arabia", "Sri Lanka"], 1),
      q("The famous work written by Al-Biruni on India is:", ["Akbarnama", "Kitab-ul-Hind", "Baburnama", "Ain-i Akbari"], 1),
      q("Al-Biruni learned which language to understand Indian texts better?", ["Greek", "Latin", "Sanskrit", "French"], 2),
      q("Ibn Battuta was a traveller from:", ["Morocco", "Turkey", "Persia", "Russia"], 0),
      q("Ibn Battuta was appointed as qazi in Delhi by:", ["Alauddin Khalji", "Muhammad bin Tughlaq", "Babur", "Sher Shah"], 1),
      q("The travel account of Ibn Battuta is known as the:", ["Rihla", "Rajatarangini", "Shahnama", "Prashasti"], 0),
      q("Francois Bernier came from:", ["Portugal", "Italy", "France", "Holland"], 2),
      q("Bernier visited India during the reign of:", ["Ashoka", "Aurangzeb", "Kanishka", "Bindusara"], 1),
      q("Ibn Battuta was impressed by the efficiency of the Delhi Sultanate:", ["Postal system", "Coin mint only", "Sea navy", "Temple network"], 0),
      q("Traveller accounts are valuable because they often record:", ["Only myths", "Everyday practices noticed by outsiders", "Only royal genealogies", "Only battles"], 1),
    ],
  },
  {
    subject: "History 2",
    chapter: "Bhakti-Sufi Traditions",
    questions: [
      q("A khanqah was a:", ["Sufi hospice", "Royal palace", "Military fort", "Port warehouse"], 0),
      q("The Chishti order is closely associated with:", ["Nizamuddin Auliya", "Ziauddin Barani", "Al-Biruni", "Abul Fazl"], 0),
      q("Kabir is remembered mainly for:", ["Criticising empty ritualism", "Building temples", "Serving as a Mughal noble", "Writing the Arthashastra"], 0),
      q("Mirabai is best known as a devotee of:", ["Shiva", "Krishna", "Buddha", "Allah"], 1),
      q("Guru Nanak is regarded as the founder of:", ["Jainism", "Sikhism", "Buddhism", "Sufism"], 1),
      q("The langar in Sikh tradition refers to the:", ["Sacred river", "Community kitchen", "Royal tax", "Temple tower"], 1),
      q("The Adi Granth was compiled by:", ["Guru Gobind Singh", "Guru Arjan", "Guru Tegh Bahadur", "Guru Angad"], 1),
      q("A dargah is the:", ["Royal hall", "Tomb-shrine of a Sufi saint", "Village market", "Tax office"], 1),
      q("Sufis generally emphasised:", ["Love and devotion to God", "Territorial conquest", "Animal sacrifice", "Merchant monopoly"], 0),
      q("The bhakti movement stressed:", ["Strict ritual hierarchy", "Personal devotion to a chosen deity", "Imperial expansion", "Military discipline"], 1),
    ],
  },
  {
    subject: "History 2",
    chapter: "An Imperial Capital: Vijayanagara",
    questions: [
      q("The Vijayanagara Empire was founded by:", ["Harihara and Bukka", "Babur and Humayun", "Alauddin and Malik Kafur", "Shivaji and Sambhaji"], 0),
      q("The capital of Vijayanagara was located on the banks of the:", ["Godavari", "Krishna", "Tungabhadra", "Kaveri"], 2),
      q("The most famous ruler of Vijayanagara was:", ["Krishnadeva Raya", "Ibrahim Adil Shah", "Balban", "Rajaraja I"], 0),
      q("The Mahanavami Dibba was used as a:", ["Ceremonial platform", "Dockyard", "Mint house", "Observatory"], 0),
      q("The Hazara Rama temple is famous for panels depicting:", ["The Mahabharata", "The Ramayana", "The Vedas", "The Puranas only"], 1),
      q("The military-administrative system of Vijayanagara is called the:", ["Mansabdari system", "Amara-Nayaka system", "Iqta system", "Ryotwari system"], 1),
      q("Which Portuguese traveller described Vijayanagara?", ["Domingo Paes", "Marco Polo", "Megasthenes", "Nicolo Manucci"], 0),
      q("Vijayanagara was frequently in conflict with the:", ["Deccan Sultanates", "Mauryas", "Guptas", "Satavahanas"], 0),
      q("The city of Vijayanagara was badly devastated after the Battle of:", ["Plassey", "Panipat", "Talikota", "Buxar"], 2),
      q("The famous ruins of Vijayanagara are located at present-day:", ["Hampi", "Ajmer", "Sanchi", "Patna"], 0),
    ],
  },
  {
    subject: "History 2",
    chapter: "Peasants, Zamindars and the State",
    questions: [
      q("The Ain-i Akbari was written by:", ["Badauni", "Abul Fazl", "Bernier", "Amir Khusrau"], 1),
      q("In Mughal revenue terminology, jama meant the:", ["Assessed revenue", "Royal marriage", "Village well", "Temple gift"], 0),
      q("The zabt system was based on the measurement of:", ["Ships", "Land and produce", "Temple towers", "Roads"], 1),
      q("Zamindars in Mughal India were mainly associated with:", ["Collecting revenue and exercising local power", "Printing books", "Running ports only", "Minting coins only"], 0),
      q("Khud-kashta referred to:", ["Resident cultivators", "Royal guards", "Monks", "Merchants"], 0),
      q("Pahi-kashta referred to:", ["Nomadic herders", "Non-resident cultivators", "Buddhist monks", "Tribal chiefs"], 1),
      q("The village headman in many Mughal records was called:", ["Muqaddam", "Qazi", "Seth", "Pandit"], 0),
      q("The main source of Mughal state income was:", ["Sea customs", "Land revenue", "Temple taxes", "Mine royalties only"], 1),
      q("A common Mughal revenue demand was roughly:", ["One-tenth of produce", "One-third of produce", "Half of produce", "No fixed share at all"], 1),
      q("Loans given to peasants to expand cultivation were often called:", ["Taccavi", "Khiraj", "Jizya", "Jagir"], 0),
      q("Among the important cash crops of Mughal India were:", ["Cotton and sugarcane", "Tea and coffee", "Rubber and tobacco only", "Potato and maize only"], 0),
      q("The Ain-i Akbari provides information on:", ["Only wars", "Prices, crops, and revenues", "Only temple rituals", "Only pilgrimages"], 1),
      q("One important device used for irrigation in Mughal India was the:", ["Steam engine", "Persian wheel", "Railway pump", "Electric motor"], 1),
      q("Many zamindars maintained:", ["Armed retainers", "Printing presses", "Naval dockyards", "Universities"], 0),
      q("Mughal peasants produced not only for subsistence but also for:", ["Sports festivals", "The market", "Only temple use", "Only royal kitchens"], 1),
      q("Rural communities in Mughal India were also shaped by:", ["Jati ties", "Modern political parties", "Factory unions", "Railway boards"], 0),
      q("The Ain-i Akbari forms a part of the:", ["Baburnama", "Akbarnama", "Padshahnama", "Rihla"], 1),
      q("Abul Fazl served as a close courtier of:", ["Aurangzeb", "Akbar", "Jahangir", "Sher Shah"], 1),
      q("Mughal records are an important source for reconstructing:", ["Only temple legends", "Agrarian history", "Only sea battles", "Only tribal songs"], 1),
      q("Expansion of the Mughal Empire was closely linked with:", ["Decline of cultivation", "Agrarian growth", "End of trade", "Disappearance of villages"], 1),
    ],
  },
  {
    subject: "History 2",
    chapter: "Kings and Chronicles",
    questions: [
      q("The Mughal dynasty in India was founded by:", ["Humayun", "Babur", "Akbar", "Sher Shah"], 1),
      q("The First Battle of Panipat was fought in:", ["1192", "1526", "1556", "1761"], 1),
      q("Babur claimed descent from:", ["Ashoka", "Timur", "Harsha", "Ranjit Singh"], 1),
      q("The Akbarnama was written by:", ["Abul Fazl", "Badauni", "Bernier", "Nizamuddin Ahmad"], 0),
      q("The Badshahnama is mainly associated with the reign of:", ["Babur", "Akbar", "Shah Jahan", "Bahadur Shah Zafar"], 2),
      q("Akbar's policy of universal peace was called:", ["Din-i Ilahi", "Sulh-i kul", "Zabt", "Jharokha"], 1),
      q("A mansab under the Mughals indicated a noble's:", ["Rank", "Village of birth", "Religion", "Language"], 0),
      q("Jharokha darshan referred to the emperor:", ["Reading scriptures in private", "Showing himself to the public", "Leading cavalry charges", "Collecting land tax personally"], 1),
      q("Most Mughal court chronicles were written in:", ["Sanskrit", "Persian", "Tamil", "Greek"], 1),
      q("Miniature paintings in Mughal India were produced in:", ["Imperial ateliers", "Village schools only", "Temples only", "Ports only"], 0),
      q("Jahangir is associated with the famous:", ["Chain of Justice", "Indigo Commission", "Doctrine of Lapse", "Permanent Settlement"], 0),
      q("A farman was a:", ["Royal order", "Revenue survey", "Temple inscription", "Village fair"], 0),
      q("The title padshah means:", ["Village headman", "Emperor", "Merchant leader", "High priest"], 1),
      q("Court chronicles often presented an:", ["Idealised image of kingship", "Account of village games", "Ordinary market diary", "Manual of agriculture only"], 0),
      q("Mughal rulers used genealogy mainly to:", ["Calculate taxes", "Legitimise their authority", "Train soldiers", "Build reservoirs"], 1),
      q("Babur's own memoir is known as the:", ["Baburnama", "Humayunnama", "Padshahnama", "Tuzuk-i Jahangiri"], 0),
      q("Abul Fazl was one of the closest advisers of:", ["Babur", "Akbar", "Shah Jahan", "Aurangzeb"], 1),
      q("In Mughal manuscripts, text was often combined with:", ["Maps of Europe", "Illustrations and paintings", "Only coin rubbings", "Blank folios"], 1),
      q("The Mughals strongly emphasised their link with the:", ["Timurid line", "Pallavas", "Cholas", "Satavahanas"], 0),
      q("The Red Fort in Shahjahanabad was built by:", ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"], 2),
    ],
  },
  {
    subject: "History 3",
    chapter: "Colonialism and the Countryside",
    questions: [
      q("The Permanent Settlement was introduced in Bengal in:", ["1757", "1793", "1813", "1857"], 1),
      q("Under the Permanent Settlement, the revenue demand on zamindars was:", ["Revised weekly", "Fixed permanently", "Collected only in grain", "Completely abolished"], 1),
      q("The Ryotwari system is closely associated with:", ["Thomas Munro", "Lord Wellesley", "James Prinsep", "Macaulay"], 0),
      q("The Mahalwari system was based on revenue assessment of:", ["Single temples", "Village estates or mahals", "Ports only", "Railway lines"], 1),
      q("The Paharias lived in the:", ["Rajmahal hills", "Nilgiri hills", "Vindhyas", "Aravallis"], 0),
      q("The Santhals were settled by the British in:", ["Damin-i-Koh", "Awadh", "Malabar", "Sindh"], 0),
      q("The Indigo Revolt took place mainly in:", ["Punjab", "Bengal", "Assam", "Kashmir"], 1),
      q("The Deccan Riots occurred in:", ["1820", "1857", "1875", "1905"], 2),
      q("Moneylenders in the Deccan were commonly called:", ["Sahukars", "Mansabdars", "Qazis", "Muqaddams"], 0),
      q("The Fifth Report was submitted to the British Parliament in:", ["1773", "1793", "1813", "1885"], 2),
      q("The auction of Burdwan estates revealed that many sales were:", ["Paid in salt", "Fictitious", "Conducted by peasants", "Done by French traders"], 1),
      q("The term ryot simply means a:", ["Soldier", "Cultivator", "Priest", "Carpenter"], 1),
      q("Indigo planters were notorious for:", ["Encouraging free choice", "Forcing peasants to grow indigo", "Building schools everywhere", "Ending all taxes"], 1),
      q("After the Indigo Revolt, the government appointed the:", ["Boundary Commission", "Indigo Commission", "Simon Commission", "University Commission"], 1),
      q("Colonial surveys tried to understand the countryside mainly through:", ["Measurement and classification", "Oral epics only", "Temple carvings", "Coin legends only"], 0),
      q("One goal of the Permanent Settlement was to create a class of:", ["Nomadic herders", "Loyal landed proprietors", "Monastic teachers", "Sea captains"], 1),
      q("Rich peasants in Bengal who often controlled land and credit were known as:", ["Jotedars", "Bhadralok only", "Sepoys", "Peshwas"], 0),
      q("During the Deccan Riots, peasants often attacked the moneylenders':", ["Horse stables", "Account books", "Temples", "Ports"], 1),
      q("Colonial rule encouraged the expansion of:", ["Cash crop cultivation", "Only hunting", "Only cattle fairs", "Nomadism alone"], 0),
      q("Colonial revenue laws deeply changed:", ["Rural social relations", "Only temple rituals", "Only military uniforms", "Only sea routes"], 0),
    ],
  },
  {
    subject: "History 3",
    chapter: "Rebels and the Raj",
    questions: [
      q("The uprising of 1857 began at:", ["Meerut", "Kanpur", "Lucknow", "Delhi"], 0),
      q("Mangal Pandey is associated with:", ["Barrackpore", "Jhansi", "Lucknow", "Agra"], 0),
      q("The symbolic leader of the Revolt of 1857 was:", ["Nana Sahib", "Bahadur Shah Zafar", "Kunwar Singh", "Tatya Tope"], 1),
      q("The immediate military grievance of the sepoys was linked to the:", ["Salt tax", "Enfield rifle cartridges", "Subsidiary alliance", "Forest laws"], 1),
      q("The annexation of Awadh took place in:", ["1848", "1856", "1858", "1875"], 1),
      q("Rani Lakshmibai was the queen of:", ["Awadh", "Jhansi", "Satara", "Nagpur"], 1),
      q("Kunwar Singh was a leading rebel from:", ["Bihar", "Punjab", "Sindh", "Assam"], 0),
      q("Sepoys were:", ["Indian soldiers in Company service", "British judges", "Zamindars", "Temple priests"], 0),
      q("The Doctrine of Lapse is particularly associated with:", ["Lord Dalhousie", "Lord Ripon", "Lord Curzon", "Lord Mountbatten"], 0),
      q("After the Revolt of 1857, power in India passed to the:", ["French Crown", "British Crown", "Portuguese king", "Mughal emperor"], 1),
    ],
  },
  {
    subject: "History 3",
    chapter: "Colonial Cities",
    questions: [
      q("The three presidency cities were:", ["Delhi, Agra, Lahore", "Bombay, Calcutta, Madras", "Patna, Surat, Pune", "Kanpur, Lucknow, Nagpur"], 1),
      q("In many colonial port cities, White Town was mainly inhabited by:", ["European officials and merchants", "Industrial workers", "Tribal communities", "Peasant migrants only"], 0),
      q("Black Town usually referred to the area where:", ["European soldiers lived", "Indian merchants and artisans lived", "Only governors lived", "Only judges lived"], 1),
      q("Bombay grew rapidly in the colonial period mainly because of its:", ["Tea gardens", "Cotton textile industry and port", "Coal mines only", "Temple network"], 1),
      q("Workers in Bombay often lived in crowded housing known as:", ["Havelis", "Chawls", "Mathas", "Khanqahs"], 1),
      q("Civil lines were neighbourhoods generally occupied by:", ["British officials", "Dock workers", "Monks", "Village headmen"], 0),
      q("Cantonments were set up as:", ["Religious centres", "Military stations", "Textile mills", "University towns"], 1),
      q("The word bungalow is derived from:", ["Bangla", "Burj", "Brahma", "Bazaar"], 0),
      q("The Lottery Committee in Calcutta was formed for:", ["Temple renovation", "Town planning and improvement", "Railway expansion only", "Coin minting"], 1),
      q("One important instrument used by colonial administrators to classify urban populations was the:", ["Census", "Epic", "Temple inscription", "Coin hoard"], 0),
    ],
  },
  {
    subject: "History 3",
    chapter: "Mahatma Gandhi and the Nationalist Movement",
    questions: [
      q("Mahatma Gandhi returned to India from South Africa in:", ["1905", "1915", "1920", "1930"], 1),
      q("Gandhi's first major satyagraha in India was in:", ["Champaran", "Dandi", "Bombay", "Lahore"], 0),
      q("The peasants of Kheda in Gujarat struggled mainly over:", ["Forest rights", "Revenue demand", "Temple entry", "Railway fares"], 1),
      q("The Ahmedabad movement of 1918 involved:", ["Tea plantation workers", "Mill workers", "Sepoys", "Dock labour only"], 1),
      q("The Non-Cooperation Movement was launched in:", ["1917", "1920", "1927", "1935"], 1),
      q("The Salt March ended at:", ["Sabarmati", "Dandi", "Champaran", "Nagpur"], 1),
      q("The Civil Disobedience Movement began with the breaking of the:", ["Forest law", "Salt law", "Press law", "Arms Act"], 1),
      q("Gandhi attended the ____ Round Table Conference in London.", ["First", "Second", "Third", "Fourth"], 1),
      q("The Quit India Movement was launched in:", ["1930", "1935", "1942", "1946"], 2),
      q("Satyagraha means:", ["Violent uprising", "Truth-force or non-violent resistance", "Secret diplomacy", "Armed training"], 1),
    ],
  },
  {
    subject: "History 3",
    chapter: "Understanding Partition",
    questions: [
      q("The Lahore Resolution was passed in:", ["1930", "1940", "1942", "1947"], 1),
      q("Direct Action Day was observed in:", ["1942", "1945", "1946", "1948"], 2),
      q("The plan announcing the partition of British India was presented on:", ["3 June 1947", "15 August 1947", "26 January 1950", "16 August 1946"], 0),
      q("The boundary commission for partition was headed by:", ["Linlithgow", "Cyril Radcliffe", "Wavell", "Cripps"], 1),
      q("The two provinces that were partitioned most dramatically were:", ["Punjab and Bengal", "Madras and Bombay", "Assam and Orissa", "Sindh and Mysore"], 0),
      q("During communal violence, Gandhi spent time trying to restore peace in:", ["Noakhali", "Simla", "Poona", "Baroda"], 0),
      q("Partition led to one of the largest movements of:", ["Traders across oceans", "Refugees across borders", "Pilgrims to shrines", "Students to universities"], 1),
      q("One tragic feature of Partition violence was the large-scale:", ["Spread of railways", "Abduction of women", "Discovery of scripts", "Issue of gold coins"], 1),
      q("The Partition of British India took place in:", ["1935", "1940", "1947", "1952"], 2),
      q("The demand for Pakistan was strongly championed by the:", ["Congress Socialist Party", "All-India Muslim League", "Hindu Mahasabha only", "Justice Party"], 1),
    ],
  },
  {
    subject: "History 3",
    chapter: "Framing the Constitution",
    questions: [
      q("The Constituent Assembly of India first met in:", ["December 1946", "August 1947", "January 1950", "November 1949"], 0),
      q("The Drafting Committee of the Constitution was chaired by:", ["Jawaharlal Nehru", "Sardar Patel", "B.R. Ambedkar", "Rajendra Prasad"], 2),
      q("The Objectives Resolution in the Constituent Assembly was moved by:", ["B.R. Ambedkar", "Jawaharlal Nehru", "Maulana Azad", "Rajagopalachari"], 1),
      q("The Constitution of India was adopted on:", ["15 August 1947", "26 November 1949", "26 January 1950", "9 December 1946"], 1),
      q("The Constitution came into effect on:", ["26 January 1950", "15 August 1947", "26 November 1949", "2 October 1951"], 0),
      q("The Constitution granted the principle of:", ["Restricted franchise", "Universal adult franchise", "Separate franchise by property", "Voting for men only"], 1),
      q("The Preamble begins with the words:", ["In the name of the king", "We, the people of India", "Liberty or death", "Union under empire"], 1),
      q("The Indian Constitution established:", ["A unitary monarchy", "A federal system with a strong centre", "A military state", "A theocratic state"], 1),
      q("Fundamental Rights aim to protect:", ["Equality and freedom", "Only trade monopolies", "Only landowners", "Only officials"], 0),
      q("Directive Principles of State Policy are intended to:", ["Guide government policy", "Replace elections", "Abolish courts", "End legislatures"], 0),
    ],
  },
];

function buildQuestions() {
  const docs = [];

  for (const bank of chapterBanks) {
    bank.questions.forEach((item, index) => {
      docs.push({
        board: BOARD,
        class: CLASS_NAME,
        medium: MEDIUM,
        subject: bank.subject,
        chapter: bank.chapter,
        level: Math.floor(index / 10) + 1,
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
      });
    });
  }

  return docs;
}

function validateQuestions(questions) {
  if (questions.length !== 200) {
    throw new Error(`Expected 200 questions, found ${questions.length}`);
  }

  for (const item of questions) {
    if (!item.question || !Array.isArray(item.options) || item.options.length !== 4) {
      throw new Error(`Invalid question payload: ${JSON.stringify(item)}`);
    }
    if (!Number.isInteger(item.correctIndex) || item.correctIndex < 0 || item.correctIndex > 3) {
      throw new Error(`Invalid correctIndex for question: ${item.question}`);
    }
  }

  const subjectTotals = questions.reduce((acc, item) => {
    acc[item.subject] = (acc[item.subject] || 0) + 1;
    return acc;
  }, {});

  if (subjectTotals["History 1"] !== 60 || subjectTotals["History 2"] !== 70 || subjectTotals["History 3"] !== 70) {
    throw new Error(`Unexpected subject totals: ${JSON.stringify(subjectTotals)}`);
  }
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  const questions = buildQuestions();
  validateQuestions(questions);

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    await Question.deleteMany({
      board: BOARD,
      class: CLASS_NAME,
      medium: MEDIUM,
      subject: { $in: ["History 1", "History 2", "History 3"] },
    });

    await Question.insertMany(questions, { ordered: true });

    const subjectTotals = questions.reduce((acc, item) => {
      acc[item.subject] = (acc[item.subject] || 0) + 1;
      return acc;
    }, {});
    const chapterTotals = questions.reduce((acc, item) => {
      const key = `${item.subject} -> ${item.chapter}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    console.log("Seeded History Plus Two questions successfully.");
    console.log("Subject totals:", subjectTotals);
    console.log("Chapter totals:", chapterTotals);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to seed History Plus Two questions:", error);
  process.exit(1);
});
