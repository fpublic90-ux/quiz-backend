require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const BASE_QUESTION = {
  board: 'Kerala State',
  class: '+2',
  medium: 'English',
  subject: 'Geology',
  level: 1,
};

function buildChapter(chapter, rows) {
  return rows.map(([question, correct, ...wrongOptions]) => ({
    ...BASE_QUESTION,
    chapter,
    question,
    options: [correct, ...wrongOptions],
    correctIndex: 0,
  }));
}

const worldOfRocks = buildChapter('The World of Rocks', [
  ['A rock is best defined as a naturally occurring solid aggregate of:', 'One or more minerals or mineral-like materials', 'Only metallic ores', 'Only fossils', 'Only organic remains'],
  ['The study of rocks is called:', 'Petrology', 'Palaeontology', 'Stratigraphy', 'Seismology'],
  ['Rocks are broadly classified into how many major groups?', 'Three', 'Two', 'Four', 'Five'],
  ['Igneous rocks are formed by:', 'Cooling and solidification of magma', 'Deposition of sediments', 'Weathering alone', 'Fossilization'],
  ['Sedimentary rocks are mainly formed from:', 'Deposits accumulated at the earth surface', 'Direct cooling of lava only', 'Planetary impacts only', 'Magnetic fields'],
  ['Metamorphic rocks are formed by:', 'Alteration of pre-existing rocks', 'Evaporation of seawater only', 'Only volcanic eruption', 'Only fossil compaction'],
  ['Molten material generated inside the earth is called:', 'Magma', 'Lava', 'Loess', 'Peat'],
  ['Magma that reaches the earth surface is known as:', 'Lava', 'Basalt', 'Coal', 'Quartz'],
  ['Minerals in igneous rocks are formed by:', 'Crystallization during cooling', 'Evaporation from air', 'Only biological activity', 'Oxidation of fossils'],
  ['Igneous rocks are divided into volcanic, hypabyssal and:', 'Plutonic rocks', 'Clastic rocks', 'Residual rocks', 'Organic rocks'],
  ['Igneous rocks that cool at the earth surface are called:', 'Volcanic or extrusive rocks', 'Plutonic rocks', 'Metamorphic rocks', 'Residual deposits'],
  ['Igneous rocks formed deep inside the crust are called:', 'Plutonic or intrusive rocks', 'Volcanic rocks', 'Sedimentary rocks', 'Residual rocks'],
  ['Hypabyssal rocks form at depths that are:', 'Intermediate between plutonic and volcanic rocks', 'Always deeper than plutonic rocks', 'Always at the surface', 'Only in the ocean'],
  ['A body of intrusive igneous rock crystallized from magma below the surface is called a:', 'Pluton', 'Delta', 'Fossil bed', 'Coal seam'],
  ['A pluton that is characteristically tabular in shape and discordant is a:', 'Dyke', 'Sill', 'Batholith', 'Laccolith'],
  ['A sheet-like intrusive body emplaced parallel to bedding is called a:', 'Sill', 'Dyke', 'Stock', 'Plug'],
  ['A very large discordant intrusive body is generally called a:', 'Batholith', 'Sill', 'Joint', 'Fold'],
  ['Rocks that show visible crystals due to slow cooling are usually:', 'Intrusive igneous rocks', 'Extrusive volcanic glass only', 'Residual soils', 'Organic sediments'],
  ['Fine-grained texture is commonly associated with:', 'Rapid cooling at or near the surface', 'Slow cooling at great depth', 'Metamorphic foliation only', 'Chemical weathering'],
  ['Sedimentary rocks often occur in:', 'Layers or strata', 'Only cylindrical bodies', 'Only veins', 'Only domes'],
  ['Rocks formed from fragments of pre-existing rocks are called:', 'Clastic sedimentary rocks', 'Metamorphic aureoles', 'Volcanic plugs', 'Pegmatites'],
  ['Limestone is a common example of a:', 'Sedimentary rock', 'Igneous rock', 'Metamorphic mineral', 'Volcanic glass'],
  ['Marble is formed by metamorphism of:', 'Limestone', 'Granite', 'Basalt', 'Shale only'],
  ['Quartzite is typically formed from:', 'Sandstone', 'Limestone', 'Coal', 'Conglomerate'],
  ['Slate is a metamorphic product commonly derived from:', 'Shale', 'Granite', 'Sandstone', 'Basalt'],
  ['Granite is an example of a:', 'Plutonic igneous rock', 'Chemical sedimentary rock', 'Organic sedimentary rock', 'Residual deposit'],
  ['Basalt is most commonly an:', 'Extrusive igneous rock', 'Plutonic igneous rock', 'Metamorphic foliation', 'Sedimentary ore'],
  ['The term fire-formed is associated with:', 'Igneous rocks', 'Sedimentary rocks', 'Residual soils', 'Coal seams'],
  ['The earth science branch that helps understand major portions of the earths geosystems through rocks is:', 'Igneous petrology', 'Pollen analysis', 'Biogeography', 'Genetics'],
  ['The three major rock groups together make up the basis of the:', 'Rock cycle', 'Hydrologic cycle', 'Nitrogen cycle', 'Cell cycle'],
]);

const economicMineralDeposits = buildChapter('Economic Mineral Deposits', [
  ['Economic geology is the branch of geology concerned with earth materials that can be used for:', 'Economic or industrial purposes', 'Only decoration', 'Only tourism', 'Only space exploration'],
  ['An ore is a body of material from which valuable metals can be extracted:', 'Economically', 'Only experimentally', 'Only biologically', 'Only magnetically'],
  ['Bauxite is an important ore of:', 'Aluminium', 'Iron', 'Copper', 'Zinc'],
  ['Hematite and magnetite are chief ores of:', 'Iron', 'Aluminium', 'Lead', 'Manganese'],
  ['Worthless non-metallic minerals associated with ore minerals are called:', 'Gangue minerals', 'Fuel minerals', 'Alloys', 'Magma'],
  ['Quartz, feldspar and calcite commonly occur as:', 'Gangue minerals', 'Precious ores', 'Radioactive metals', 'Index fossils'],
  ['An ore that yields a single metal is called a:', 'Simple ore', 'Complex ore', 'Residual ore', 'Detrital ore'],
  ['An ore that yields several metals is called a:', 'Complex ore', 'Simple ore', 'Fuel ore', 'Silicate ore'],
  ['The concentration of metal content in a mineable ore deposit is called its:', 'Grade of ore', 'Strike', 'Dip', 'Calorific value'],
  ['Deposits formed at the same time as the enclosing rock are called:', 'Syngenetic deposits', 'Epigenetic deposits', 'Residual deposits', 'Secondary deposits'],
  ['Deposits formed after the enclosing rock are called:', 'Epigenetic deposits', 'Syngenetic deposits', 'Primary sediments', 'Plutonic bodies'],
  ['Hydrothermal deposits are generally examples of:', 'Epigenetic deposits', 'Syngenetic deposits', 'Biogenic reefs', 'Evaporites only'],
  ['Processes of formation of mineral deposits include magmatic, hydrothermal, sedimentary, residual, metamorphic and:', 'Contact metasomatic deposits', 'Glacial deposits only', 'Aeolian dunes only', 'Coral deposits only'],
  ['Magmatic deposits are formed by:', 'Cooling and crystallization of magma', 'Only river transport', 'Wind deposition only', 'Biological decay'],
  ['Local concentration of minerals at the bottom or sides of a magma body during cooling is called:', 'Magmatic segregation', 'Magmatic assimilation', 'Residual weathering', 'Biogenic accumulation'],
  ['Chromite deposits in ultramafic rocks are an example of:', 'Magmatic segregation', 'Hydrothermal replacement', 'Residual concentration', 'Coalification'],
  ['When minerals occur as small scattered particles through the host rock, it is called:', 'Magmatic dissemination', 'Stratification', 'Crustal folding', 'Regional metamorphism'],
  ['Diamond in kimberlite is cited as an example of:', 'Magmatic dissemination', 'Residual deposit', 'Banded iron formation', 'Placers only'],
  ['In the last stage of magmatic crystallization, the residue is commonly rich in silica, water and:', 'Rare elements', 'Coal', 'Organic matter', 'Fossils'],
  ['Pegmatite deposits are commonly associated with the:', 'Late magmatic stage', 'Earliest sedimentary stage', 'Mechanical weathering stage', 'Marine transgression only'],
  ['Mineral-bearing hot solutions moving through fractures produce:', 'Hydrothermal deposits', 'Glacial tills', 'Aeolian sands', 'Peat bogs'],
  ['Mineral deposits formed by precipitation from water on the earth surface are generally:', 'Sedimentary deposits', 'Plutonic intrusions', 'Contact aureoles', 'Volcanic bombs'],
  ['Bauxite commonly forms as a:', 'Residual deposit', 'Volcanic glass', 'Marine carbonate', 'Coal seam'],
  ['Contact metasomatic deposits commonly develop at the contact between:', 'Igneous intrusions and surrounding rocks', 'Two rivers', 'Glaciers and desert dunes', 'Coal and peat only'],
  ['An example mentioned for complex ore is the lead-zinc deposit of:', 'Zawar, Rajasthan', 'Panna, Madhya Pradesh', 'Jharia, Jharkhand', 'Singrauli, Madhya Pradesh'],
  ['The higher the concentration of metal in an ore, the:', 'Higher the grade', 'Lower the grade', 'More the gangue only', 'Lower the value always'],
  ['Economic geology is primarily linked with the search for materials useful to:', 'Industry and society', 'Only museums', 'Only planetary science', 'Only climatology'],
  ['Ore is usually a mixture of ore minerals and:', 'Gangue minerals', 'Only fossils', 'Only hydrocarbons', 'Only magma'],
  ['A deposit formed by solutions associated with cooling magma is often termed:', 'Hydrothermal', 'Residual', 'Biogenic', 'Glacial'],
  ['The genesis-based classification of ore deposits depends mainly on their:', 'Mode of formation', 'Colour only', 'Market price only', 'Crystal habit only'],
]);

const fossilFuels = buildChapter('Fossil Fuels', [
  ['The study of fossils is called:', 'Palaeontology', 'Petrology', 'Mineralogy', 'Geomorphology'],
  ['Energy sources that can be used repeatedly and replaced naturally are called:', 'Renewable resources', 'Non-renewable resources', 'Fossil resources only', 'Metallic resources'],
  ['Hydropower, solar power and wind energy are examples of:', 'Renewable energy sources', 'Fossil fuels', 'Ore minerals', 'Gangue minerals'],
  ['Coal, petroleum and natural gas are examples of:', 'Fossil fuels', 'Renewable resources', 'Igneous rocks', 'Metamorphic minerals'],
  ['Coal is mainly a sedimentary accumulation of high carbon content derived from:', 'Vegetable matter', 'Marine shells only', 'Molten magma', 'Only limestone'],
  ['Coal is commonly found in beds called:', 'Seams', 'Dykes', 'Sills', 'Joints'],
  ['Calorific value is the amount of:', 'Heat produced by burning a standard unit of coal', 'Carbon fixed by plants', 'Sulphur in ore', 'Water in sediment'],
  ['Fixed carbon in coal refers to carbon left after:', 'Volatile matter is driven off', 'Coal is dissolved in water', 'Sediments are eroded', 'Magma crystallizes'],
  ['Fuel ratio in coal is the ratio of fixed carbon to:', 'Volatile matter', 'Ash content', 'Moisture content', 'Sulphur content'],
  ['According to the in-situ theory, coal-forming plant material:', 'Grew at the same place where coal is found', 'Was transported from outer space', 'Formed from magma', 'Was replaced by limestone'],
  ['According to the drift theory, coal-forming plant material was:', 'Transported and buried in deltaic or estuarine environments', 'Always formed in deserts', 'Derived from marine shells', 'Injected into faults'],
  ['Rapid plant growth and low oxygen conditions favour the formation of:', 'Coal-forming organic deposits', 'Granite plutons', 'Marble beds', 'Pegmatites'],
  ['The earliest stage in coal formation is:', 'Peat', 'Anthracite', 'Bituminous coal', 'Graphite'],
  ['With increasing burial and alteration, peat may change into lignite, bituminous coal and:', 'Anthracite', 'Shale', 'Sandstone', 'Marble'],
  ['Anthracite is considered the coal variety with:', 'Highest carbon content', 'Lowest carbon content', 'Highest water content', 'Only plant fossils'],
  ['Petroleum is chiefly a mixture of:', 'Hydrocarbons', 'Silicates', 'Carbonates', 'Oxides only'],
  ['Natural gas is commonly associated with:', 'Petroleum accumulations', 'Metamorphic foliation', 'Granite batholiths', 'Quartz veins only'],
  ['Source rocks for petroleum are generally rich in:', 'Organic matter', 'Pure quartz', 'Metallic gangue only', 'Large fossils only'],
  ['A porous and permeable rock that stores petroleum is called a:', 'Reservoir rock', 'Source code rock', 'Batholith', 'Dyke'],
  ['A rock that prevents escape of petroleum from a reservoir is called a:', 'Cap rock', 'Gangue rock', 'Source rock', 'Host lava'],
  ['Petroleum commonly migrates from source rocks into:', 'Reservoir rocks', 'Coal seams only', 'Mineral veins only', 'Batholiths only'],
  ['Structural traps for petroleum may be formed by folds, faults and:', 'Domes', 'Rainfall', 'Glaciation only', 'Soil profiles'],
  ['Anticlines are important in petroleum geology because they may act as:', 'Oil traps', 'Coal seams', 'Ore smelters', 'Renewable sources'],
  ['Oil shale is a non-renewable energy source containing:', 'Organic matter that can yield oil', 'Only pure methane', 'Only iron ore', 'Only limestone'],
  ['Tar sand contains:', 'Bituminous material mixed with sand', 'Only peat and clay', 'Only magma residue', 'Only quartz crystals'],
  ['Coal, petroleum and natural gas are called non-renewable because they:', 'Cannot be replaced fast enough for human use', 'Are always inorganic', 'Are made only by volcanoes', 'Contain no carbon'],
  ['The transformation of plant material into coal mainly involves heat, pressure and:', 'Physical and chemical changes', 'Only evaporation', 'Only weathering by wind', 'Only volcanic eruption'],
  ['A fossil fuel derived mainly from marine microorganisms is:', 'Petroleum', 'Peat', 'Slate', 'Quartzite'],
  ['The energy value of coal is closely related to its:', 'Carbon content and rank', 'Only colour', 'Only grain size', 'Only bedding thickness'],
  ['Fossil fuels are important but their excessive use can contribute to:', 'Environmental pollution and depletion of reserves', 'Formation of new mountains', 'Increase in biodiversity', 'Permanent renewal of resources'],
]);

const geologicalStructures = buildChapter('Geological Structures', [
  ['The branch of geology dealing with the form, arrangement and internal structure of rocks is:', 'Structural geology', 'Historical geology', 'Petrology', 'Palaeontology'],
  ['An exposure of bedrock on the earth surface is called an:', 'Outcrop', 'Ore body', 'Seam', 'Pluton'],
  ['The term attitude in structural geology refers to the:', 'Orientation of a geometric element in space', 'Economic value of a rock', 'Age of a fossil', 'Chemical composition of ore'],
  ['Arrangement of a geological feature in a linear fashion gives rise to a:', 'Linear structure', 'Planar structure', 'Economic deposit', 'Sedimentary basin'],
  ['Arrangement of mineral grains in layers gives rise to a:', 'Planar structure', 'Linear structure', 'Pegmatite body', 'Joint set only'],
  ['The attitude of a structural surface is expressed quantitatively by strike and:', 'Dip', 'Grade', 'Rank', 'Density'],
  ['Strike is the direction of the line formed by the intersection of an inclined plane with a:', 'Horizontal plane', 'Vertical plane', 'Fault gouge', 'Sedimentary bed only'],
  ['Dip is the angle a structural surface makes with the horizontal measured in a plane:', 'Perpendicular to strike', 'Parallel to strike', 'Parallel to bedding', 'Parallel to the earth axis'],
  ['The value of dip may range between:', '0 and 90 degrees', '90 and 180 degrees', '0 and 360 degrees', '10 and 100 degrees'],
  ['The maximum inclination of a bed measured perpendicular to strike is called:', 'True dip', 'Apparent dip', 'Plunge', 'Trend'],
  ['Inclination measured in a direction other than true dip is called:', 'Apparent dip', 'True dip', 'Strike', 'Azimuth'],
  ['Strike and dip are commonly measured using a:', 'Clinometer compass', 'Barometer', 'Thermometer', 'Altimeter only'],
  ['A fracture in rock with no appreciable displacement is called a:', 'Joint', 'Fault', 'Fold', 'Pluton'],
  ['A fracture in rock along which movement has taken place is called a:', 'Fault', 'Joint', 'Seam', 'Bedding plane'],
  ['The upper block of a fault plane is called the:', 'Hanging wall', 'Footwall', 'Fore wall', 'Cap rock'],
  ['The lower block of a fault plane is called the:', 'Footwall', 'Hanging wall', 'Ore wall', 'Back wall'],
  ['If the hanging wall moves downward relative to the footwall, the fault is a:', 'Normal fault', 'Reverse fault', 'Strike-slip fault only', 'Thrust-free joint'],
  ['If the hanging wall moves upward relative to the footwall, the fault is a:', 'Reverse fault', 'Normal fault', 'Open joint', 'Dip-slip joint'],
  ['A low-angle reverse fault is commonly termed a:', 'Thrust fault', 'Normal fault', 'Graben', 'Horst'],
  ['A fold with the limbs dipping away from the hinge is an:', 'Anticline', 'Syncline', 'Fault scarp', 'Joint set'],
  ['A fold with limbs dipping towards the hinge is a:', 'Syncline', 'Anticline', 'Horst', 'Dyke'],
  ['The line joining points of maximum curvature in a fold is the:', 'Hinge line', 'Strike line', 'Dip line', 'Joint line'],
  ['The central part of an anticline usually contains:', 'Older rocks', 'Younger rocks only', 'No bedding', 'Only magma'],
  ['The central part of a syncline usually contains:', 'Younger rocks', 'Older rocks only', 'Only ore minerals', 'Only fossils'],
  ['A pair of parallel joints cutting a rock mass may help break it into:', 'Blocks', 'Lava flows', 'Coal seams', 'Source rocks'],
  ['Strike-slip movement along a fault is generally:', 'Horizontal', 'Vertical only', 'Always circular', 'Absent in nature'],
  ['A graben is a block that has moved:', 'Down between two faults', 'Up between two faults', 'Sideways without faults', 'Only by folding'],
  ['A horst is a block that has moved:', 'Up relative to adjacent faulted blocks', 'Down into a basin', 'Only horizontally', 'Only by metamorphism'],
  ['Structural geology is essential for understanding the geometry of:', 'Beds, folds, faults and joints', 'Only fossils', 'Only minerals in solution', 'Only groundwater chemistry'],
  ['Strike and dip are especially used to describe the orientation of:', 'Planar features in rocks', 'Only ore grades', 'Only fossil ages', 'Only river channels'],
]);

const historyOfTheEarth = buildChapter('History of the Earth', [
  ['Stratigraphy is the study of the time and space relationships of:', 'Layered rocks', 'Molten magma only', 'Meteorites only', 'Ocean currents only'],
  ['Historical geology deals with the study of:', 'Events in the earths history', 'Only modern weather', 'Only map projection', 'Only mineral hardness'],
  ['Historical geology is closely linked with stratigraphy and:', 'Palaeontology', 'Volcanology only', 'Hydrology only', 'Crystallography only'],
  ['A visual representation of field outcrop succession is called a:', 'Stratigraphic column', 'Seam', 'Fault scarp', 'Mineral vein'],
  ['The relationship between strata at one location and another is called:', 'Correlation', 'Segregation', 'Dissemination', 'Fossil drift'],
  ['Fossils are the remains or traces of:', 'Ancient life', 'Future sediments', 'Molten magma', 'Only ore minerals'],
  ['The process of forming a fossil is called:', 'Fossilization', 'Metamorphism', 'Differentiation', 'Crystallization'],
  ['Fossils are most commonly preserved in:', 'Sedimentary rocks', 'Igneous rocks', 'Metamorphic rocks only', 'Molten magma'],
  ['Fossils are uncommon in igneous rocks because igneous rocks form from:', 'Magma', 'Layered sediments', 'Peat bogs', 'Deltaic mud only'],
  ['Fossils are uncommon in metamorphic rocks because metamorphism involves:', 'High temperature and pressure', 'Only rainfall', 'Only compaction by air', 'Photosynthesis'],
  ['Preservation of unaltered hard parts commonly involves:', 'Bones, teeth and shells', 'Only soft leaves', 'Only magma droplets', 'Only metallic ores'],
  ['Filling of pores in bone or shell by minerals from solution is called:', 'Permineralization', 'Strike-slip faulting', 'Jointing', 'Segregation'],
  ['Molecule by molecule substitution of original fossil material by another mineral is called:', 'Replacement', 'Intrusion', 'Sedimentation', 'Sorting'],
  ['Silica, calcium carbonate and pyrite commonly participate in:', 'Replacement of fossil hard parts', 'Coalification only', 'Joint formation', 'Ore segregation'],
  ['A classic example of replacement is the formation of:', 'Petrified wood', 'Basaltic glass', 'Gangue mineral', 'Anthracite'],
  ['Preservation of soft tissues as a thin carbon film is called:', 'Carbonization', 'Pegmatization', 'Segregation', 'Recrystallization'],
  ['Carbonization commonly preserves delicate remains such as:', 'Ferns', 'Granite crystals', 'Ore veins', 'Fault gouge'],
  ['Trace fossils record:', 'Activity of ancient organisms', 'Only chemical reactions', 'Only magma movement', 'Only erosion by wind'],
  ['Examples of trace fossils include:', 'Footprints and burrows', 'Quartz veins and dykes', 'Faults and joints', 'Batholiths and stocks'],
  ['Index fossils are especially useful for:', 'Correlation of strata', 'Measuring ore grade', 'Identifying joints', 'Calculating dip'],
  ['Good index fossils generally have wide geographic distribution and:', 'Short geologic range', 'Long geologic range only', 'No hard parts', 'No relation to time'],
  ['The three basic objectives of stratigraphic studies include subdivision, time relationship and:', 'Correlation of rock units', 'Weather forecast', 'Volcanic gas analysis', 'Mine blasting'],
  ['Relative dating mainly determines which rock is:', 'Older or younger than another', 'Richer in metal', 'Harder in texture', 'More magnetic'],
  ['The law of superposition states that in an undisturbed sequence, the oldest beds are:', 'At the bottom', 'At the top', 'Always in the middle', 'Absent in folds'],
  ['Unconformities represent:', 'Breaks in the geologic record', 'Continuous deposition only', 'Only igneous intrusion', 'Only ore concentration'],
  ['A surface separating younger strata from tilted older strata is an:', 'Angular unconformity', 'Strike line', 'Joint plane', 'Dyke margin'],
  ['Fossils help reconstruct the earths history because they provide evidence of:', 'Past life and environments', 'Only magma chemistry', 'Only present climate', 'Only ore genesis'],
  ['Historical geology combines information from stratigraphy and palaeontology to interpret:', 'Earth history through time', 'Only mineral colour', 'Only fold geometry', 'Only river erosion'],
  ['Rock strata can be correlated between distant areas using fossils and:', 'Lithologic characteristics', 'Only wind direction', 'Only cloud type', 'Only soil pH'],
  ['The study of the history of the earth relies heavily on understanding strata, fossils and:', 'Time relationships', 'Only metallic value', 'Only seismic waves', 'Only renewable energy'],
]);

const questions = [
  ...worldOfRocks,
  ...economicMineralDeposits,
  ...fossilFuels,
  ...geologicalStructures,
  ...historyOfTheEarth,
];

function validateQuestions() {
  if (questions.length !== 150) {
    throw new Error(`Expected 150 Geology questions, found ${questions.length}`);
  }

  for (const question of questions) {
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Question does not have exactly 4 options: ${question.question}`);
    }
  }
}

async function seedGeology() {
  try {
    validateQuestions();

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in the environment');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Question.deleteMany({
      board: BASE_QUESTION.board,
      class: BASE_QUESTION.class,
      medium: BASE_QUESTION.medium,
      subject: BASE_QUESTION.subject,
    });

    const result = await Question.insertMany(questions);

    const chapterCounts = result.reduce((acc, item) => {
      acc[item.chapter] = (acc[item.chapter] || 0) + 1;
      return acc;
    }, {});

    console.log(`Seeded ${result.length} Geology questions.`);
    console.log(chapterCounts);
  } catch (error) {
    console.error('Failed to seed Geology questions:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

seedGeology();
