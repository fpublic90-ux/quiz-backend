require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app';

const rawData = [
{"id":1,"chapter":"نثارة العلم","question":"ما موضوع درس 'نثارة العلم'؟","options":["المال","العلم والتقدم","الحرب","اللعب"],"answer":"العلم والتقدم"},
{"id":2,"chapter":"نثارة العلم","question":"ماذا تطور في القرن التاسع عشر؟","options":["الزراعة","الثقافة والعلم","الحرب","الرياضة"],"answer":"الثقافة والعلم"},
{"id":3,"chapter":"نثارة العلم","question":"لماذا جاء الأوروبيون إلى الهند؟","options":["للسياحة","للتجارة والسيطرة","للدراسة","للعب"],"answer":"للتجارة والسيطرة"},
{"id":4,"chapter":"نثارة العلم","question":"ما نتيجة الاستعمار؟","options":["تقدم","تدهور","راحة","سلام"],"answer":"تدهور"},
{"id":5,"chapter":"نثارة العلم","question":"ما الحل الذي اقترحه الرجل؟","options":["الحرب","التعليم","الهجرة","العمل"],"answer":"التعليم"},
{"id":6,"chapter":"المصابيح","question":"ماذا تمثل المصابيح في النص؟","options":["الظلام","العلم","المال","الحرب"],"answer":"العلم"},
{"id":7,"chapter":"المصابيح","question":"من يضيء الناس؟","options":["الأغنياء","العلماء","الجنود","الأطفال"],"answer":"العلماء"},
{"id":8,"chapter":"المصابيح","question":"ما عكس الجهل؟","options":["الظلام","العلم","الحرب","الفقر"],"answer":"العلم"},
{"id":9,"chapter":"المصابيح","question":"ماذا يحدث للجاهل؟","options":["يتقدم","يتأخر","ينجح","يسعد"],"answer":"يتأخر"},
{"id":10,"chapter":"المصابيح","question":"ما أهمية العلم؟","options":["يزيد الجهل","ينير الحياة","يقلل العمل","يسبب الحرب"],"answer":"ينير الحياة"},
{"id":11,"chapter":"في المصرف","question":"أين ذهب الرجل؟","options":["المدرسة","المصرف","المستشفى","السوق"],"answer":"المصرف"},
{"id":12,"chapter":"في المصرف","question":"ماذا طلب الرجل؟","options":["وظيفة","قرض","طعام","كتاب"],"answer":"قرض"},
{"id":13,"chapter":"في المصرف","question":"لماذا يحتاج القرض؟","options":["للعب","لبناء بيت","للسفر","للدراسة"],"answer":"لبناء بيت"},
{"id":14,"chapter":"في المصرف","question":"ماذا طلب المدير أولاً؟","options":["مال","فتح حساب","كتاب","وظيفة"],"answer":"فتح حساب"},
{"id":15,"chapter":"في المصرف","question":"ما المستندات المطلوبة؟","options":["ملابس","وثائق رسمية","ألعاب","كتب"],"answer":"وثائق رسمية"},
{"id":16,"chapter":"صِرنا مُقترِضين","question":"ما موضوع النص؟","options":["السعادة","القرض والدين","اللعب","الحرب"],"answer":"القرض والدين"},
{"id":17,"chapter":"صِرنا مُقترِضين","question":"كيف تغيرت حياة الأسرة؟","options":["أفضل","أسوأ","ثابتة","ممتعة"],"answer":"أسوأ"},
{"id":18,"chapter":"صِرنا مُقترِضين","question":"ما سبب المشاكل؟","options":["العلم","القرض","اللعب","العمل"],"answer":"القرض"},
{"id":19,"chapter":"صِرنا مُقترِضين","question":"ما نتيجة الدين؟","options":["راحة","توتر","نجاح","سلام"],"answer":"توتر"},
{"id":20,"chapter":"صِرنا مُقترِضين","question":"ما الرسالة؟","options":["القرض جيد","الحذر من الدين","اللعب مهم","المال مهم"],"answer":"الحذر من الدين"},
{"id":21,"chapter":"الصياد السعيد","question":"من هو الصياد؟","options":["غني","فقير","ملك","تاجر"],"answer":"فقير"},
{"id":22,"chapter":"الصياد السعيد","question":"لماذا كان سعيداً؟","options":["مال كثير","رضا النفس","وظيفة","قصر"],"answer":"رضا النفس"},
{"id":23,"chapter":"الصياد السعيد","question":"ما نصيحة الصياد؟","options":["جمع المال","الرضا","العمل فقط","السفر"],"answer":"الرضا"},
{"id":24,"chapter":"الصياد السعيد","question":"ما نوع النص؟","options":["قصة","شعر","مقال","رسالة"],"answer":"قصة"},
{"id":25,"chapter":"الصياد السعيد","question":"ما الفكرة الرئيسية؟","options":["الغنى","السعادة الداخلية","الحرب","اللعب"],"answer":"السعادة الداخلية"},
{"id":26,"chapter":"General","question":"ما معنى 'العلم'؟","options":["المال","المعرفة","اللعب","الحرب"],"answer":"المعرفة"},
{"id":27,"chapter":"General","question":"ما عكس 'الغنى'؟","options":["الفقر","العلم","القوة","العمل"],"answer":"الفقر"},
{"id":28,"chapter":"General","question":"ما معنى 'السعادة'؟","options":["الحزن","الراحة النفسية","الخوف","التعب"],"answer":"الراحة النفسية"},
{"id":29,"chapter":"General","question":"ما وظيفة البنك؟","options":["التعليم","إدارة المال","الطب","الزراعة"],"answer":"إدارة المال"},
{"id":30,"chapter":"General","question":"ما معنى 'القرض'؟","options":["هدية","مال مستعار","عمل","طعام"],"answer":"مال مستعار"},
{"id":31,"chapter":"Grammar","question":"ما هو الفعل؟","options":["اسم","كلمة تدل على حدث","حرف","عدد"],"answer":"كلمة تدل على حدث"},
{"id":32,"chapter":"Grammar","question":"ما هو الاسم؟","options":["حدث","شخص أو شيء","فعل","حرف"],"answer":"شخص أو شيء"},
{"id":33,"chapter":"Grammar","question":"ما هو الحرف؟","options":["اسم","فعل","كلمة تربط","عدد"],"answer":"كلمة تربط"},
{"id":34,"chapter":"Grammar","question":"ما معنى 'كتب'؟","options":["قرأ","كتب","ذهب","جلس"],"answer":"كتب"},
{"id":35,"chapter":"Grammar","question":"ما جمع 'كتاب'؟","options":["كتب","كتابان","كاتب","مكتبة"],"answer":"كتب"},
{"id":36,"chapter":"Grammar","question":"ما مفرد 'طلاب'؟","options":["طالب","طلاب","طالبة","مدرس"],"answer":"طالب"},
{"id":37,"chapter":"Grammar","question":"ما معنى 'ذهب'؟","options":["جاء","ذهب","أكل","شرب"],"answer":"ذهب"},
{"id":38,"chapter":"Grammar","question":"ما نوع الجملة الاسمية؟","options":["تبدأ بفعل","تبدأ باسم","تبدأ بحرف","لا تبدأ"],"answer":"تبدأ باسم"},
{"id":39,"chapter":"Grammar","question":"ما نوع الجملة الفعلية؟","options":["تبدأ باسم","تبدأ بفعل","تبدأ بحرف","لا تبدأ"],"answer":"تبدأ بفعل"},
{"id":40,"chapter":"Grammar","question":"ما معنى 'درس'؟","options":["لعب","تعلم","نام","أكل"],"answer":"تعلم"},
{"id":41,"chapter":"General","question":"ما أهمية التعليم؟","options":["الجهل","التقدم","الفقر","الحرب"],"answer":"التقدم"},
{"id":42,"chapter":"General","question":"ما نتيجة الجهل؟","options":["تقدم","تأخر","نجاح","راحة"],"answer":"تأخر"},
{"id":43,"chapter":"General","question":"ما معنى 'العمل'؟","options":["اللعب","الوظيفة","النوم","الأكل"],"answer":"الوظيفة"},
{"id":44,"chapter":"General","question":"ما أهمية التعاون؟","options":["الفشل","النجاح","الخوف","الحرب"],"answer":"النجاح"},
{"id":45,"chapter":"General","question":"ما معنى 'المجتمع'؟","options":["فرد","مجموعة الناس","بيت","مدرسة"],"answer":"مجموعة الناس"},
{"id":46,"chapter":"General","question":"ما أهمية الوقت؟","options":["لا شيء","مهم جداً","قليل","غير مهم"],"answer":"مهم جداً"},
{"id":47,"chapter":"General","question":"ما معنى 'الصبر'؟","options":["الغضب","التحمل","الخوف","اللعب"],"answer":"التحمل"},
{"id":48,"chapter":"General","question":"ما نتيجة العمل الجاد؟","options":["فشل","نجاح","خوف","تعب فقط"],"answer":"نجاح"},
{"id":49,"chapter":"General","question":"ما أهمية الصدق؟","options":["سيء","جيد","لا شيء","غير مهم"],"answer":"جيد"},
{"id":50,"chapter":"General","question":"ما معنى 'النجاح'؟","options":["الفشل","تحقيق الهدف","الخوف","اللعب"],"answer":"تحقيق الهدف"},
{"id": 51,"chapter": "نثارة العلم","question": "لماذا اعتبر التعليم الحل الأساسي للمشاكل؟","options": ["لأنه يحقق المال", "لأنه يطور المجتمع", "لأنه يوفر العمل", "لأنه يحقق القوة"],"answer": "لأنه يطور المجتمع"},
{"id": 52,"chapter": "نثارة العلم","question": "ما سبب تأخر المجتمع في النص؟","options": ["قلة المال", "الجهل", "الطقس", "الحرب"],"answer": "الجهل"},
{"id": 53,"chapter": "نثارة العلم","question": "ما الهدف من إنشاء الجامعة؟","options": ["الترفيه", "نشر العلم", "جمع المال", "السفر"],"answer": "نشر العلم"},
{"id": 54,"chapter": "نثارة العلم","question": "كيف يمكن التخلص من التخلف؟","options": ["الحرب", "التعليم", "العمل فقط", "الهجرة"],"answer": "التعليم"},
{"id": 55,"chapter": "نثارة العلم","question": "ما دور العلماء في المجتمع؟","options": ["اللعب", "التنوير", "الحرب", "التجارة"],"answer": "التنوير"},
{"id": 56,"chapter": "المصابيح","question": "لماذا شبه العلماء بالمصابيح؟","options": ["لأنهم جميلون", "لأنهم ينيرون الطريق", "لأنهم أغنياء", "لأنهم مشهورون"],"answer": "لأنهم ينيرون الطريق"},
{"id": 57,"chapter": "المصابيح","question": "ماذا يحدث بدون العلم؟","options": ["نور", "ظلام", "راحة", "نجاح"],"answer": "ظلام"},
{"id": 58,"chapter": "المصابيح","question": "ما العلاقة بين العلم والتقدم؟","options": ["لا علاقة", "علاقة عكسية", "علاقة مباشرة", "ضعيفة"],"answer": "علاقة مباشرة"},
{"id": 59,"chapter": "المصابيح","question": "من يستفيد من العلم؟","options": ["الأغنياء فقط", "الناس جميعاً", "الأطفال فقط", "الطلاب فقط"],"answer": "الناس جميعاً"},
{"id": 60,"chapter": "المصابيح","question": "ما نتيجة انتشار العلم؟","options": ["زيادة الجهل", "التقدم", "الحرب", "الفقر"],"answer": "التقدم"},
{"id": 61,"chapter": "في المصرف","question": "لماذا طلب المدير فتح حساب أولاً؟","options": ["لالتسلية", "لإجراءات رسمية", "للعب", "للتعليم"],"answer": "لإجراءات رسمية"},
{"id": 62,"chapter": "في المصرف","question": "ما أهمية الوثائق؟","options": ["غير مهمة", "إثبات الهوية", "للزينة", "للعب"],"answer": "إثبات الهوية"},
{"id": 63,"chapter": "في المصرف","question": "ما نوع الحوار في النص؟","options": ["سرد", "حوار مباشر", "شعر", "وصف"],"answer": "حوار مباشر"},
{"id": 64,"chapter": "في المصرف","question": "ما هدف الرجل من القرض؟","options": ["اللعب", "بناء بيت", "السفر", "شراء كتاب"],"answer": "بناء بيت"},
{"id": 65,"chapter": "في المصرف","question": "ما أهمية البنك في المجتمع؟","options": ["اللعب", "تنظيم المال", "التعليم", "الطب"],"answer": "تنظيم المال"},
{"id": 66,"chapter": "صِرنا مُقترِضين","question": "ما أثر القرض على الأسرة؟","options": ["راحة", "توتر وضغط", "سعادة", "نجاح"],"answer": "توتر وضغط"},
{"id": 67,"chapter": "صِرنا مُقترِضين","question": "لماذا أصبحوا مقترضين؟","options": ["العمل", "الحاجة المالية", "اللعب", "السفر"],"answer": "الحاجة المالية"},
{"id": 68,"chapter": "صِرنا مُقترِضين","question": "ما الرسالة الأساسية؟","options": ["القرض مفيد", "الحذر من الديون", "العمل مهم", "اللعب مهم"],"answer": "الحذر من الديون"},
{"id": 69,"chapter": "صِرنا مُقترِضين","question": "كيف تؤثر الديون على العلاقات؟","options": ["تحسنها", "تضعفها", "لا تؤثر", "تقويها"],"answer": "تضعفها"},
{"id": 70,"chapter": "صِرنا مُقترِضين","question": "ما شعور الكاتب؟","options": ["سعادة", "قلق", "راحة", "فرح"],"answer": "قلق"},
{"id": 71,"chapter": "الصياد السعيد","question": "ما سبب سعادة الصياد؟","options": ["مال كثير", "رضا النفس", "وظيفة", "منزل"],"answer": "رضا النفس"},
{"id": 72,"chapter": "الصياد السعيد","question": "ما الفكرة العميقة في النص؟","options": ["الغنى", "القناعة", "الحرب", "اللعب"],"answer": "القناعة"},
{"id": 73,"chapter": "الصياد السعيد","question": "كيف ينظر الصياد للحياة؟","options": ["سلبية", "إيجابية", "خائفة", "قلقة"],"answer": "إيجابية"},
{"id": 74,"chapter": "الصياد السعيد","question": "ما الرسالة؟","options": ["جمع المال", "الرضا يجلب السعادة", "العمل فقط", "السفر"],"answer": "الرضا يجلب السعادة"},
{"id": 75,"chapter": "الصياد السعيد","question": "ما نوع النص؟","options": ["قصة تعليمية", "شعر", "مقال", "رسالة"],"answer": "قصة تعليمية"},
{"id": 76,"chapter": "General","question": "ما معنى 'التقدم'؟","options": ["تأخر", "تطور", "خوف", "فشل"],"answer": "تطور"},
{"id": 77,"chapter": "General","question": "ما عكس 'الجهل'؟","options": ["الفقر", "العلم", "الحرب", "خوف"],"answer": "العلم"},
{"id": 78,"chapter": "General","question": "ما أهمية التعاون؟","options": ["الفشل", "النجاح", "الخوف", "الحرب"],"answer": "النجاح"},
{"id": 79,"chapter": "General","question": "ما نتيجة الكسل؟","options": ["نجاح", "فشل", "راحة", "سعادة"],"answer": "فشل"},
{"id": 80,"chapter": "General","question": "ما أهمية الصبر؟","options": ["ضعيف", "مهم", "غير مهم", "لا شيء"],"answer": "مهم"},
{"id": 81,"chapter": "Grammar","question": "ما جمع 'مصباح'؟","options": ["مصابيح", "مصباحان", "مصباح", "مصبحة"],"answer": "مصابيح"},
{"id": 82,"chapter": "Grammar","question": "ما مفرد 'طلاب'؟","options": ["طالب", "طلاب", "طالبة", "مدرس"],"answer": "طالب"},
{"id": 83,"chapter": "Grammar","question": "ما معنى 'قرأ'؟","options": ["كتب", "قرأ", "ذهب", "أكل"],"answer": "قرأ"},
{"id": 84,"chapter": "Grammar","question": "ما نوع الجملة: 'ذهب الطالب'؟","options": ["اسمية", "فعلية", "شرطية", "سؤال"],"answer": "فعلية"},
{"id": 85,"chapter": "Grammar","question": "ما نوع الجملة: 'الطالب مجتهد'؟","options": ["فعلية", "اسمية", "سؤال", "تعجب"],"answer": "اسمية"},
{"id": 86,"chapter": "Grammar","question": "ما معنى 'كتب'؟","options": ["قرأ", "كتب", "أكل", "شرب"],"answer": "كتب"},
{"id": 87,"chapter": "Grammar","question": "ما جمع 'بيت'؟","options": ["بيوت", "بيت", "بيتان", "بيتي"],"answer": "بيوت"},
{"id": 88,"chapter": "Grammar","question": "ما معنى 'ذهب'؟","options": ["جاء", "ذهب", "أكل", "شرب"],"answer": "ذهب"},
{"id": 89,"chapter": "Grammar","question": "ما معنى 'تعلم'؟","options": ["لعب", "درس", "نام", "أكل"],"answer": "درس"},
{"id": 90,"chapter": "Grammar","question": "ما نوع 'الكتاب'؟","options": ["فعل", "اسم", "حرف", "عدد"],"answer": "اسم"},
{"id": 91,"chapter": "General","question": "ما أهمية العمل؟","options": ["فشل", "نجاح", "خوف", "حرب"],"answer": "نجاح"},
{"id": 92,"chapter": "General","question": "ما معنى 'المجتمع'؟","options": ["فرد", "مجموعة", "بيت", "مدرسة"],"answer": "مجموعة"},
{"id": 93,"chapter": "General","question": "ما نتيجة الصدق؟","options": ["فشل", "ثقة", "خوف", "حرب"],"answer": "ثقة"},
{"id": 94,"chapter": "General","question": "ما نتيجة الكذب؟","options": ["ثقة", "فقدان الثقة", "نجاح", "راحة"],"answer": "فقدان الثقة"},
{"id": 95,"chapter": "General","question": "ما أهمية الوقت؟","options": ["غير مهم", "مهم", "ضعيف", "لا شيء"],"answer": "مهم"},
{"id": 96,"chapter": "General","question": "ما معنى 'الصبر'؟","options": ["غضب", "تحمل", "خوف", "لعب"],"answer": "تحمل"},
{"id": 97,"chapter": "General","question": "ما نتيجة الاجتهاد؟","options": ["فشل", "نجاح", "خوف", "راحة"],"answer": "نجاح"},
{"id": 98,"chapter": "General","question": "ما معنى 'التعاون'؟","options": ["وحده", "عمل جماعي", "خوف", "حرب"],"answer": "عمل جماعي"},
{"id": 99,"chapter": "General","question": "ما أهمية الأخلاق؟","options": ["غير مهمة", "مهمة", "ضعيفة", "لا شيء"],"answer": "مهمة"},
{"id": 100,"chapter": "General","question": "ما الهدف من التعلم؟","options": ["اللعب", "التقدم", "الحرب", "النوم"],"answer": "التقدم"},
{"id": 101,"chapter": "نثارة العلم","question": "ما الفكرة الرئيسية للنص؟","options": ["المال", "أهمية العلم", "الحرب", "اللعب"],"answer": "أهمية العلم"},
{"id": 102,"chapter": "نثارة العلم","question": "كيف يمكن تحقيق نهضة المجتمع؟","options": ["الحرب", "التعليم", "اللعب", "السفر"],"answer": "التعليم"},
{"id": 103,"chapter": "نثارة العلم","question": "ما نتيجة الجهل في المجتمع؟","options": ["تقدم", "تخلف", "راحة", "سعادة"],"answer": "تخلف"},
{"id": 104,"chapter": "نثارة العلم","question": "لماذا أسست الجامعة الإسلامية؟","options": ["للترفيه", "لنشر العلم", "للربح", "للسفر"],"answer": "لنشر العلم"},
{"id": 105,"chapter": "نثارة العلم","question": "ما دور التعليم في حياة الإنسان؟","options": ["تقليل المعرفة", "تنمية الفكر", "زيادة الجهل", "تقليل العمل"],"answer": "تنمية الفكر"},
{"id": 106,"chapter": "المصابيح","question": "ما المغزى من تشبيه العلماء بالمصابيح؟","options": ["الزينة", "الهداية والنور", "المال", "الشهرة"],"answer": "الهداية والنور"},
{"id": 107,"chapter": "المصابيح","question": "كيف يؤثر العلم على الإنسان؟","options": ["يظلمه", "ينيره", "يضعفه", "يخيفه"],"answer": "ينيره"},
{"id": 108,"chapter": "المصابيح","question": "ما نتيجة غياب العلم؟","options": ["نور", "ظلام وجهل", "نجاح", "راحة"],"answer": "ظلام وجهل"},
{"id": 109,"chapter": "المصابيح","question": "ما أهمية العلماء؟","options": ["غير مهمة", "إرشاد المجتمع", "اللعب", "الراحة"],"answer": "إرشاد المجتمع"},
{"id": 110,"chapter": "المصابيح","question": "ما العلاقة بين العلم والجهل؟","options": ["متشابهة", "متناقضة", "ضعيفة", "لا علاقة"],"answer": "متناقضة"},
{"id": 111,"chapter": "في المصرف","question": "ما الهدف من الحوار في النص؟","options": ["السرد", "توضيح الإجراءات", "الترفيه", "الوصف"],"answer": "توضيح الإجراءات"},
{"id": 112,"chapter": "في المصرف","question": "لماذا طلب المدير الوثائق؟","options": ["للزينة", "للتحقق", "للعب", "للراحة"],"answer": "للتحقق"},
{"id": 113,"chapter": "في المصرف","question": "ما أهمية الحساب البنكي؟","options": ["اللعب", "تنظيم المال", "الراحة", "الزينة"],"answer": "تنظيم المال"},
{"id": 114,"chapter": "في المصرف","question": "ما نوع النص؟","options": ["قصة", "حوار", "شعر", "مقال"],"answer": "حوار"},
{"id": 115,"chapter": "في المصرف","question": "ما دور المدير؟","options": ["اللعب", "تقديم الإرشاد", "النوم", "السفر"],"answer": "تقديم الإرشاد"},
{"id": 116,"chapter": "صِرنا مُقترِضين","question": "ما سبب التوتر في الأسرة؟","options": ["العمل", "الدين", "اللعب", "السفر"],"answer": "الدين"},
{"id": 117,"chapter": "صِرنا مُقترِضين","question": "كيف أثرت الديون على الحياة؟","options": ["تحسينها", "تعقيدها", "تسهيلها", "لا شيء"],"answer": "تعقيدها"},
{"id": 118,"chapter": "صِرنا مُقترِضين","question": "ما النصيحة المستفادة؟","options": ["الإكثار من القروض", "تجنب الديون", "اللعب", "السفر"],"answer": "تجنب الديون"},
{"id": 119,"chapter": "صِرنا مُقترِضين","question": "ما نوع النص؟","options": ["شعر", "قصة", "مقال", "رسالة"],"answer": "قصة"},
{"id": 120,"chapter": "صِرنا مُقترِضين","question": "ما شعور الكاتب؟","options": ["فرح", "قلق", "راحة", "سعادة"],"answer": "قلق"},
{"id": 121,"chapter": "الصياد السعيد","question": "ما الفكرة الأساسية للنص؟","options": ["الغنى", "القناعة", "الحرب", "اللعب"],"answer": "القناعة"},
{"id": 122,"chapter": "الصياد السعيد","question": "كيف يحقق الإنسان السعادة؟","options": ["المال", "القناعة", "السفر", "اللعب"],"answer": "القناعة"},
{"id": 123,"chapter": "الصياد السعيد","question": "ما نوع النص؟","options": ["مقال", "قصة تعليمية", "شعر", "رسالة"],"answer": "قصة تعليمية"},
{"id": 124,"chapter": "الصياد السعيد","question": "ما الرسالة؟","options": ["المال مهم", "القناعة تجلب السعادة", "العمل فقط", "السفر"],"answer": "القناعة تجلب السعادة"},
{"id": 125,"chapter": "الصياد السعيد","question": "ما صفة الصياد؟","options": ["غني", "قنوع", "كسول", "خائف"],"answer": "قنوع"},
{"id": 126,"chapter": "General","question": "ما الهدف من النصوص التعليمية؟","options": ["اللعب", "التعلم", "السفر", "الحرب"],"answer": "التعلم"},
{"id": 127,"chapter": "General","question": "ما أهمية القراءة؟","options": ["الجهل", "زيادة المعرفة", "الخوف", "الفشل"],"answer": "زيادة المعرفة"},
{"id": 128,"chapter": "General","question": "ما نتيجة الاجتهاد؟","options": ["فشل", "نجاح", "خوف", "راحة"],"answer": "نجاح"},
{"id": 129,"chapter": "General","question": "ما أهمية الأخلاق؟","options": ["غير مهمة", "مهمة", "ضعيفة", "لا شيء"],"answer": "مهمة"},
{"id": 130,"chapter": "General","question": "ما معنى 'التعاون'؟","options": ["وحده", "عمل جماعي", "خوف", "حرب"],"answer": "عمل جماعي"},
{"id": 131,"chapter": "Grammar","question": "ما جمع 'علم'؟","options": ["علوم", "علم", "علمان", "عالم"],"answer": "علوم"},
{"id": 132,"chapter": "Grammar","question": "ما مفرد 'مصابيح'؟","options": ["مصباح", "مصابيح", "مصبحة", "مصابيحان"],"answer": "مصباح"},
{"id": 133,"chapter": "Grammar","question": "ما معنى 'نجح'؟","options": ["فشل", "نجح", "ذهب", "أكل"],"answer": "نجح"},
{"id": 134,"chapter": "Grammar","question": "ما نوع الجملة: 'الطالب ناجح'؟","options": ["فعلية", "اسمية", "شرطية", "تعجب"],"answer": "اسمية"},
{"id": 135,"chapter": "Grammar","question": "ما نوع الجملة: 'كتب الطالب'؟","options": ["اسمية", "فعلية", "تعجب", "سؤال"],"answer": "فعلية"},
{"id": 136,"chapter": "Grammar","question": "ما معنى 'قرأ'؟","options": ["كتب", "قرأ", "ذهب", "أكل"],"answer": "قرأ"},
{"id": 137,"chapter": "Grammar","question": "ما جمع 'بيت'؟","options": ["بيوت", "بيت", "بيتان", "بيتي"],"answer": "بيوت"},
{"id": 138,"chapter": "Grammar","question": "ما معنى 'تعلم'؟","options": ["لعب", "درس", "نام", "أكل"],"answer": "درس"},
{"id": 139,"chapter": "Grammar","question": "ما نوع 'مدرسة'؟","options": ["فعل", "اسم", "حرف", "عدد"],"answer": "اسم"},
{"id": 140,"chapter": "Grammar","question": "ما معنى 'ذهب'؟","options": ["جاء", "ذهب", "أكل", "شرب"],"answer": "ذهب"},
{"id": 141,"chapter": "General","question": "ما أهمية الصدق؟","options": ["سيء", "مهم", "ضعيف", "لا شيء"],"answer": "مهم"},
{"id": 142,"chapter": "General","question": "ما نتيجة الكذب؟","options": ["ثقة", "فقدان الثقة", "نجاح", "راحة"],"answer": "فقدان الثقة"},
{"id": 143,"chapter": "General","question": "ما أهمية الوقت؟","options": ["غير مهم", "مهم", "ضعيف", "لا شيء"],"answer": "مهم"},
{"id": 144,"chapter": "General","question": "ما معنى 'الصبر'؟","options": ["غضب", "تحمل", "خوف", "لعب"],"answer": "تحمل"},
{"id": 145,"chapter": "General","question": "ما نتيجة الاجتهاد؟","options": ["فشل", "نجاح", "خوف", "راحة"],"answer": "نجاح"},
{"id": 146,"chapter": "General","question": "ما أهمية التعليم؟","options": ["الجهل", "التقدم", "الخوف", "الحرب"],"answer": "التقدم"},
{"id": 147,"chapter": "General","question": "ما معنى 'النجاح'؟","options": ["الفشل", "تحقيق الهدف", "الخوف", "اللعب"],"answer": "تحقيق الهدف"},
{"id": 148,"chapter": "General","question": "ما أهمية التعاون؟","options": ["الفشل", "النجاح", "الخوف", "الحرب"],"answer": "النجاح"},
{"id": 149,"chapter": "General","question": "ما معنى 'المجتمع'؟","options": ["فرد", "مجموعة الناس", "بيت", "مدرسة"],"answer": "مجموعة الناس"},
{"id": 150,"chapter": "General","question": "ما الهدف من التعلم؟","options": ["اللعب", "التقدم", "الحرب", "النوم"],"answer": "التقدم"}
];

// Deduplicate based on question text
const uniqueMap = new Map();
for (let item of rawData) {
    const normalizedQ = item.question.trim().toLowerCase();
    if (!uniqueMap.has(normalizedQ)) {
        uniqueMap.set(normalizedQ, item);
    }
}
const uniqueQuestionsData = Array.from(uniqueMap.values());
console.log(`Prepared ${uniqueQuestionsData.length} unique questions out of ${rawData.length} raw questions.`);

const parsedQuestions = [];

for (let item of uniqueQuestionsData) {
    const correctIndex = item.options.indexOf(item.answer);
    if (correctIndex === -1) {
        console.warn(`Warning: answer "${item.answer}" not found in options for question: "${item.question}"`);
    }

    const baseQuestion = {
        question: item.question,
        options: item.options,
        correctIndex: correctIndex !== -1 ? correctIndex : 0,
        level: 1,
        board: "Kerala State",
        class: "10th (SSLC)",
        subject: "Arabic Oriental",
        chapter: item.chapter
    };

    parsedQuestions.push({ ...baseQuestion, medium: "English" });
    parsedQuestions.push({ ...baseQuestion, medium: "Malayalam" });
}

async function seedArabicOrientalSSLC() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const q of parsedQuestions) {
            const exists = await Question.findOne({
                question: q.question,
                subject: q.subject,
                chapter: q.chapter,
                medium: q.medium,
                board: q.board,
                class: q.class
            });

            if (!exists) {
                await Question.create(q);
                console.log(`Added: [${q.medium}] [${q.subject}] ${q.question.substring(0, 40)}...`);
            } else {
                console.log(`Skipped (Duplicate): [${q.medium}] ${q.question.substring(0, 40)}...`);
            }
        }

        console.log('Arabic Oriental SSLC seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedArabicOrientalSSLC();
