require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const BASE_QUESTION = {
  board: 'Kerala State',
  class: '+2',
  medium: 'English',
  subject: 'Zoology',
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

const humanReproduction = buildChapter('Human Reproduction', [
  ['Humans are mainly described as which kind of organisms in reproduction?', 'Sexually reproducing and viviparous', 'Asexually reproducing and oviparous', 'Budding and ovoviviparous', 'Fragmenting and hermaphrodite'],
  ['Formation of male gametes is called:', 'Spermatogenesis', 'Oogenesis', 'Ovulation', 'Insemination'],
  ['Transfer of sperms into the female genital tract is called:', 'Insemination', 'Parturition', 'Fertilisation', 'Implantation'],
  ['Fusion of male and female gametes is called:', 'Fertilisation', 'Gestation', 'Implantation', 'Lactation'],
  ['Attachment of the blastocyst to the endometrium is called:', 'Implantation', 'Ovulation', 'Parturition', 'Menstruation'],
  ['The normal human gestation period is about:', '9 months', '3 months', '6 months', '12 months'],
  ['The testes are situated within a pouch called the:', 'Scrotum', 'Uterus', 'Vas deferens', 'Seminal vesicle'],
  ['The scrotum helps in maintaining the testes at a temperature that is:', 'About 2 to 2.5 C lower than body temperature', 'About 2 to 2.5 C higher than body temperature', 'Exactly equal to body temperature', 'About 5 C higher than body temperature'],
  ['Sperms are produced inside the:', 'Seminiferous tubules', 'Prostate gland', 'Urethra', 'Epididymis'],
  ['Cells that nourish developing sperms inside seminiferous tubules are:', 'Sertoli cells', 'Leydig cells', 'Goblet cells', 'Kupffer cells'],
  ['The interstitial cells of Leydig mainly secrete:', 'Testosterone', 'Oestrogen', 'Progesterone', 'Prolactin'],
  ['The duct formed when the vas deferens joins the duct of seminal vesicle is the:', 'Ejaculatory duct', 'Ureter', 'Cervical canal', 'Fallopian tube'],
  ['In the human female, primary oocytes are formed:', 'Before birth', 'Only after puberty', 'After menopause', 'Only after fertilisation'],
  ['Ovulation is the release of a secondary oocyte from the:', 'Graafian follicle', 'Corpus luteum', 'Endometrium', 'Cervix'],
  ['Meiosis II in the secondary oocyte is completed only after:', 'Entry of the sperm', 'Puberty', 'Menstruation', 'Implantation'],
]);

const reproductiveHealth = buildChapter('Reproductive Health', [
  ['Reproductive health mainly refers to total well-being in the:', 'Physical, emotional, behavioural and social aspects of reproduction', 'Circulatory and excretory systems only', 'Digestive and muscular systems only', 'Respiratory system alone'],
  ['Amniocentesis was originally developed to detect:', 'Foetal chromosomal disorders', 'Blood pressure in the mother', 'Vitamin deficiency in the foetus', 'Lung capacity in the mother'],
  ['Medical termination of pregnancy is considered safest during the:', 'First trimester', 'Last month of pregnancy', 'Third trimester only', 'Second half of gestation only'],
  ['The natural contraceptive method based on absence of ovulation after childbirth is:', 'Lactational amenorrhea', 'Coitus interruptus', 'Periodic abstinence', 'Barrier method'],
  ['Which contraceptive method also helps prevent sexually transmitted infections?', 'Condom', 'Oral pills', 'Copper-T', 'Tubectomy'],
  ['Copper releasing IUDs help in contraception mainly by:', 'Increasing phagocytosis of sperms', 'Stopping ovulation permanently', 'Destroying the uterus', 'Blocking pituitary hormones completely'],
  ['Hormone releasing IUDs make the uterus unsuitable for:', 'Implantation', 'Fertilisation in the testis', 'Spermatogenesis', 'Milk secretion'],
  ['In vasectomy, the structure that is cut and tied is the:', 'Vas deferens', 'Urethra', 'Penis', 'Seminiferous tubule'],
  ['In tubectomy, the structure that is cut and tied is the:', 'Fallopian tube', 'Ovary', 'Uterus', 'Cervix'],
  ['In IVF, fertilisation takes place:', 'Outside the body in laboratory conditions', 'Inside the uterus naturally', 'Inside the scrotum', 'Inside the urinary bladder'],
  ['In ZIFT, the zygote or early embryo is transferred into the:', 'Fallopian tube', 'Rectum', 'Urethra', 'Placenta'],
  ['Embryos with more than 8 blastomeres are usually transferred into the:', 'Uterus', 'Testis', 'Epididymis', 'Pancreas'],
  ['In GIFT, transfer is made into the fallopian tube of a:', 'Donor ovum', 'Fully formed foetus', 'Corpus luteum', 'Placenta'],
  ['ICSI is a technique in which:', 'A sperm is injected directly into the ovum', 'Many ova are released into the uterus', 'Only hormones are used', 'The embryo is grown in the cervix'],
  ['Which of the following is a bacterial sexually transmitted infection?', 'Gonorrhoea', 'AIDS', 'Hepatitis B', 'Genital herpes'],
]);

const principlesOfInheritance = buildChapter('Principles of Inheritance and Variation', [
  ['Genetics is the branch of biology that deals with:', 'Inheritance and variation', 'Photosynthesis alone', 'Respiration alone', 'Ecology only'],
  ['Inheritance is the process by which characters are passed from:', 'Parents to offspring', 'Soil to plants', 'Blood to nerves', 'Air to water'],
  ['Variation refers to the tendency of offspring to:', 'Differ from their parents', 'Remain identical in all respects', 'Lose all characters', 'Stop reproducing'],
  ['Alternative forms of a gene are called:', 'Alleles', 'Genomes', 'Codons', 'Phenotypes'],
  ['The observable appearance of an organism is its:', 'Phenotype', 'Genotype', 'Karyotype', 'Allele'],
  ['The complete genetic constitution of an organism is called its:', 'Genotype', 'Phenotype', 'Habit', 'Character'],
  ['An organism with two identical alleles for a gene is:', 'Homozygous', 'Heterozygous', 'Hemizygous', 'Polygenic'],
  ['An organism with two different alleles for a gene is:', 'Heterozygous', 'Homozygous', 'Diploid sterile', 'Monoploid'],
  ['A true breeding line is obtained by repeated:', 'Self-pollination over generations', 'Cross-pollination with any plant', 'Vegetative propagation alone', 'Mutation breeding only'],
  ['Gregor Mendel conducted his classical hybridisation experiments on:', 'Garden pea', 'Rice', 'Maize', 'Wheat'],
  ['Mendel selected how many pairs of contrasting traits in pea plants?', 'Seven', 'Two', 'Three', 'Ten'],
  ['The phenotypic ratio of a monohybrid F2 cross is:', '3:1', '1:1', '9:3:3:1', '1:2:1'],
  ['The genotypic ratio of a monohybrid F2 cross is:', '1:2:1', '3:1', '9:3:3:1', '2:1'],
  ['According to the law of dominance, in a heterozygote:', 'Only one of the two alleles is expressed', 'Both alleles disappear', 'Neither allele is inherited', 'Both chromosomes are lost'],
  ['According to the law of segregation, the two alleles of a gene:', 'Separate during gamete formation', 'Remain permanently fused', 'Are both expressed in every gamete', 'Move to the cytoplasm only'],
  ['The phenotypic ratio obtained in the F2 of a dihybrid cross is:', '9:3:3:1', '3:1', '1:2:1', '1:1'],
  ['A test cross involves crossing an individual with a:', 'Homozygous recessive parent', 'Homozygous dominant parent', 'Heterozygous parent only', 'Triploid parent'],
  ['The test cross ratio of a heterozygous monohybrid is:', '1:1', '3:1', '9:3:3:1', '1:2:1'],
  ['Incomplete dominance is well shown by the flower colour inheritance in:', 'Snapdragon', 'Pea', 'Sunflower', 'Maize'],
  ['AB blood group in humans is an example of:', 'Codominance', 'Linkage', 'Incomplete dominance only', 'Mutation'],
  ['The ABO blood group system is controlled by:', 'Multiple alleles', 'A single cytoplasmic gene only', 'Only sex-linked genes', 'Mitochondrial DNA alone'],
  ['The chromosomal theory of inheritance was proposed by:', 'Sutton and Boveri', 'Darwin and Wallace', 'Watson and Crick', 'Hershey and Chase'],
  ['Genes located on the same chromosome tend to be inherited together and are said to be:', 'Linked', 'Lethal', 'Dominant', 'Complementary'],
  ['New gene combinations are produced by crossing over during:', 'Meiosis', 'Binary fission', 'Budding', 'Mitosis in mature RBCs'],
  ['Thomas Hunt Morgan performed his linkage studies on:', 'Drosophila', 'Pisum sativum', 'E. coli', 'Neurospora'],
  ['In humans, males are called heterogametic because they have the sex chromosomes:', 'XY', 'XX', 'YY', 'XO only'],
  ['In humans, females have the sex chromosomes:', 'XX', 'XY', 'XO', 'YY'],
  ['Haemophilia in humans is generally inherited as a:', 'Sex-linked recessive trait', 'Y-linked dominant trait', 'Mitochondrial character', 'Autosomal dominant trait always'],
  ['Sickle-cell anaemia is caused by a change in the beta-globin chain where glutamic acid is replaced by:', 'Valine', 'Lysine', 'Alanine', 'Glycine'],
  ['Pedigree analysis is mainly used to:', 'Trace the inheritance of a trait through generations', 'Measure transpiration', 'Classify ecosystems', 'Estimate rainfall'],
]);

const molecularBasis = buildChapter('Molecular Basis of Inheritance', [
  ['The two main kinds of nucleic acids are:', 'DNA and RNA', 'DNA and ATP', 'RNA and protein', 'Glucose and DNA'],
  ['DNA was first identified as nuclein by:', 'Friedrich Miescher', 'Gregor Mendel', 'Charles Darwin', 'Alexander Fleming'],
  ['Griffith demonstrated the transforming principle using the bacterium:', 'Pneumococcus', 'Rhizobium', 'Lactobacillus', 'Nitrosomonas'],
  ['The scientists who proved that DNA is the transforming principle were:', 'Avery, MacLeod and McCarty', 'Watson, Crick and Wilkins', 'Darwin and Wallace', 'Jacob and Monod'],
  ['Hershey and Chase worked with viruses that infect bacteria called:', 'Bacteriophages', 'Retroviruses', 'Mycoplasma', 'Viroids'],
  ['In the Hershey-Chase experiment, DNA was labelled with:', '32P', '35S', '14C', '15N'],
  ['In the Hershey-Chase experiment, protein was labelled with:', '35S', '32P', '3H', '18O'],
  ['A nucleotide of DNA contains a nitrogen base, a phosphate group and a sugar called:', 'Deoxyribose', 'Ribose', 'Maltose', 'Fructose'],
  ['The purine bases in nucleic acids are:', 'Adenine and guanine', 'Cytosine and thymine', 'Uracil and thymine', 'Ribose and adenine'],
  ['The pyrimidine bases present in DNA are:', 'Cytosine and thymine', 'Adenine and guanine', 'Guanine and uracil', 'Adenine and uracil'],
  ['According to Chargaffs rule, in double stranded DNA adenine equals:', 'Thymine', 'Guanine', 'Uracil', 'Ribose'],
  ['In DNA, guanine always pairs with:', 'Cytosine', 'Thymine', 'Adenine', 'Uracil'],
  ['The double helix model of DNA was proposed by:', 'Watson and Crick', 'Mendel and Morgan', 'Hershey and Chase', 'Griffith and Avery'],
  ['The two strands of DNA run in opposite directions and are therefore:', 'Antiparallel', 'Parallel', 'Circular only', 'Identical in polarity'],
  ['Successive nucleotides in the same DNA strand are joined by:', 'Phosphodiester bonds', 'Hydrogen bonds only', 'Peptide bonds', 'Glycosidic bonds only'],
  ['Adenine pairs with thymine through:', 'Two hydrogen bonds', 'One hydrogen bond', 'Three hydrogen bonds', 'Four hydrogen bonds'],
  ['Guanine pairs with cytosine through:', 'Three hydrogen bonds', 'Two hydrogen bonds', 'One hydrogen bond', 'No hydrogen bond'],
  ['Semiconservative replication of DNA was experimentally proved by:', 'Meselson and Stahl', 'Jacob and Monod', 'Miller and Urey', 'Boveri and Sutton'],
  ['The central dogma of molecular biology is:', 'DNA to RNA to protein', 'Protein to DNA to RNA', 'RNA to DNA to lipid', 'DNA to carbohydrate to protein'],
  ['The RNA that carries genetic information from DNA to ribosomes is:', 'mRNA', 'tRNA', 'rRNA', 'snRNA'],
  ['The RNA that brings amino acids during translation is:', 'tRNA', 'mRNA', 'rRNA', 'miRNA'],
  ['The major structural and catalytic RNA of ribosomes is:', 'rRNA', 'mRNA', 'tRNA', 'hnRNA'],
  ['The genetic code is said to be triplet because each codon has:', 'Three nucleotides', 'Two nucleotides', 'Four nucleotides', 'Five nucleotides'],
  ['The genetic code is called degenerate because:', 'More than one codon can code for the same amino acid', 'It has only one codon', 'It is absent in microbes', 'It cannot start translation'],
  ['The usual start codon in mRNA is:', 'AUG', 'UAA', 'UAG', 'UGA'],
  ['Which of the following is a stop codon?', 'UAA', 'AUG', 'GUG', 'ACG'],
  ['The enzyme primarily responsible for transcription is:', 'RNA polymerase', 'DNA ligase', 'Amylase', 'Pepsin'],
  ['In the lac operon, the inducer molecule is:', 'Allolactose', 'Glucose', 'Maltose', 'Sucrose'],
  ['The human genome contains approximately how many base pairs?', '3.1 billion', '31 million', '310 thousand', '300 trillion'],
  ['DNA fingerprinting mainly depends on highly repetitive DNA sequences called:', 'VNTRs', 'Okazaki fragments', 'Codons', 'Plasmids'],
]);

const evolution = buildChapter('Evolution', [
  ['Evolutionary biology is the study of the:', 'History of life forms on earth', 'Physics of atoms', 'Weathering of rocks only', 'Industrial development only'],
  ['The age of the universe is approximately:', '13.8 billion years', '13.8 million years', '4.5 million years', '500 thousand years'],
  ['The earth is believed to have formed about:', '4.5 billion years ago', '500 million years ago', '13.8 billion years ago', '10 thousand years ago'],
  ['The theory of panspermia suggests that life came to earth as:', 'Spores from outer space', 'Fully formed mammals', 'Only minerals', 'Volcanic ash alone'],
  ['The idea of chemical evolution of life was supported by:', 'Oparin and Haldane', 'Mendel and Morgan', 'Watson and Crick', 'Harvey and Hippocrates'],
  ['Miller and Urey simulated primitive earth using gases such as methane, ammonia, hydrogen and:', 'Water vapour', 'Oxygen', 'Chlorine', 'Nitrogen dioxide only'],
  ['The Miller-Urey experiment produced simple organic compounds such as:', 'Amino acids', 'DNA molecules', 'Proteins with enzymes', 'Fully formed cells'],
  ['Charles Darwin made many observations on board the ship:', 'HMS Beagle', 'Titanic', 'Santa Maria', 'HMS Victory'],
  ['Natural selection states that organisms with favourable variations are more likely to:', 'Survive and reproduce', 'Lose all characters', 'Stop evolving', 'Remain sterile'],
  ['In Darwins theory, fitness refers to:', 'Reproductive success', 'Body weight only', 'Muscle strength only', 'Speed of locomotion only'],
  ['The evolution of different species from a common ancestor in a region is called:', 'Adaptive radiation', 'Convergent evolution', 'Mutation breeding', 'Artificial selection only'],
  ['Darwins finches of the Galapagos Islands are a classic example of:', 'Adaptive radiation', 'Industrial melanism', 'Sex linkage', 'Codominance'],
  ['Australian marsupials are commonly cited as an example of:', 'Adaptive radiation', 'Artificial hybridisation', 'Polyploidy', 'Incomplete dominance'],
  ['Structures having common origin but different functions are called:', 'Homologous organs', 'Analogous organs', 'Vestigial organs only', 'Acquired organs'],
  ['Structures having different origin but similar function are called:', 'Analogous organs', 'Homologous organs', 'Rudimentary organs', 'Mutant organs'],
  ['The wings of a butterfly and those of a bird are:', 'Analogous structures', 'Homologous structures', 'Identical organs', 'Embryonic tissues only'],
  ['The forelimbs of human, whale and bat are examples of:', 'Homologous organs', 'Analogous organs', 'Vestigial organs only', 'Artificial organs'],
  ['Industrial melanism was best demonstrated in the case of the:', 'Peppered moth', 'Honey bee', 'Housefly', 'Cockroach'],
  ['The Hardy-Weinberg equilibrium is expressed as:', 'p2 + 2pq + q2 = 1', 'a2 + b2 = c2', 'n(n+1)/2', 'F = ma'],
  ['Gene migration introduces:', 'New alleles into a population', 'Only dead cells', 'Only fossils', 'Only recessive genes'],
  ['Genetic drift has the strongest effect in a:', 'Small population', 'Very large stable population', 'Population with no reproduction', 'Population with only plants'],
  ['The founder effect is a consequence of:', 'Genetic drift in a small isolated population', 'Transcription error only', 'Photosynthetic failure', 'Pure line breeding only'],
  ['Mutation is important in evolution because it creates:', 'New genetic variation', 'Only identical offspring', 'No change in alleles', 'Instant speciation in every case'],
  ['Recombination during meiosis contributes to evolution by:', 'Producing new gene combinations', 'Preventing all variation', 'Destroying chromosomes always', 'Stopping gamete formation'],
  ['Most fossils are commonly found in:', 'Sedimentary rocks', 'Igneous rocks only', 'Magma chambers', 'Oceans without sediments'],
  ['Archaeopteryx is considered a connecting link between:', 'Reptiles and birds', 'Fish and amphibians', 'Mammals and reptiles', 'Algae and fungi'],
  ['Convergent evolution generally produces:', 'Analogous structures', 'Homologous structures', 'Only vestigial organs', 'Only mutations in RNA'],
  ['Divergent evolution generally results in:', 'Homologous structures', 'Analogous structures', 'No morphological change', 'No genetic variation'],
  ['The gradual fossil record of horse is often used to explain:', 'Organic evolution through time', 'Only biochemical pathways', 'Photosynthesis', 'Nitrogen fixation'],
  ['Modern humans belong to the species:', 'Homo sapiens', 'Homo habilis', 'Australopithecus afarensis', 'Dryopithecus'],
]);

const humanHealthAndDisease = buildChapter('Human Health and Disease', [
  ['Health is best defined as a state of complete:', 'Physical, mental and social well-being', 'Absence of fever alone', 'High body weight only', 'Muscular strength only'],
  ['Diseases that can spread easily from one person to another are called:', 'Infectious diseases', 'Non-infectious diseases', 'Deficiency diseases only', 'Lifestyle traits only'],
  ['Diseases that do not normally spread from person to person are called:', 'Non-infectious diseases', 'Vector-borne diseases', 'Communicable diseases', 'Contagious diseases'],
  ['Typhoid is caused by the bacterium:', 'Salmonella typhi', 'Vibrio cholerae', 'Plasmodium vivax', 'Entamoeba histolytica'],
  ['A commonly used diagnostic test for typhoid is:', 'Widal test', 'ELISA test', 'ECG', 'Urine sugar test'],
  ['Pneumonia mainly affects the:', 'Alveoli of the lungs', 'Nephrons of the kidney', 'Neurons of the brain', 'Cardiac valves'],
  ['The common cold is most often caused by:', 'Rhinoviruses', 'Retroviruses', 'Bacteriophages', 'Plasmodium'],
  ['Malaria is transmitted to humans by the bite of:', 'Female Anopheles mosquito', 'Male Culex mosquito', 'Housefly', 'Tsetse fly'],
  ['The stage of Plasmodium injected into humans by mosquito bite is the:', 'Sporozoite', 'Merozoite', 'Ookinete', 'Trophozoite'],
  ['The chills and recurring fever of malaria are caused by release of:', 'Haemozoin', 'Adrenaline', 'Insulin', 'Bile salts'],
  ['Amoebiasis is caused by:', 'Entamoeba histolytica', 'Ascaris lumbricoides', 'Giardia intestinalis', 'Trypanosoma gambiense'],
  ['Houseflies help spread amoebiasis mainly as:', 'Mechanical carriers', 'Primary hosts', 'Definitive hosts', 'Secondary consumers'],
  ['Ascariasis is caused by:', 'Ascaris lumbricoides', 'Taenia solium', 'Wuchereria bancrofti', 'Plasmodium falciparum'],
  ['Filariasis is commonly caused by:', 'Wuchereria bancrofti', 'Entamoeba histolytica', 'Trypanosoma cruzi', 'Taenia saginata'],
  ['Ringworm is caused by:', 'Fungi', 'Viruses', 'Protozoa', 'Algae'],
  ['AIDS is caused by infection with:', 'HIV', 'HBV', 'TMV', 'Poliovirus'],
  ['HIV is classified as a:', 'Retrovirus', 'Bacterium', 'Protozoan', 'Fungus'],
  ['The major target cells destroyed by HIV are:', 'Helper T lymphocytes', 'Red blood cells', 'Platelets', 'Osteocytes'],
  ['ELISA is widely used as a screening test for:', 'HIV infection', 'Malaria parasites only', 'Typhoid only', 'Tuberculosis bacteria only'],
  ['Cancer is characterised by:', 'Uncontrolled proliferation of cells', 'Complete stoppage of mitosis', 'Total absence of enzymes', 'Permanent inactivity of genes'],
  ['A tumour that remains confined to its original location is called:', 'Benign', 'Malignant', 'Metastatic', 'Invasive by default'],
  ['The spread of malignant cells from one part of the body to another is called:', 'Metastasis', 'Mutation', 'Regeneration', 'Transcription'],
  ['Regular tobacco smoking is strongly associated with:', 'Lung cancer', 'Night blindness', 'Scurvy', 'Goitre'],
  ['Allergy is produced by an exaggerated response of the immune system to:', 'Allergens', 'Hormones', 'Enzymes', 'Vitamins'],
  ['A chemical mediator commonly released during allergic reactions is:', 'Histamine', 'Insulin', 'Pepsin', 'Keratin'],
  ['Immunity produced by vaccination is called:', 'Active immunity', 'Passive immunity', 'Innate immunity only', 'Community immunity only'],
  ['Ready-made antibodies obtained from another source provide:', 'Passive immunity', 'Active immunity', 'Autoimmunity', 'Allergy'],
  ['Interferons are important in protecting the body against:', 'Viral infections', 'Mineral deficiency', 'Bone fracture', 'Dehydration'],
  ['Morphine is obtained from the plant:', 'Papaver somniferum', 'Rauwolfia serpentina', 'Cinchona officinalis', 'Azadirachta indica'],
  ['Heroin is chemically known as:', 'Diacetylmorphine', 'Acetylsalicylic acid', 'Methanol', 'Caffeine'],
]);

const microbesInHumanWelfare = buildChapter('Microbes in Human Welfare', [
  ['Milk is converted into curd mainly by:', 'Lactic acid bacteria', 'Methanogens', 'Rhizobium', 'Plasmodium'],
  ['LAB stands for:', 'Lactic Acid Bacteria', 'Lipid Absorbing Bacteria', 'Low Aeration Bacilli', 'Linked Algal Bodies'],
  ['Curd made by LAB is nutritionally improved due to an increase in:', 'Vitamin B12', 'Vitamin C only', 'Iron only', 'Calcium carbonate'],
  ['The puffed appearance of idli or dosa dough is mainly due to:', 'Carbon dioxide produced during fermentation', 'High temperature only', 'Addition of salt', 'Evaporation of water'],
  ['Bread dough is commonly fermented by:', 'Saccharomyces cerevisiae', 'Lactobacillus acidophilus', 'Rhizopus stolonifer', 'Penicillium notatum'],
  ['Toddy is prepared by fermenting sap collected from:', 'Palms', 'Cactus stems', 'Pine cones', 'Mosses'],
  ['The large holes in Swiss cheese are formed due to carbon dioxide produced by:', 'Propionibacterium shermanii', 'Escherichia coli', 'Azotobacter', 'Staphylococcus aureus'],
  ['Roquefort cheese acquires its special flavour from:', 'Penicillium roqueforti', 'Aspergillus niger', 'Rhizobium meliloti', 'Methanobacterium'],
  ['Antibiotics are substances produced by microbes that:', 'Kill or inhibit other microbes', 'Increase atmospheric oxygen', 'Stop all digestion', 'Convert milk to starch'],
  ['Penicillin was discovered by:', 'Alexander Fleming', 'Louis Pasteur', 'Edward Jenner', 'Joseph Lister'],
  ['The original source mould for penicillin was:', 'Penicillium notatum', 'Aspergillus flavus', 'Rhizopus nigricans', 'Mucor mucedo'],
  ['Streptokinase is medically used as a:', 'Clot buster', 'Pain killer', 'Sedative', 'Vitamin supplement'],
  ['Streptokinase is produced by:', 'Streptococcus', 'Lactobacillus', 'Nitrosomonas', 'Spirogyra'],
  ['Cyclosporin A is an immunosuppressive drug obtained from:', 'Trichoderma polysporum', 'Rhizobium', 'Aspergillus fumigatus', 'Vibrio cholerae'],
  ['Statins are obtained from the yeast:', 'Monascus purpureus', 'Candida albicans', 'Saccharomyces cerevisiae', 'Pichia pastoris'],
  ['Statins are mainly used to lower:', 'Blood cholesterol', 'Blood calcium', 'Body temperature', 'Urine output'],
  ['Alcoholic beverages such as wine and beer are produced with the help of:', 'Yeast fermentation', 'Algal photosynthesis', 'Protozoan digestion', 'Nitrifying bacteria'],
  ['Primary sewage treatment mainly involves:', 'Physical removal of floating and suspended materials', 'Use of antibiotics only', 'Addition of hormones', 'Only chlorination'],
  ['Secondary sewage treatment mainly depends on:', 'Microbial activity', 'Mechanical cutting only', 'Solar radiation only', 'Bone marrow cells'],
  ['Flocs formed during sewage treatment are masses of bacteria associated with:', 'Fungal filaments', 'Plant roots', 'Pollen grains', 'Nerve cells'],
  ['Activated sludge is sent to the digester for:', 'Anaerobic digestion', 'Photosynthesis', 'Chromosome doubling', 'Neutralisation by acid'],
  ['Biogas is produced in sewage digesters under:', 'Anaerobic conditions', 'Bright sunlight only', 'Vacuum conditions', 'Boiling conditions'],
  ['The main combustible component of biogas is:', 'Methane', 'Nitrogen', 'Oxygen', 'Hydrogen chloride'],
  ['Microbes that produce methane are called:', 'Methanogens', 'Nitrifiers', 'Denitrifiers', 'Actinomycetes'],
  ['Gobar gas is commonly generated using:', 'Cattle dung', 'Sea water', 'Granite dust', 'Leaf litter only'],
  ['BOD in sewage treatment stands for:', 'Biochemical Oxygen Demand', 'Biological Oxidation Density', 'Bacterial Output Difference', 'Biotic Organic Deficit'],
  ['A high BOD value indicates:', 'High organic pollution', 'Pure drinking water', 'Low microbial activity', 'Absence of biodegradable matter'],
  ['Bacillus thuringiensis is widely used as a:', 'Biocontrol agent against insect pests', 'Nitrogen fixing alga', 'Human vaccine', 'Cheese starter'],
  ['Bt toxin is particularly effective against many:', 'Lepidopteran larvae', 'Mammalian RBCs', 'Bird feathers', 'Fish scales'],
  ['Cyanobacteria used as biofertilisers in paddy fields include:', 'Anabaena and Nostoc', 'Euglena and Chlamydomonas', 'Spirogyra and Ulothrix', 'Volvox and Oedogonium'],
]);

const biodiversityAndConservation = buildChapter('Biodiversity and Conservation', [
  ['The term biodiversity was popularised by:', 'Edward Wilson', 'Charles Darwin', 'Gregor Mendel', 'Alexander Fleming'],
  ['Biodiversity can be described as the sum total of genes, species and:', 'Ecosystems of a region', 'Only climate factors', 'Only food chains', 'Only soil organisms'],
  ['Genetic diversity in India is illustrated by the existence of more than 50000 strains of:', 'Rice', 'Tea', 'Wheat', 'Cotton'],
  ['Greater amphibian species diversity is found in the:', 'Western Ghats', 'Eastern Ghats', 'Thar desert', 'Cold desert of Ladakh'],
  ['Diversity at the ecosystem level is called:', 'Ecological diversity', 'Genetic engineering', 'Phenotypic plasticity', 'Artificial selection'],
  ['Biodiversity generally increases from the poles towards the:', 'Equator', 'Mountain peaks only', 'Urban areas', 'Deserts only'],
  ['The decrease in species diversity from the equator to the poles is called the:', 'Latitudinal gradient', 'Hardy-Weinberg effect', 'Founder effect', 'Mendelian ratio'],
  ['Among large countries, very high biodiversity is seen in tropical regions because they are:', 'Relatively undisturbed for long evolutionary periods', 'Always colder', 'Always drier', 'Completely free from competition'],
  ['The relation between species richness and explored area was first described by:', 'Alexander von Humboldt', 'Watson and Crick', 'Miescher', 'Jenner'],
  ['On a logarithmic scale, the species-area relationship becomes a:', 'Straight line', 'Circle', 'Hyperbola only', 'Random cluster'],
  ['The value of z in the species-area relationship usually ranges between:', '0.1 and 0.2', '1.5 and 2.0', '3.0 and 4.0', '5.0 and 6.0'],
  ['For very large areas such as entire continents, the slope z may be:', 'Steeper than usual', 'Always zero', 'Always negative', 'Always exactly 0.01'],
  ['The organisation that publishes the Red List of threatened species is:', 'IUCN', 'WHO', 'UNESCO', 'FAO'],
  ['Current extinction rates are estimated to be many times higher than the:', 'Background extinction rate', 'Photosynthetic rate', 'Mutation rate', 'Respiratory rate'],
  ['The most important cause of biodiversity loss worldwide is:', 'Habitat loss and fragmentation', 'Rainfall alone', 'Moonlight exposure', 'Protein synthesis'],
  ['Over-exploitation drove the following animal to extinction:', 'Stellers sea cow', 'Blue whale', 'Asiatic lion', 'Giant panda'],
  ['Introduction of alien species can threaten native biodiversity because alien species may become:', 'Invasive', 'Autotrophic only', 'Sterile always', 'Photosynthetic predators only'],
  ['The introduction of Nile perch into Lake Victoria led to the extinction of many species of:', 'Cichlid fishes', 'Whales', 'Coral polyps', 'Sea turtles'],
  ['Co-extinction occurs when:', 'One species becomes extinct after the extinction of another closely associated species', 'All members of a species become taller', 'Mutations stop in a population', 'Only predators survive'],
  ['The concept of biodiversity hotspots was introduced by:', 'Norman Myers', 'Hippocrates', 'Harvey', 'Paul Ehrlich'],
  ['The hotspot that includes parts of southern India is:', 'Western Ghats and Sri Lanka', 'Sahara and Arabia', 'Arctic tundra', 'North American grasslands'],
  ['In situ conservation means conservation of species:', 'In their natural habitats', 'Only in museums', 'Only in laboratories', 'Only in books'],
  ['National parks, wildlife sanctuaries and biosphere reserves are examples of:', 'In situ conservation', 'Ex situ conservation', 'Cryopreservation only', 'Gene cloning'],
  ['Ex situ conservation includes:', 'Zoological parks and botanical gardens', 'Only sacred groves', 'Natural forests only', 'River valleys only'],
  ['Preservation of gametes, seeds and embryos at very low temperature is called:', 'Cryopreservation', 'Pasteurisation', 'Fermentation', 'Calcification'],
  ['Sacred groves are important because they often protect:', 'Rare and threatened species', 'Only domesticated crops', 'Only urban birds', 'Only exotic pets'],
  ['The rivet popper hypothesis was proposed by:', 'Paul Ehrlich', 'Robert Brown', 'Louis Pasteur', 'Sutton'],
  ['Pollination, nutrient cycling and climate regulation are examples of:', 'Ecosystem services provided by biodiversity', 'Artificial inputs to farming', 'Only abiotic processes', 'Diseases caused by microbes'],
  ['The estimated global value of ecosystem services from biodiversity has been put at about:', '33 trillion US dollars per year', '33 million US dollars per year', '330 US dollars per year', '3 billion US dollars per year'],
  ['The long-term conservation of biodiversity is important because it supports both ecological stability and:', 'Human well-being', 'Only metallic mining', 'Only satellite launch', 'Only urban construction'],
]);

const questions = [
  ...humanReproduction,
  ...reproductiveHealth,
  ...principlesOfInheritance,
  ...molecularBasis,
  ...evolution,
  ...humanHealthAndDisease,
  ...microbesInHumanWelfare,
  ...biodiversityAndConservation,
];

function validateQuestions() {
  if (questions.length !== 210) {
    throw new Error(`Expected 210 Zoology questions, found ${questions.length}`);
  }

  for (const question of questions) {
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Question does not have exactly 4 options: ${question.question}`);
    }
  }
}

async function seedZoology() {
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

    console.log(`Seeded ${result.length} Zoology questions.`);
    console.log(chapterCounts);
  } catch (error) {
    console.error('Failed to seed Zoology questions:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

seedZoology();
