import type { Locale } from "./locale";

export type UiCopy = {
  loadingScene: string;
  joinAsOperator: string;
  requestService: string;
  mainNav: string;
  openMenu: string;
  closeMenu: string;
  menu: string;
  langSwitchTo: string;
  langLabel: string;
  navHome: string;
  orderNow: string;
  operatorLevelsTitle: string;
  operatorLevelsBody: string;
  highRiskTitle: string;
  highRiskBody: string;
  scrollHint: string;
  stageOf: (current: number, total: number) => string;
  phaseOf: (current: number, total: number) => string;
  stepAria: (num: string) => string;
  journeyCta: string;
  journeyDetails: string;
  mapAria: string;
  stagesAria: string;
  storyTagline: string;
  heroCards: { title: string; body: string }[];
  hoursWithin: string;
  contactChannelsTitle: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  contactWhatsappLabel: string;
  contactFacebook: string;
  contactInstagram: string;
  contactTwitter: string;
  contactLinkedin: string;
  whatsappFloat: string;
  whatsappPrefill: string;
  developedByPrefix: string;
  developerName: string;
  entry: {
    pageTitle: string;
    pageSubtitle: string;
    rolesAria: string;
  };
  form: {
    iAm: string;
    pickRole: string;
    basicInfo: string;
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    city: string;
    service: string;
    pickService: string;
    operatingSector: string;
    pickOperatingSector: string;
    fleetTitle: string;
    licenseTitle: string;
    licenseLabel: string;
    licenseHint: string;
    licenseChoose: string;
    licenseChange: string;
    licenseRequired: string;
    licenseInvalid: string;
    licenseTooLarge: string;
    extraDetails: string;
    notes: string;
    notesPlaceholder: string;
    submit: string;
    submitting: string;
    privacy: string;
    pickRoleFirst: string;
    submitFail: string;
    networkFail: string;
    successCustomer: string;
    successOperator: (count: number) => string;
    roles: {
      customer: { value: string; label: string; hint: string };
      operator: { value: string; label: string; hint: string };
    };
  };
  fleet: {
    intro: string;
    count: (n: number) => string;
    aircraftN: (n: number) => string;
    remove: string;
    unlisted: string;
    customManufacturer: string;
    customManufacturerPh: string;
    customModel: string;
    customModelPh: string;
    reviewNote: string;
    manufacturer: string;
    manufacturerPh: string;
    manufacturerEmpty: string;
    model: string;
    modelPh: string;
    modelPhDisabled: string;
    modelEmpty: string;
    add: string;
    addAnother: string;
    otherManufacturer: string;
    needOne: string;
    completeAll: string;
    enterManufacturer: string;
    enterModel: string;
    pickManufacturer: string;
    pickModel: string;
    serialNumber: string;
    usageType: string;
    pickUsage: string;
    usageRequired: string;
  };
  operatorJoin: {
    pageTitle: string;
    pageSubtitle: string;
    stepsTitle: string;
    stepsSubtitle: string;
    stepBasic: string;
    stepLicense: string;
    stepFleet: string;
    stepReview: string;
    stepOf: (current: number, total: number) => string;
    roleOperatorTitle: string;
    roleOperatorHint: string;
    roleCustomerTitle: string;
    roleCustomerHint: string;
    basicTitle: string;
    basicBody: string;
    draftHint: string;
    saveDraft: string;
    draftSaved: string;
    nextLicense: string;
    nextFleet: string;
    nextReview: string;
    prevBasic: string;
    prevLicense: string;
    prevFleet: string;
    licenseTitle: string;
    licenseBody: string;
    licenseDrop: string;
    licenseReplace: string;
    licenseDelete: string;
    licenseSuccess: string;
    licenseNumber: string;
    licenseExpiry: string;
    licenseTip: string;
    reuploadLicense: string;
    fleetTitle: string;
    fleetBody: string;
    fleetTip: string;
    reviewTitle: string;
    reviewBody: string;
    reviewBasic: string;
    reviewLicense: string;
    reviewFleet: string;
    edit: string;
    agreePrefix: string;
    privacyPolicy: string;
    andWord: string;
    terms: string;
    reviewTip: string;
    submitJoin: string;
    successTitle: string;
    successBody: string;
    requestId: (id: string) => string;
    backHome: string;
    leaveWarn: string;
    clearFields: string;
    clearConfirm: string;
    requiredMark: string;
    errFullName: string;
    errPhone: string;
    errEmail: string;
    errSector: string;
    errOrganization: string;
    orgEntity: string;
    orgIndividual: string;
    errLicenseFile: string;
    errAgree: string;
    noFile: string;
  };
  serviceRequest: {
    pageTitle: string;
    pageSubtitle: string;
    sidebarTitle: string;
    sidebarBody: string;
    trust1: string;
    trust2: string;
    trust3: string;
    contactTitle: string;
    contactBody: string;
    detailsTitle: string;
    detailsBody: string;
    missionDetails: string;
    missionHint: string;
    agree: string;
    agreeBefore: string;
    agreeAfter: string;
    privacyLink: string;
    lockNote: string;
    submit: string;
    submitting: string;
    clear: string;
    clearConfirm: string;
    successTitle: string;
    successBody: string;
    requestId: (id: string) => string;
    backHome: string;
    anotherRequest: string;
    errFullName: string;
    errPhone: string;
    errEmail: string;
    errService: string;
    errAgree: string;
    requiredMark: string;
  };
  storyStages: {
    label: string;
    title: string;
    body: string;
  }[];
};

const ar: UiCopy = {
  loadingScene: "جاري تحميل المشهد…",
  joinAsOperator: "انضم كمشغّل",
  requestService: "اطلب خدمة",
  mainNav: "التنقل الرئيسي",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  menu: "القائمة",
  langSwitchTo: "English",
  langLabel: "العربية",
  navHome: "الرئيسية",
  orderNow: "اطلب الآن",
  operatorLevelsTitle: "مستويات التأهيل",
  operatorLevelsBody:
    "نصنّف المشغّلين بما هم مؤهّلون لتنفيذه، لا بما يملكونه من معدات.",
  highRiskTitle: "الخدمات عالية المخاطر",
  highRiskBody:
    "تنظيف الواجهات والرش الزراعي ليسا كتصوير عقار. تُسنَد هذه الخدمات حصراً لمشغّلي المستوى المتخصص، وتتطلب دراسة سلامة تشغيلية وتصريحاً خاصاً ومهلة تنفيذ أطول. نصرّح بذلك منذ لحظة الطلب بدل الوعد بالسرعة ثم الاعتذار لاحقاً.",
  scrollHint: "تابع التمرير",
  stageOf: (current, total) => `المرحلة ${current} من ${total}`,
  phaseOf: (current, total) =>
    `المرحلة ${String(current).padStart(2, "0")} من ${String(total).padStart(2, "0")}`,
  stepAria: (num) => `الخطوة ${num}`,
  journeyCta: "ابدأ بطلب خدمتك",
  journeyDetails: "اعرف تفاصيل الرحلة",
  mapAria: "خريطة السعودية المتحركة",
  stagesAria: "مراحل الرحلة",
  storyTagline: "منصة خدمات الطائرات المسيّرة — اطلب الخدمة ونحن نذهب إليها",
  heroCards: [
    {
      title: "طلب محدد",
      body: "تحدد متطلبات المهمة وموقعها وموعدها",
    },
    {
      title: "مشغّل مؤهّل",
      body: "نرشّح مشغّلين مؤهّلين ومعتمدين",
    },
    {
      title: "نتيجة موثقة",
      body: "تنفيذ موثّق وتقرير جاهز",
    },
  ],
  hoursWithin: "خلال ساعات",
  contactChannelsTitle: "قنوات التواصل",
  contactEmailLabel: "البريد الإلكتروني",
  contactPhoneLabel: "الجوال",
  contactWhatsappLabel: "واتساب",
  contactFacebook: "فيسبوك",
  contactInstagram: "إنستغرام",
  contactTwitter: "إكس",
  contactLinkedin: "لينكدإن",
  whatsappFloat: "تواصل عبر واتساب",
  whatsappPrefill: "مرحباً، أود الاستفسار عن خدمات شاغم.",
  developedByPrefix: "تم تطويرها من خلال",
  developerName: "نجد القمم",
  entry: {
    pageTitle: "ابدأ طلبك",
    pageSubtitle: "اختر إن كنت عميلاً أو مشغّلاً ثم أكمل البيانات.",
    rolesAria: "اختيار نوع الطلب",
  },
  form: {
    iAm: "أنا *",
    pickRole: "اختر نوع الطلب لإظهار الحقول المناسبة.",
    basicInfo: "البيانات الأساسية",
    fullName: "الاسم الكامل *",
    organization: "جهة العمل",
    phone: "رقم الجوال *",
    email: "البريد الإلكتروني *",
    city: "المدينة",
    service: "الخدمة المطلوبة *",
    pickService: "اختر خدمة",
    operatingSector: "قطاع التشغيل *",
    pickOperatingSector: "اختر قطاع التشغيل",
    fleetTitle: "بيانات أسطول الطائرات",
    licenseTitle: "الرخصة",
    licenseLabel: "رفع الرخصة *",
    licenseHint: "PDF أو صورة (JPG / PNG) — بحد أقصى ١٠ ميجابايت",
    licenseChoose: "اختر ملف الرخصة",
    licenseChange: "تغيير الملف",
    licenseRequired: "ارفع ملف الرخصة للمتابعة.",
    licenseInvalid: "صيغة الملف غير مدعومة. استخدم PDF أو JPG أو PNG.",
    licenseTooLarge: "حجم الملف كبير جدًا. الحد الأقصى ١٠ ميجابايت.",
    extraDetails: "تفاصيل إضافية",
    notes: "ملاحظات (اختياري)",
    notesPlaceholder: "أي تفاصيل تساعدنا على خدمتك بشكل أفضل…",
    submit: "إرسال الطلب",
    submitting: "جاري الإرسال…",
    privacy:
      "بإرسالك النموذج توافق على سياسة الخصوصية ومعالجة بياناتك لغرض الرد على طلبك.",
    pickRoleFirst: "اختر نوع الطلب أولًا.",
    submitFail: "تعذر إرسال الطلب. حاول مرة أخرى.",
    networkFail: "تعذر الاتصال بالخادم. حاول مرة أخرى.",
    successCustomer: "تم استلام طلبك بنجاح. سيتواصل معك فريقنا قريبًا.",
    successOperator: (count) =>
      `تم استلام طلبك مع أسطول من ${count} طائرة. سيتواصل معك فريقنا قريبًا.`,
    roles: {
      customer: {
        value: "عميل أبحث عن خدمة",
        label: "عميل",
        hint: "أحتاج خدمة درون",
      },
      operator: {
        value: "مشغّل طائرات مسيّرة",
        label: "مشغّل",
        hint: "أقدّم خدمات الدرون",
      },
    },
  },
  fleet: {
    intro: "أضف الطائرات التي تشغّلها وحدد الشركة المصنّعة والموديل لكل طائرة.",
    count: (n) => `عدد الطائرات: ${n}`,
    aircraftN: (n) => `الطائرة ${String(n).padStart(2, "0")}`,
    remove: "حذف",
    unlisted: "الشركة أو الموديل غير موجود في القائمة",
    customManufacturer: "اسم الشركة المصنّعة *",
    customManufacturerPh: "اكتب اسم الشركة",
    customModel: "نوع / موديل الطائرة *",
    customModelPh: "اكتب الموديل",
    reviewNote: "ستُرسل للمراجعة ولن تُضاف تلقائيًا إلى القائمة المرجعية.",
    manufacturer: "الشركة المصنّعة *",
    manufacturerPh: "ابحث عن الشركة…",
    manufacturerEmpty: "لا توجد شركة مطابقة",
    model: "نوع / موديل الطائرة *",
    modelPh: "ابحث عن الموديل…",
    modelPhDisabled: "اختر الشركة أولًا",
    modelEmpty: "لا يوجد موديل مطابق لهذه الشركة",
    add: "＋ إضافة طائرة",
    addAnother: "＋ إضافة طائرة أخرى",
    otherManufacturer: "أخرى",
    needOne: "أضف طائرة واحدة على الأقل مع الشركة والموديل.",
    completeAll: "أكمل بيانات كل طائرة أو احذف البطاقات غير المكتملة.",
    enterManufacturer: "أدخل اسم الشركة المصنّعة.",
    enterModel: "أدخل موديل الطائرة.",
    pickManufacturer: "اختر الشركة المصنّعة.",
    pickModel: "اختر موديل الطائرة.",
    serialNumber: "الرقم التسلسلي",
    usageType: "نوع الاستخدام *",
    pickUsage: "اختر نوع الاستخدام",
    usageRequired: "اختر نوع الاستخدام.",
  },
  operatorJoin: {
    pageTitle: "انضم كمشغّل",
    pageSubtitle: "سجّل بياناتك وانضم إلى شبكة مشغّلي الطائرات المسيّرة.",
    stepsTitle: "خطوات التسجيل",
    stepsSubtitle: "4 خطوات بسيطة لإكمال تسجيلك",
    stepBasic: "البيانات الأساسية",
    stepLicense: "الرخصة",
    stepFleet: "أسطول الطائرات",
    stepReview: "المراجعة والإرسال",
    stepOf: (current, total) => `الخطوة ${current} من ${total}`,
    roleOperatorTitle: "مشغّل",
    roleOperatorHint: "أقدّم خدمات الدرون",
    roleCustomerTitle: "عميل",
    roleCustomerHint: "أحتاج خدمة درون",
    basicTitle: "البيانات الأساسية",
    basicBody: "يرجى إدخال بياناتك الأساسية بدقة لمتابعة التسجيل",
    draftHint: "يمكنك حفظ الطلب واستكماله لاحقًا",
    saveDraft: "حفظ كمسودة",
    draftSaved: "تم حفظ المسودة محليًا على هذا الجهاز.",
    nextLicense: "التالي: رفع الرخصة",
    nextFleet: "التالي: أسطول الطائرات",
    nextReview: "التالي: المراجعة",
    prevBasic: "السابق: البيانات الأساسية",
    prevLicense: "السابق: الرخصة",
    prevFleet: "السابق: أسطول الطائرات",
    licenseTitle: "رفع الرخصة",
    licenseBody: "ارفع رخصة التشغيل المعتمدة للتحقق من بياناتك",
    licenseDrop: "اسحب ملف الرخصة هنا أو اضغط لاختيار الملف",
    licenseReplace: "استبدال",
    licenseDelete: "حذف",
    licenseSuccess: "تم الرفع بنجاح",
    licenseNumber: "رقم الرخصة",
    licenseExpiry: "تاريخ انتهاء الرخصة",
    licenseTip: "تأكد من أن الرخصة سارية وواضحة قبل المتابعة",
    reuploadLicense: "بعد التحديث، أعد رفع ملف الرخصة للمتابعة.",
    fleetTitle: "أسطول الطائرات",
    fleetBody:
      "أضف الطائرات التي تشغّلها وحدد الشركة المصنّعة والموديل لكل طائرة",
    fleetTip: "يمكنك إضافة جميع الطائرات المسجّلة ضمن أسطولك.",
    reviewTitle: "مراجعة الطلب وإرساله",
    reviewBody: "راجع بياناتك جيدًا قبل إرسال طلب الانضمام",
    reviewBasic: "البيانات الأساسية",
    reviewLicense: "الرخصة",
    reviewFleet: "أسطول الطائرات",
    edit: "تعديل",
    agreePrefix: "أقر بصحة البيانات وأوافق على",
    privacyPolicy: "سياسة الخصوصية",
    andWord: "و",
    terms: "الشروط والأحكام",
    reviewTip: "سيتم مراجعة طلبك والتواصل معك بعد التحقق من البيانات",
    submitJoin: "إرسال طلب الانضمام",
    successTitle: "تم إرسال طلبك بنجاح",
    successBody: "سنراجع بياناتك ونتواصل معك بعد اكتمال التحقق",
    requestId: (id) => `رقم الطلب: ${id}`,
    backHome: "العودة إلى الرئيسية",
    leaveWarn: "لديك تعديلات غير محفوظة. هل تريد مغادرة الصفحة؟",
    clearFields: "مسح الحقول",
    clearConfirm: "هل تريد مسح جميع البيانات المدخلة والمسودة المحفوظة؟",
    requiredMark: "*",
    errFullName: "الاسم الكامل مطلوب.",
    errPhone: "أدخل رقم جوال سعودي صحيح.",
    errEmail: "أدخل بريدًا إلكترونيًا صحيحًا.",
    errSector: "اختر قطاع التشغيل.",
    errOrganization: "اختر كيان أو فرد.",
    orgEntity: "كيان",
    orgIndividual: "فرد",
    errLicenseFile: "ارفع ملف رخصة صالحًا للمتابعة.",
    errAgree: "يجب الموافقة على السياسة والشروط قبل الإرسال.",
    noFile: "لا يوجد ملف",
  },
  serviceRequest: {
    pageTitle: "اطلب خدمة درون",
    pageSubtitle: "أخبرنا عن مهمتك وسنوصلك بالمشغّل الأنسب",
    sidebarTitle: "طلبك يبدأ من هنا",
    sidebarBody: "املأ بيانات المهمة وسنرشّح لك المشغّل الأنسب",
    trust1: "مشغّلون معتمدون",
    trust2: "مطابقة حسب موقع المهمة",
    trust3: "بياناتك محفوظة",
    contactTitle: "بيانات التواصل",
    contactBody: "أدخل بياناتك ليتواصل معك المشغّل المناسب",
    detailsTitle: "تفاصيل الخدمة",
    detailsBody: "أخبرنا بما تحتاجه حتى نرشّح لك الخدمة والمشغّل المناسبين",
    missionDetails: "تفاصيل المهمة",
    missionHint: "صف لنا المهمة والموقع وأي متطلبات خاصة",
    agree: "أوافق على سياسة الخصوصية واستخدام بياناتي للرد على طلبي",
    agreeBefore: "أوافق على ",
    agreeAfter: " واستخدام بياناتي للرد على طلبي",
    privacyLink: "سياسة الخصوصية",
    lockNote: "بياناتك محفوظة وتُستخدم للتواصل بشأن طلبك فقط",
    submit: "إرسال طلب الخدمة",
    submitting: "جارٍ إرسال الطلب...",
    clear: "مسح الحقول",
    clearConfirm: "هل تريد مسح جميع البيانات المدخلة؟",
    successTitle: "تم إرسال طلبك بنجاح",
    successBody: "استلمنا تفاصيل طلبك وسنتواصل معك بعد اختيار المشغّل المناسب",
    requestId: (id) => `رقم الطلب: ${id}`,
    backHome: "العودة إلى الرئيسية",
    anotherRequest: "إرسال طلب آخر",
    errFullName: "الاسم الكامل مطلوب.",
    errPhone: "أدخل رقم جوال سعودي صحيح.",
    errEmail: "أدخل بريدًا إلكترونيًا صحيحًا.",
    errService: "اختر الخدمة المطلوبة.",
    errAgree: "يجب الموافقة على سياسة الخصوصية قبل الإرسال.",
    requiredMark: "*",
  },
  storyStages: [
    {
      label: "تحديد الطلب",
      title: "نقف بين الاحتياج والتنفيذ",
      body: "كيف نصبح الطرف الذي يقف بين الاحتياج والتنفيذ، ويتحمّل مسؤولية العملية من أول طلب حتى آخر فاتورة.",
    },
    {
      label: "اختيار المشغّل",
      title: "نختار المشغّل الأنسب لمهمتك",
      body: "نطابق نوع الخدمة وموقع التنفيذ مع مشغّل موثوق، ثم يبدأ الدرون رحلته إلى موقع المهمة — مع بقائنا بلا كلل في مطابقة التراخيص والتأمين.",
    },
    {
      label: "تنفيذ المهمة",
      title: "نتابع التنفيذ حتى معيار الإنجاز",
      body: "بأن نبقى بلا كلل في مطابقة المشغّل المؤهَّل، والتصريح الساري، ومعيار الإنجاز المتفق عليه أثناء تنفيذ المهمة.",
    },
    {
      label: "اكتمال الطلب",
      title: "تغطية داخل المملكة… حتى الاستلام",
      body: "شاغم منصة خدمات الطائرات المسيّرة — تغطية داخل المملكة من الرياض إلى جدة والدمام وكل المدن.",
    },
  ],
};

const en: UiCopy = {
  loadingScene: "Loading the scene…",
  joinAsOperator: "Join as operator",
  requestService: "Request a service",
  mainNav: "Main navigation",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menu: "Menu",
  langSwitchTo: "العربية",
  langLabel: "English",
  navHome: "Home",
  orderNow: "Order now",
  operatorLevelsTitle: "Qualification levels",
  operatorLevelsBody:
    "We classify operators by what they are cleared to fly—not just what equipment they own.",
  highRiskTitle: "High-risk services",
  highRiskBody:
    "Facade cleaning and agricultural spraying are not the same as property photography. These services are assigned only to specialist-level operators, and require an operational safety study, a special permit, and a longer lead time. We say so at the moment of request—rather than promising speed and apologizing later.",
  scrollHint: "Keep scrolling",
  stageOf: (current, total) => `Stage ${current} of ${total}`,
  phaseOf: (current, total) =>
    `Phase ${String(current).padStart(2, "0")} of ${String(total).padStart(2, "0")}`,
  stepAria: (num) => `Step ${num}`,
  journeyCta: "Start your request",
  journeyDetails: "See the journey details",
  mapAria: "Animated map of Saudi Arabia",
  stagesAria: "Journey stages",
  storyTagline: "Drone services platform — request the service, we go to it",
  heroCards: [
    {
      title: "Clear request",
      body: "You define the mission, location, and timing",
    },
    {
      title: "Qualified operator",
      body: "We match vetted, licensed operators",
    },
    {
      title: "Documented result",
      body: "Verified delivery and a ready report",
    },
  ],
  hoursWithin: "Within hours",
  contactChannelsTitle: "Contact channels",
  contactEmailLabel: "Email",
  contactPhoneLabel: "Phone",
  contactWhatsappLabel: "WhatsApp",
  contactFacebook: "Facebook",
  contactInstagram: "Instagram",
  contactTwitter: "X",
  contactLinkedin: "LinkedIn",
  whatsappFloat: "Chat on WhatsApp",
  whatsappPrefill: "Hi, I’d like to ask about Shagam services.",
  developedByPrefix: "Developed by",
  developerName: "Najid AL-Qimam",
  entry: {
    pageTitle: "Get started",
    pageSubtitle: "Choose whether you are a customer or an operator, then complete the details.",
    rolesAria: "Choose request type",
  },
  form: {
    iAm: "I am *",
    pickRole: "Choose a request type to show the right fields.",
    basicInfo: "Basic details",
    fullName: "Full name *",
    organization: "Organization",
    phone: "Mobile number *",
    email: "Email *",
    city: "City",
    service: "Required service *",
    pickService: "Select a service",
    operatingSector: "Operating sector *",
    pickOperatingSector: "Select operating sector",
    fleetTitle: "Aircraft fleet details",
    licenseTitle: "License",
    licenseLabel: "Upload license *",
    licenseHint: "PDF or image (JPG / PNG) — max 10 MB",
    licenseChoose: "Choose license file",
    licenseChange: "Change file",
    licenseRequired: "Please upload your license to continue.",
    licenseInvalid: "Unsupported file type. Use PDF, JPG, or PNG.",
    licenseTooLarge: "File is too large. Maximum size is 10 MB.",
    extraDetails: "Additional details",
    notes: "Notes (optional)",
    notesPlaceholder: "Anything that helps us serve you better…",
    submit: "Submit request",
    submitting: "Sending…",
    privacy:
      "By submitting, you agree to our privacy policy and to processing your data to respond to your request.",
    pickRoleFirst: "Please choose a request type first.",
    submitFail: "Could not submit. Please try again.",
    networkFail: "Could not reach the server. Please try again.",
    successCustomer: "Request received. Our team will contact you soon.",
    successOperator: (count) =>
      `Request received with a fleet of ${count} aircraft. Our team will contact you soon.`,
    roles: {
      customer: {
        value: "عميل أبحث عن خدمة",
        label: "Customer",
        hint: "I need a drone service",
      },
      operator: {
        value: "مشغّل طائرات مسيّرة",
        label: "Operator",
        hint: "I provide drone services",
      },
    },
  },
  fleet: {
    intro:
      "Add the aircraft you operate and set the manufacturer and model for each.",
    count: (n) => `Aircraft count: ${n}`,
    aircraftN: (n) => `Aircraft ${String(n).padStart(2, "0")}`,
    remove: "Remove",
    unlisted: "Manufacturer or model not in the list",
    customManufacturer: "Manufacturer name *",
    customManufacturerPh: "Type the manufacturer",
    customModel: "Aircraft type / model *",
    customModelPh: "Type the model",
    reviewNote:
      "It will be sent for review and will not be added to the reference list automatically.",
    manufacturer: "Manufacturer *",
    manufacturerPh: "Search manufacturers…",
    manufacturerEmpty: "No matching manufacturer",
    model: "Aircraft type / model *",
    modelPh: "Search models…",
    modelPhDisabled: "Select a manufacturer first",
    modelEmpty: "No matching model for this manufacturer",
    add: "＋ Add aircraft",
    addAnother: "＋ Add another aircraft",
    otherManufacturer: "Other",
    needOne: "Add at least one aircraft with manufacturer and model.",
    completeAll: "Complete every aircraft or remove incomplete cards.",
    enterManufacturer: "Enter the manufacturer name.",
    enterModel: "Enter the aircraft model.",
    pickManufacturer: "Select a manufacturer.",
    pickModel: "Select an aircraft model.",
    serialNumber: "Serial number",
    usageType: "Usage type *",
    pickUsage: "Select usage type",
    usageRequired: "Select a usage type.",
  },
  operatorJoin: {
    pageTitle: "Join as an operator",
    pageSubtitle: "Register your details and join the drone operator network.",
    stepsTitle: "Registration steps",
    stepsSubtitle: "4 simple steps to complete your registration",
    stepBasic: "Basic information",
    stepLicense: "License",
    stepFleet: "Drone fleet",
    stepReview: "Review & submit",
    stepOf: (current, total) => `Step ${current} of ${total}`,
    roleOperatorTitle: "Operator",
    roleOperatorHint: "I provide drone services",
    roleCustomerTitle: "Customer",
    roleCustomerHint: "I need a drone service",
    basicTitle: "Basic information",
    basicBody: "Enter your basic details accurately to continue registration",
    draftHint: "You can save the request and finish it later",
    saveDraft: "Save as draft",
    draftSaved: "Draft saved locally on this device.",
    nextLicense: "Next: Upload license",
    nextFleet: "Next: Drone fleet",
    nextReview: "Next: Review",
    prevBasic: "Previous: Basic information",
    prevLicense: "Previous: License",
    prevFleet: "Previous: Drone fleet",
    licenseTitle: "Upload license",
    licenseBody: "Upload your approved operating license for verification",
    licenseDrop: "Drag the license file here or click to choose a file",
    licenseReplace: "Replace",
    licenseDelete: "Delete",
    licenseSuccess: "Uploaded successfully",
    licenseNumber: "License number",
    licenseExpiry: "License expiry date",
    licenseTip: "Make sure the license is valid and clear before continuing",
    reuploadLicense: "After refresh, please re-upload the license file to continue.",
    fleetTitle: "Drone fleet",
    fleetBody:
      "Add the aircraft you operate and set manufacturer and model for each",
    fleetTip: "You can add all registered aircraft in your fleet.",
    reviewTitle: "Review and submit",
    reviewBody: "Review your details carefully before submitting",
    reviewBasic: "Basic information",
    reviewLicense: "License",
    reviewFleet: "Drone fleet",
    edit: "Edit",
    agreePrefix: "I confirm the data is correct and agree to the",
    privacyPolicy: "Privacy Policy",
    andWord: "and",
    terms: "Terms & Conditions",
    reviewTip: "We will review your application and contact you after verification",
    submitJoin: "Submit join request",
    successTitle: "Your request was sent successfully",
    successBody: "We will review your details and contact you after verification",
    requestId: (id) => `Request ID: ${id}`,
    backHome: "Back to home",
    leaveWarn: "You have unsaved changes. Leave this page?",
    clearFields: "Clear fields",
    clearConfirm: "Clear all entered data and the saved draft?",
    requiredMark: "*",
    errFullName: "Full name is required.",
    errPhone: "Enter a valid Saudi mobile number.",
    errEmail: "Enter a valid email address.",
    errSector: "Select an operating sector.",
    errOrganization: "Choose entity or individual.",
    orgEntity: "Entity",
    orgIndividual: "Individual",
    errLicenseFile: "Upload a valid license file to continue.",
    errAgree: "You must agree to the policy and terms before submitting.",
    noFile: "No file",
  },
  serviceRequest: {
    pageTitle: "Request a drone service",
    pageSubtitle: "Tell us about your mission and we’ll match the right operator",
    sidebarTitle: "Your request starts here",
    sidebarBody: "Fill in the mission details and we’ll recommend the best operator",
    trust1: "Vetted operators",
    trust2: "Matched by mission location",
    trust3: "Your data is protected",
    contactTitle: "Contact details",
    contactBody: "Enter your details so the right operator can reach you",
    detailsTitle: "Service details",
    detailsBody: "Tell us what you need so we can match the right service and operator",
    missionDetails: "Mission details",
    missionHint: "Describe the mission, location, and any special requirements",
    agree: "I agree to the Privacy Policy and to using my data to respond to my request",
    agreeBefore: "I agree to the ",
    agreeAfter: " and to using my data to respond to my request",
    privacyLink: "Privacy Policy",
    lockNote: "Your data is protected and used only to follow up on your request",
    submit: "Submit service request",
    submitting: "Sending request...",
    clear: "Clear fields",
    clearConfirm: "Clear all entered data?",
    successTitle: "Your request was sent successfully",
    successBody: "We received your details and will contact you after matching an operator",
    requestId: (id) => `Request ID: ${id}`,
    backHome: "Back to home",
    anotherRequest: "Submit another request",
    errFullName: "Full name is required.",
    errPhone: "Enter a valid Saudi mobile number.",
    errEmail: "Enter a valid email address.",
    errService: "Select a required service.",
    errAgree: "You must agree to the privacy policy before submitting.",
    requiredMark: "*",
  },
  storyStages: [
    {
      label: "Define the request",
      title: "We stand between need and delivery",
      body: "How we become the party between demand and execution—owning the process from first request to final invoice.",
    },
    {
      label: "Match the operator",
      title: "We choose the right operator for your mission",
      body: "We match service type and site with a trusted operator, then the drone begins its flight—while we keep verifying licenses and insurance.",
    },
    {
      label: "Run the mission",
      title: "We follow delivery to the agreed standard",
      body: "We stay on the qualified operator, valid permit, and agreed proof-of-completion standard throughout the mission.",
    },
    {
      label: "Complete the order",
      title: "Coverage across the Kingdom—through handover",
      body: "Shagam is a drone services platform—coverage across Saudi Arabia from Riyadh to Jeddah, Dammam, and every city.",
    },
  ],
};

export const uiCopy: Record<Locale, UiCopy> = { ar, en };
