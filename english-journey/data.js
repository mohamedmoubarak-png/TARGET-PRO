// ===== المحتوى =====
const W={
1:{t:'اعرف مستواك وابدأ صح',g:'أساس الجملة · الحاضر البسيط والمستمر',p:'ليه الإنجليزي بيتنطق غير ما بيتكتب · أصوات P و V و TH',v:'أول 200 كلمة من Oxford 3000 (A1/A2) · كلمات التعارف والشغل',l:'6 Minute English: حلقة كل يوم',task:['اختبار EF SET عشان تعرف بدايتك','ابدأ بطاقات الكلمات في التطبيق (15 جديدة كل يوم) وضيف 10 كلمات من شغلك','تسجيل نفسك دقيقتين: عرّف نفسك وشغلك'],ck:'تعرّف نفسك وشغلك في دقيقتين من غير ما توقف'},
2:{t:'الماضي',g:'الماضي البسيط والمستمر · used to · الأفعال الشاذة',p:'الحروف الصامتة',v:'+200 كلمة · أشهر 50 فعل شاذ',l:'6 Minute English + LearnEnglish (A2 listening)',task:['قصة متدرجة مستوى 2 (حوالي 10 صفحات)','إيميل 100 كلمة عن يوم في الشغل','تحكي إجازة فاتت في 3 دقايق'],ck:'تحكي حاجة حصلت في الماضي بالأزمنة الصح'},
3:{t:'المضارع التام',g:'الأزمنة التامة · since و for · الضماير والملكية',p:'المتحركة القصيرة والطويلة',v:'+200 كلمة · كلمات الفلوس والحسابات',l:'VOA Learning English: خبر كل يوم',task:['20 جملة بـ have/has + V3 عن خبراتك','قصة متدرجة: كمّل الكتاب','5 أسئلة وتجاوبها: Have you ever ...?'],ck:'تفرق بين I saw و I have seen من غير تفكير'},
4:{t:'المستقبل + أول تقييم',g:'المستقبل · in / on / at · الأدوات والكميات',p:'صوت الـ Schwa · نطق ed و s',v:'+200 كلمة (مجموع 800)',l:'6 Minute English بسرعة عادية من غير النص',task:['اختبار EF SET تاني وقارن','كتابة خطتك للشهر الجاي (150 كلمة)','تسجيل 3 دقايق عن خططك'],ck:'مستوى A2 قوي / B1 بداية في الاختبار'},
5:{t:'الوصف والمقارنة',g:'الصفات والظروف والمقارنة · الأفعال الناقصة',p:'الضغط على المقطع',v:'+200 كلمة · عبارات خدمة العملاء',l:'LearnEnglish (B1 listening)',task:['تقارن بين منتجين في البنك كتابة (150 كلمة)','20 عبارة مؤدبة: Could you ..., Would you mind ...','مكالمة عميل تجريبية معايا'],ck:'تشرح لعميل الفرق بين منتجين'},
6:{t:'المبني للمجهول',g:'المبني للمجهول · الأسئلة وذيل السؤال',p:'كلمات بتتقال غلط كتير',v:'+200 كلمة (مجموع 1200)',l:'أخبار VOA بالسرعة العادية',task:['تكتب خطوات فتح حساب بالمجهول (is opened, is signed)','رد على شكوى عميل بإيميل رسمي','shadowing لحلقة كاملة'],ck:'تكتب إيميل رسمي واضح من غير أخطاء كبيرة'},
7:{t:'الشرط',g:'جمل الشرط 0 و1 و2 · wish',p:'الكلام المتصل والكلمات الضعيفة',v:'+200 كلمة · Oxford 3000 مستوى B1',l:'بودكاست بسرعة طبيعية (اختار موضوع بتحبه)',task:['10 جمل If I were ... عن نفسك','مقالة رأي قصيرة 150 كلمة على Write & Improve','نقاش 5 دقايق معايا عن موضوع'],ck:'تستخدم الشرط الأول والتاني صح في الكلام'},
8:{t:'الكلام المنقول + تقييم تاني',g:'الكلام المنقول · جمل الوصل',p:'أخطاء المصريين الشائعة (مراجعة)',v:'+200 كلمة (مجموع 1600)',l:'حلقة مسلسل بترجمة إنجليزي',task:['اختبار EF SET','تلخّص مكالمة أو اجتماع بالكلام المنقول','تسجيل 4 دقايق ومقارنته بتسجيل أسبوع 1'],ck:'B1 واضح في الاختبار'},
9:{t:'الشرط التالت والمصدر',g:'الشرط التالت · ing ولا to',p:'تنغيم الأسئلة والجمل',v:'Oxford 5000 مستوى B2 (150 كلمة)',l:'TED talk كل يومين بالنص',task:['تكتب عن قرار ندمت عليه (would have)','25 فعل بعده ing أو to في بطاقات','تلخيص TED talk بصوتك في دقيقتين'],ck:'تفهم 60% من TED من غير ترجمة'},
10:{t:'الكتابة المنظمة',g:'أدوات الربط · بناء الفقرة والمقال',p:'shadowing مكثف',v:'+150 كلمة B2 · أدوات الربط',l:'BBC News قصير',task:['مقالتين رأي 250 كلمة على Write & Improve','تكتب نفس المقالة مرتين: عادي ورسمي','نقاش معايا: مع وضد'],ck:'مقالة 250 كلمة فيها مقدمة وفقرات وخاتمة'},
11:{t:'لغة الشغل',g:'Phrasal verbs (أهم 60) · Collocations · رسمي ولا عادي',p:'كلمات البنك: mortgage, debt, certificate',v:'إنجليزي البنك من Professional English in Use: Finance',l:'فيديوهات عن البنوك والتمويل',task:['3 مكالمات عميل تجريبية معايا','قائمة 50 عبارة للشغل','تشرح منتج بنكي في 3 دقايق'],ck:'تخدم عميل أجنبي في الفرع بثقة'},
12:{t:'المراجعة والاختبار النهائي',g:'مراجعة كل دروس المذكرة + الامتحان السريع',p:'مراجعة الكبسولة',v:'مراجعة كل البطاقات · مجموع حوالي 2000 كلمة',l:'حلقة أو فيلم من غير ترجمة عربي',task:['EF SET الكامل (50 دقيقة)','عرض تقديمي 5 دقايق مسجل عن شغلك','تقارن تسجيل أسبوع 1 بأسبوع 12 وتحدد خطة الشهر الرابع'],ck:'B1+ / B2 حسب ساعاتك'},
};
// روابط الدروس في المذكرات لكل أسبوع
const LINKS={1:{g:['s1','s2'],p:['p1','p2']},2:{g:['s3'],p:['p3']},3:{g:['s4','s7'],p:['p4']},4:{g:['s5','s9','s6'],p:['p5','p6','p7']},
5:{g:['s8','s10'],p:['p8']},6:{g:['s11','s16'],p:['p9']},7:{g:['s12'],p:['p10']},8:{g:['s13','s14'],p:['p11']},
9:{g:['s12','s15'],p:['p10']},10:{g:['s17'],p:['p2']},11:{g:['s18'],p:['p9']},12:{g:['quiz'],p:['quiz']}};
const GNAMES={s1:'أساس الجملة',s2:'الحاضر البسيط والمستمر',s3:'الماضي و used to',s4:'الأزمنة التامة',s5:'المستقبل',s6:'الأدوات والكميات',s7:'الضماير',s8:'الصفات والمقارنة',s9:'in / on / at',s10:'الأفعال الناقصة',s11:'المبني للمجهول',s12:'الشرط و wish',s13:'الكلام المنقول',s14:'جمل الوصل',s15:'ing ولا to',s16:'الأسئلة وذيل السؤال',s17:'أدوات الربط',s18:'كلمات بتتلخبط',quiz:'الامتحان السريع'};
const PNAMES={p1:'الكتابة والنطق',p2:'الأصوات الجديدة',p3:'الحروف الصامتة',p4:'المتحركة',p5:'الـ Schwa',p6:'نطق ed',p7:'نطق s',p8:'الضغط',p9:'كلمات بتتقال غلط',p10:'الكلام المتصل',p11:'أخطاء المصريين',quiz:'اختبار النطق'};

// الروتين اليومي (المحاور)
const ROUTINE=[
 {k:'words',ax:'words',t:'الكلمات',d:'مراجعة البطاقات + الكلمات الجديدة',m:20},
 {k:'listen',ax:'listen',t:'الاستماع',d:'حلقة أو فيديو على مستواك، مرتين',m:30},
 {k:'grammar',ax:'grammar',t:'القواعد',d:'درس الأسبوع + اختبار المذكرة',m:30},
 {k:'read',ax:'read',t:'القراءة',d:'مقالة أو فصل من قصة متدرجة',m:30},
 {k:'speak',ax:'speak',t:'الكلام',d:'shadowing + تسجيل صوتك أو كلام معايا',m:20},
 {k:'write',ax:'write',t:'الكتابة',d:'5 جمل عن يومك في دفتر اليوميات',m:10},
];

// مصادر الاستماع والقراءة حسب المرحلة
const RES={
 listen:[
  {lv:'A2–B1',n:'BBC 6 Minute English',u:'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',d:'حلقات 6 دقايق بالنص'},
  {lv:'A2–B1',n:'British Council: Listening',u:'https://learnenglish.britishcouncil.org/skills/listening',d:'مقسمة بالمستوى ومعاها تمارين'},
  {lv:'B1',n:'VOA Learning English',u:'https://learningenglish.voanews.com',d:'أخبار بإنجليزي أبطأ'},
  {lv:'B1–B2',n:'TED Talks',u:'https://www.ted.com/talks',d:'محاضرات قصيرة بالنص الكامل'},
  {lv:'B2+',n:'BBC News',u:'https://www.bbc.com/news',d:'أخبار بالسرعة الطبيعية'},
 ],
 read:[
  {lv:'A2–B1',n:'British Council: Reading',u:'https://learnenglish.britishcouncil.org/skills/reading',d:'نصوص بالمستوى ومعاها أسئلة'},
  {lv:'B1',n:'VOA: Articles',u:'https://learningenglish.voanews.com',d:'نفس الخبر مكتوب ومسموع'},
  {lv:'B1–B2',n:'Oxford 3000/5000',u:'https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000',d:'قائمة الكلمات حسب المستوى'},
  {lv:'B2+',n:'BBC Worklife / Business',u:'https://www.bbc.com/business',d:'مقالات عن الشغل والفلوس'},
 ],
 tools:[
  {n:'EF SET',u:'https://www.efset.org',d:'اختبار مستوى مجاني'},
  {n:'Write & Improve',u:'https://writeandimprove.com',d:'تصحيح الكتابة من Cambridge'},
  {n:'YouGlish',u:'https://youglish.com',d:'اسمع الكلمة في فيديوهات حقيقية'},
  {n:'Cambridge Dictionary',u:'https://dictionary.cambridge.org',d:'معنى ونطق وأمثلة'},
 ]
};

// برومبتات للتدريب مع Claude
const PROMPTS=[
 {t:'محادثة كلام يومية',p:"Be my English speaking partner. My level is {LV}. Talk with me about my day and my job as a bank customer service employee. Ask one question at a time, keep your sentences simple, and after each of my answers show my mistakes and a better version of what I said."},
 {t:'مكالمة عميل تجريبية',p:"Role-play: you are a foreign customer at my bank branch who wants to open an account and ask about debit cards. I am the employee. Speak naturally at {LV} level. After 8 turns, stop and give me feedback on grammar, vocabulary and politeness."},
 {t:'موضوع الأسبوع',p:"This week I am studying: {G}. Give me 5 short exercises on it at {LV} level, one at a time, and explain my mistakes in Egyptian Arabic."},
 {t:'نقاش رأي',p:"Give me a simple opinion question at {LV} level. Wait for my answer (4-6 sentences), then correct it and show me a stronger version with 3 useful linking words."},
];

// كلمات البداية (الشغل والحياة اليومية) A2–B1
const STARTER=[
 ['account','حساب','I want to open a savings account.'],['balance','الرصيد','Can I check my balance, please?'],['deposit','إيداع / يودع','She deposited 5,000 pounds today.'],
 ['withdraw','يسحب','You can withdraw cash from the ATM.'],['transfer','تحويل / يحوّل','I need to transfer money to my brother.'],['fee','رسوم / مصاريف','There is a small fee for this service.'],
 ['loan','قرض','He applied for a personal loan.'],['interest rate','سعر العائد / الفائدة','The interest rate is fixed for one year.'],['installment','قسط','The monthly installment is 2,000 pounds.'],
 ['statement','كشف حساب','I can print your statement now.'],['branch','فرع','Our branch opens at 8:30.'],['customer','عميل','The customer is waiting at the counter.'],
 ['form','نموذج / استمارة','Please fill in this form.'],['sign','يمضي','Please sign here.'],['signature','إمضاء','Your signature does not match.'],
 ['ID card','بطاقة الرقم القومي','May I see your ID card?'],['valid','ساري','Your ID must be valid.'],['expired','منتهي','Your card has expired.'],
 ['apply for','يقدّم على','You can apply for a credit card online.'],['approve','يوافق على','The loan was approved yesterday.'],['reject','يرفض','The request was rejected.'],
 ['complaint','شكوى','We received your complaint.'],['solve','يحل','I will solve the problem for you.'],['wait','يستنى','Could you wait a moment, please?'],
 ['available','متاح','This service is available on the app.'],['require','يتطلب','This account requires a minimum balance.'],['receipt','إيصال','Here is your receipt.'],
 ['cash','نقدي / كاش','Do you want cash or a transfer?'],['currency','عملة','We exchange foreign currency here.'],['exchange rate','سعر الصرف','What is the exchange rate today?'],
 ['schedule','جدول / ميعاد','My schedule is very busy this week.'],['meeting','اجتماع','The meeting starts at ten.'],['manager','مدير','I will ask my manager.'],
 ['colleague','زميل','My colleague will help you.'],['deadline','آخر ميعاد','The deadline is on Thursday.'],['improve','يحسّن','I want to improve my English.'],
 ['practise','يتمرن','I practise speaking every day.'],['mistake','غلطة','Everyone makes mistakes.'],['explain','يشرح','Could you explain it again?'],
 ['understand','يفهم','I don\'t understand this word.'],['repeat','يكرر','Can you repeat that, please?'],['slowly','ببطء','Please speak slowly.'],
 ['advice','نصيحة','Can you give me some advice?'],['decide','يقرر','I decided to study every morning.'],['achieve','يحقق','You can achieve your goal.'],
 ['goal','هدف','My goal is to reach B2.'],['habit','عادة','Reading is a good habit.'],['experience','خبرة / تجربة','I have five years of experience.'],
 ['responsible for','مسئول عن','I am responsible for new accounts.'],['busy','مشغول','The branch is very busy today.'],['crowded','زحمة','The bank is crowded on Sundays.'],
 ['arrive','يوصل','The cards will arrive next week.'],['borrow','يستلف','Can I borrow your pen?'],['lend','يسلّف','Can you lend me your pen?'],
 ['afford','يقدر على تكلفة','I can\'t afford a new car now.'],['save','يوفّر / يدّخر','I save 10% of my salary.'],['salary','مرتب','My salary is transferred to the bank.'],
 ['retire','يطلع معاش','He retired last year.'],['pension','معاش','Her pension is paid monthly.'],['insurance','تأمين','The loan includes life insurance.'],
 ['certificate','شهادة','This certificate pays monthly interest.'],['term','مدة','The term of the loan is five years.'],['due date','تاريخ الاستحقاق','The due date is the 5th of every month.'],
 ['in advance','مقدمًا','Please book in advance.'],['as soon as possible','في أسرع وقت','I will call you as soon as possible.'],['by the way','على فكرة','By the way, your card is ready.'],
 // --- باقة 2: الحسابات والكروت والقروض ---
 ['current account','حساب جاري','I opened a current account for my salary.'],['savings account','حساب توفير','A savings account pays monthly interest.'],['debit card','كارت خصم مباشر','You can pay with your debit card.'],
 ['credit card','كارت ائتمان','Your credit card is ready.'],['credit limit','حد الائتمان','We can increase your credit limit.'],['PIN','الرقم السري','Never share your PIN with anyone.'],
 ['activate','يفعّل','You need to activate your card first.'],['block','يوقف / يقفل','Please block my card. I lost it.'],['lost','ضايع','I lost my wallet yesterday.'],
 ['stolen','مسروق','My phone was stolen.'],['charge','يخصم / رسوم','The bank will charge a small fee.'],['refund','استرداد الفلوس','You will get a refund in five days.'],
 ['overdraft','سحب على المكشوف','An overdraft has a high interest rate.'],['mortgage','قرض عقاري','They took a mortgage to buy a flat.'],['debt','دين / مديونية','He paid all his debt.'],
 ['repay','يسدد','You can repay the loan early.'],['guarantor','ضامن','You need a guarantor for this loan.'],['documents','أوراق / مستندات','Please bring the required documents.'],
 ['copy','صورة / نسخة','I need a copy of your ID.'],['proof of income','إثبات دخل','Do you have proof of income?'],['amount','مبلغ','What amount do you want to withdraw?'],
 ['limit','حد','The daily withdrawal limit is 30,000 pounds.'],['total','إجمالي','The total is 12,500 pounds.'],['monthly','شهري','The fee is charged monthly.'],
 ['annual','سنوي','The annual fee is 300 pounds.'],['profit','ربح / عائد','This certificate gives a fixed profit.'],['account number','رقم الحساب','Can you give me your account number?'],
 ['international transfer','تحويل دولي','An international transfer takes two days.'],['beneficiary','المستفيد','Please write the beneficiary name.'],['IBAN','رقم الآيبان','You need the IBAN for international transfers.'],
 // --- باقة 3: الديجيتال والأمان ---
 ['online banking','البنك أونلاين','You can transfer money with online banking.'],['mobile app','أبلكيشن الموبايل','Download our mobile app.'],['password','كلمة السر','Change your password every three months.'],
 ['code','كود','Enter the code you received by SMS.'],['confirm','يأكد','I will send you a code to confirm.'],['update','يحدّث','Please update your phone number.'],
 ['details','بيانات / تفاصيل','Can you check your details, please?'],['fraud','احتيال / نصب','We never ask for your password. That is fraud.'],['secure','آمن','Your data is secure with us.'],
 ['ATM','ماكينة الصراف','The ATM is next to the entrance.'],['out of service','عطلان / خارج الخدمة','Sorry, the machine is out of service.'],['system','السيستم','The system is slow today.'],
 // --- باقة 4: خدمة العملاء في الفرع ---
 ['queue','طابور','Please take a number and wait in the queue.'],['counter','الشباك','Please go to counter number three.'],['appointment','ميعاد / حجز','Do you have an appointment?'],
 ['urgent','مستعجل','Is it urgent?'],['request','طلب','Your request is under review.'],['under review','تحت المراجعة','Your application is under review.'],
 ['follow up','يتابع','I will follow up on your request.'],['contact','يتواصل مع','We will contact you within two days.'],['inform','يبلّغ','We will inform you by SMS.'],
 ['apologise','يعتذر','I apologise for the delay.'],['delay','تأخير','Sorry for the delay.'],['inconvenience','الإزعاج / اللخبطة','We apologise for any inconvenience.'],
 ['patience','صبر','Thank you for your patience.'],['feedback','رأي / تقييم','Thank you for your feedback.'],['assist','يساعد (رسمي)','I will be happy to assist you.'],
 ['certainly','أكيد / طبعًا','Certainly. One moment, please.'],['unfortunately','للأسف','Unfortunately, the system is down.'],['check','يراجع / يتأكد','Let me check that for you.'],
 ['process','يخلّص / إجراء','It takes three days to process your request.'],['issue','يصدر','We will issue a new card for you.'],['replace','يبدّل / يستبدل','We can replace your damaged card.'],
 ['damaged','بايظ / متضرر','The card is damaged.'],['collect','يستلم','You can collect your card next Sunday.'],['deliver','يوصّل','We deliver cards to your home.'],
 ['policy','سياسة / لوايح','It is against the bank policy.'],['allowed','مسموح','Photos are not allowed inside the branch.'],['offer','عرض / يعرض','We have a special offer this month.'],
 ['recommend','ينصح بـ / يرشّح','I recommend the three-year certificate.'],['compare','يقارن','Let me compare the two accounts for you.'],['option','اختيار','You have two options.'],
 ['suitable','مناسب','This card is suitable for travel.'],['benefit','ميزة / فايدة','The main benefit is the high return.'],['nationality','الجنسية','What is your nationality?'],
 ['passport','باسبور / جواز سفر','Foreign customers need a passport.'],['resident','مقيم','Are you a resident in Egypt?'],['abroad','برّه / في الخارج','My son works abroad.'],
 // --- باقة 5: الشغل ---
 ['branch manager','مدير الفرع','The branch manager will see you now.'],['shift','وردية / شيفت','My shift starts at eight.'],['training','تدريب','I have a training course next week.'],
 ['promotion','ترقية','She got a promotion last month.'],['target','تارجت / مستهدف','We reached our monthly target.'],['report','تقرير','I send a report to my manager every week.'],
];
