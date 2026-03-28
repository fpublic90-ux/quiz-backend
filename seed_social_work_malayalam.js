require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const rawData = [
  {
    "question_number": 1,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സാമൂഹ്യ പ്രവർത്തനം എന്ന ആശയം പ്രധാനമായി എന്തിനെ മുൻനിർത്തുന്നു?",
    "options": ["വ്യക്തിപരമായ ലാഭം", "സമൂഹത്തിന്റെ ക്ഷേമം", "സർക്കാർ നിയമങ്ങൾ", "മതപരമായ ആചാരങ്ങൾ"],
    "answer": "സമൂഹത്തിന്റെ ക്ഷേമം"
  },
  {
    "question_number": 2,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സാമൂഹ്യ പ്രവർത്തനത്തിന്റെ പ്രധാന ലക്ഷ്യം ഏതാണ്?",
    "options": ["പ്രശ്നങ്ങൾ തിരിച്ചറിയുകയും പരിഹരിക്കുകയും ചെയ്യുക", "ധനസമ്പാദനം", "രാഷ്ട്രീയ അധികാരം", "വിനോദം"],
    "answer": "പ്രശ്നങ്ങൾ തിരിച്ചറിയുകയും പരിഹരിക്കുകയും ചെയ്യുക"
  },
  {
    "question_number": 3,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സാമൂഹ്യ പ്രവർത്തകർ എവിടെയാണ് പ്രവർത്തിക്കുന്നത്?",
    "options": ["ആശുപത്രികളിൽ", "സ്കൂളുകളിൽ", "സന്നദ്ധ സംഘടനകളിൽ", "മേൽപ്പറഞ്ഞവയെല്ലാം"],
    "answer": "മേൽപ്പറഞ്ഞവയെല്ലാം"
  },
  {
    "question_number": 4,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സ്ത്രീകളുടെയും കുട്ടികളുടെയും ക്ഷേമത്തിനായി പ്രവർത്തിക്കുന്ന ഒരു സർക്കാർ വകുപ്പ് ഏത്?",
    "options": ["കൃഷി വകുപ്പ്", "വനിതാ ശിശു വികസന വകുപ്പ്", "ധനകാര്യ വകുപ്പ്", "വനം വകുപ്പ്"],
    "answer": "വനിതാ ശിശു വികസന വകുപ്പ്"
  },
  {
    "question_number": 5,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സാമൂഹ്യ പ്രവർത്തനത്തിൽ 'എമ്പതി' (Empathy) എന്നാൽ എന്താണ്?",
    "options": ["മറ്റൊരാളുടെ വേദന സ്വന്തമെന്നപോലെ മനസ്സിലാക്കൽ", "മറ്റൊരാളെ ശകാരിക്കുക", "പണം നൽകുക", "അവഗണിക്കുക"],
    "answer": "മറ്റൊരാളുടെ വേദന സ്വന്തമെന്നപോലെ മനസ്സിലാക്കൽ"
  },
  {
    "question_number": 6,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സാമൂഹ്യ മാറ്റത്തിനായി ഗാന്ധിജി മുന്നോട്ടുവച്ച പ്രധാന മാർഗ്ഗം ഏതാണ്?",
    "options": ["അതിക്രമം", "അഹിംസ", "യുദ്ധം", "അധോലോക പ്രവർത്തനം"],
    "answer": "അഹിംസ"
  },
  {
    "question_number": 7,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "ദാരിദ്ര്യം നിർമ്മാർജ്ജനത്തിനായി പ്രവർത്തിക്കുന്നതിൽ പ്രധാനം എന്താണ്?",
    "options": ["തൊഴിൽ അവസരങ്ങൾ സൃഷ്ടിക്കുക", "ദാനധർമ്മങ്ങൾ മാത്രം", "നികുതി വർദ്ധിപ്പിക്കുക", "നഗരവൽക്കരണം"],
    "answer": "തൊഴിൽ അവസരങ്ങൾ സൃഷ്ടിക്കുക"
  },
  {
    "question_number": 8,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "സാമൂഹ്യ പ്രവർത്തകർ പാലിക്കേണ്ട പ്രധാന നൈതിക മൂല്യം ഏതാണ്?",
    "options": ["രഹസ്യാത്മകത (Confidentiality)", "പരസ്യപ്പെടുത്തൽ", "പക്ഷപാതം", "അഴിമതി"],
    "answer": "രഹസ്യാത്മകത (Confidentiality)"
  },
  {
    "question_number": 9,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "ലോക പരിസ്ഥിതി ദിനം എന്ന് കൊണ്ടാടുന്നു?",
    "options": ["ജൂൺ 5", "ജൂലൈ 5", "ഓഗസ്റ്റ് 15", "ജനുവരി 26"],
    "answer": "ജൂൺ 5"
  },
  {
    "question_number": 10,
    "chapter": "പ്രാഥമിക ബിജ്ജാസ്",
    "question": "കുട്ടികളുടെ അവകാശങ്ങൾ ഉറപ്പാക്കുന്നതിനുള്ള പ്രധാനം നിയമം?",
    "options": ["പോക്സോ (POCSO)", "മോട്ടോർ വാഹന നിയമം", "ഭൂ നിയമം", "ഐടി നിയമം"],
    "answer": "പോക്സോ (POCSO)"
  }
];

async function seedSocialWork() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const questionsToInsert = rawData.map(q => ({
            question: q.question,
            options: q.options,
            correctIndex: q.options.indexOf(q.answer),
            category: 'Plus Two',
            level: 1,
            board: 'Kerala State',
            class: '+2',
            subject: 'Social Work',
            chapter: q.chapter,
            medium: 'Malayalam'
        }));

        // Optional: Clear existing Social Work questions for Level 1 to avoid duplicates during dev
        await Question.deleteMany({ 
            subject: 'Social Work', 
            level: 1,
            board: 'Kerala State',
            class: '+2'
        });

        const result = await Question.insertMany(questionsToInsert);
        console.log(`✅ Seeded ${result.length} Social Work questions successfully.`);

    } catch (err) {
        console.error('❌ Error seeding Social Work questions:', err);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedSocialWork();
