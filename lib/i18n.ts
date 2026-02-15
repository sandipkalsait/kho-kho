export type LanguageKey = 'en' | 'hi' | 'mr';

export const languageNames: Record<LanguageKey, string> = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
};

export interface Translations {
  appName: string;
  digitizeSubtitle: string;
  home: string;
  capture: string;
  matches: string;
  export: string;
  settings: string;
  total: string;
  confirmed: string;
  drafts: string;
  scanScoresheet: string;
  scanScoresheetDesc: string;
  recentMatches: string;
  seeAll: string;
  noMatchesYet: string;
  captureToStart: string;
  captureScoresheet: string;
  takePhotoOrGallery: string;
  takePhoto: string;
  takePhotoDesc: string;
  fromGallery: string;
  fromGalleryDesc: string;
  tipsTitle: string;
  tipsText: string;
  extractData: string;
  processing: string;
  savedMatches: string;
  matchesRecorded: string;
  searchPlaceholder: string;
  noMatchesFound: string;
  tryDifferentSearch: string;
  capturedAppearHere: string;
  exportData: string;
  shareRecords: string;
  exportOptions: string;
  exportAll: string;
  exportAllDesc: string;
  confirmedOnly: string;
  draftsOnly: string;
  aboutExports: string;
  aboutExportsText: string;
  ocrResults: string;
  extractionComplete: string;
  avgConfidence: string;
  playersFound: string;
  autoFilled: string;
  matchInfo: string;
  date: string;
  venue: string;
  totalScore: string;
  player: string;
  pts: string;
  conf: string;
  autoFilledDetected: string;
  autoFilledDetectedDesc: string;
  reviewAndEdit: string;
  confirmData: string;
  editMatch: string;
  teamName: string;
  players: string;
  addPlayer: string;
  saveDraft: string;
  confirm: string;
  missingInfo: string;
  enterBothTeams: string;
  enterDate: string;
  duplicateMatch: string;
  duplicateMatchDesc: string;
  matchDetails: string;
  deleteMatch: string;
  deleteConfirm: string;
  cancel: string;
  delete: string;
  edit: string;
  vs: string;
  noData: string;
  noDataDesc: string;
  digitizedBy: string;
  matchNotFound: string;
  themeSettings: string;
  selectTheme: string;
  languageSettings: string;
  selectLanguage: string;
  autoSuggested: string;
  lowConfidence: string;
  draft: string;
  permissionNeeded: string;
  cameraPermission: string;
  galleryPermission: string;
  exportComplete: string;
  exportFailed: string;
  exportFailedDesc: string;
  watermarkText: string;
  teamA: string;
  teamB: string;
}

const en: Translations = {
  appName: 'KhoKho Score',
  digitizeSubtitle: 'Digitize your scoresheets',
  home: 'Home',
  capture: 'Capture',
  matches: 'Matches',
  export: 'Export',
  settings: 'Settings',
  total: 'Total',
  confirmed: 'Confirmed',
  drafts: 'Drafts',
  scanScoresheet: 'Scan Scoresheet',
  scanScoresheetDesc: 'Capture or upload a kho-kho scoresheet',
  recentMatches: 'Recent Matches',
  seeAll: 'See all',
  noMatchesYet: 'No matches yet',
  captureToStart: 'Capture a scoresheet to get started',
  captureScoresheet: 'Capture Scoresheet',
  takePhotoOrGallery: 'Take a photo or select from gallery',
  takePhoto: 'Take Photo',
  takePhotoDesc: 'Use your camera to capture the scoresheet',
  fromGallery: 'From Gallery',
  fromGalleryDesc: 'Select an existing scoresheet photo',
  tipsTitle: 'Tips for best results',
  tipsText: 'Place the scoresheet on a flat surface with good lighting. Avoid shadows and glare. Ensure all text is visible.',
  extractData: 'Extract Data',
  processing: 'Processing...',
  savedMatches: 'Saved Matches',
  matchesRecorded: 'matches recorded',
  searchPlaceholder: 'Search by team, venue, or date...',
  noMatchesFound: 'No matches found',
  tryDifferentSearch: 'Try a different search term',
  capturedAppearHere: 'Captured scoresheets will appear here',
  exportData: 'Export Data',
  shareRecords: 'Share your match records',
  exportOptions: 'Export Options',
  exportAll: 'Export All Matches',
  exportAllDesc: 'Download all matches as CSV',
  confirmedOnly: 'Confirmed Only',
  draftsOnly: 'Drafts Only',
  aboutExports: 'About Exports',
  aboutExportsText: 'Exported CSV files include a watermark with the app name. All auto-filled fields are clearly flagged. Files can be opened in Excel, Google Sheets, or any spreadsheet application.',
  ocrResults: 'OCR Results',
  extractionComplete: 'Extraction Complete',
  avgConfidence: 'Avg Confidence',
  playersFound: 'Players Found',
  autoFilled: 'Auto-filled',
  matchInfo: 'Match Info',
  date: 'Date',
  venue: 'Venue',
  totalScore: 'Total Score',
  player: 'Player',
  pts: 'Pts',
  conf: 'Conf.',
  autoFilledDetected: 'Auto-filled fields detected',
  autoFilledDetectedDesc: 'The following fields had low confidence and were auto-suggested: {fields}. Please review before confirming.',
  reviewAndEdit: 'Review & Edit',
  confirmData: 'Confirm Data',
  editMatch: 'Edit Match',
  teamName: 'Team Name',
  players: 'Players',
  addPlayer: 'Add Player',
  saveDraft: 'Save Draft',
  confirm: 'Confirm',
  missingInfo: 'Missing Info',
  enterBothTeams: 'Please enter both team names.',
  enterDate: 'Please enter the match date.',
  duplicateMatch: 'Duplicate Match',
  duplicateMatchDesc: 'A match with the same teams, date, and venue already exists.',
  matchDetails: 'Match Details',
  deleteMatch: 'Delete Match',
  deleteConfirm: 'Are you sure you want to delete this match?',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  vs: 'VS',
  noData: 'No Data',
  noDataDesc: 'There are no matches to export for this filter.',
  digitizedBy: 'Digitized by KhoKho Score',
  matchNotFound: 'Match not found',
  themeSettings: 'Appearance',
  selectTheme: 'Select Theme',
  languageSettings: 'Language',
  selectLanguage: 'Select Language',
  autoSuggested: 'Auto-suggested',
  lowConfidence: 'Low confidence - please verify',
  draft: 'Draft',
  permissionNeeded: 'Permission needed',
  cameraPermission: 'Camera permission is required to take photos.',
  galleryPermission: 'Gallery permission is required to select photos.',
  exportComplete: 'Export Complete',
  exportFailed: 'Export Failed',
  exportFailedDesc: 'An error occurred while exporting data.',
  watermarkText: 'KhoKho Score - Official Digital Record',
  teamA: 'Team A',
  teamB: 'Team B',
};

const hi: Translations = {
  appName: 'खो-खो स्कोर',
  digitizeSubtitle: 'अपनी स्कोरशीट को डिजिटल बनाएं',
  home: 'होम',
  capture: 'कैप्चर',
  matches: 'मैच',
  export: 'निर्यात',
  settings: 'सेटिंग्स',
  total: 'कुल',
  confirmed: 'पुष्टि',
  drafts: 'ड्राफ्ट',
  scanScoresheet: 'स्कोरशीट स्कैन करें',
  scanScoresheetDesc: 'खो-खो स्कोरशीट कैप्चर या अपलोड करें',
  recentMatches: 'हालिया मैच',
  seeAll: 'सभी देखें',
  noMatchesYet: 'अभी कोई मैच नहीं',
  captureToStart: 'शुरू करने के लिए स्कोरशीट कैप्चर करें',
  captureScoresheet: 'स्कोरशीट कैप्चर करें',
  takePhotoOrGallery: 'फोटो लें या गैलरी से चुनें',
  takePhoto: 'फोटो लें',
  takePhotoDesc: 'स्कोरशीट कैप्चर करने के लिए कैमरा का उपयोग करें',
  fromGallery: 'गैलरी से',
  fromGalleryDesc: 'मौजूदा स्कोरशीट फोटो चुनें',
  tipsTitle: 'बेहतर परिणाम के लिए सुझाव',
  tipsText: 'स्कोरशीट को अच्छी रोशनी में समतल सतह पर रखें। छाया और चमक से बचें।',
  extractData: 'डेटा निकालें',
  processing: 'प्रोसेसिंग...',
  savedMatches: 'सहेजे गए मैच',
  matchesRecorded: 'मैच रिकॉर्ड किए गए',
  searchPlaceholder: 'टीम, स्थान या तारीख से खोजें...',
  noMatchesFound: 'कोई मैच नहीं मिला',
  tryDifferentSearch: 'कोई और शब्द खोजें',
  capturedAppearHere: 'कैप्चर की गई स्कोरशीट यहां दिखेंगी',
  exportData: 'डेटा निर्यात',
  shareRecords: 'अपने मैच रिकॉर्ड साझा करें',
  exportOptions: 'निर्यात विकल्प',
  exportAll: 'सभी मैच निर्यात करें',
  exportAllDesc: 'सभी मैच CSV के रूप में डाउनलोड करें',
  confirmedOnly: 'केवल पुष्टि किए गए',
  draftsOnly: 'केवल ड्राफ्ट',
  aboutExports: 'निर्यात के बारे में',
  aboutExportsText: 'निर्यात CSV फ़ाइलों में ऐप नाम का वॉटरमार्क शामिल है। सभी ऑटो-भरे फ़ील्ड स्पष्ट रूप से चिह्नित हैं।',
  ocrResults: 'OCR परिणाम',
  extractionComplete: 'निष्कर्षण पूर्ण',
  avgConfidence: 'औसत विश्वसनीयता',
  playersFound: 'खिलाड़ी मिले',
  autoFilled: 'ऑटो-भरा',
  matchInfo: 'मैच जानकारी',
  date: 'तारीख',
  venue: 'स्थान',
  totalScore: 'कुल स्कोर',
  player: 'खिलाड़ी',
  pts: 'अंक',
  conf: 'विश्व.',
  autoFilledDetected: 'ऑटो-भरे फ़ील्ड पाए गए',
  autoFilledDetectedDesc: 'इन फ़ील्ड्स में कम विश्वसनीयता थी: {fields}। कृपया पुष्टि करने से पहले समीक्षा करें।',
  reviewAndEdit: 'समीक्षा और संपादन',
  confirmData: 'डेटा पुष्टि करें',
  editMatch: 'मैच संपादित करें',
  teamName: 'टीम का नाम',
  players: 'खिलाड़ी',
  addPlayer: 'खिलाड़ी जोड़ें',
  saveDraft: 'ड्राफ्ट सहेजें',
  confirm: 'पुष्टि करें',
  missingInfo: 'जानकारी गायब है',
  enterBothTeams: 'कृपया दोनों टीमों के नाम दर्ज करें।',
  enterDate: 'कृपया मैच की तारीख दर्ज करें।',
  duplicateMatch: 'डुप्लिकेट मैच',
  duplicateMatchDesc: 'इन्हीं टीमों, तारीख और स्थान का मैच पहले से मौजूद है।',
  matchDetails: 'मैच विवरण',
  deleteMatch: 'मैच हटाएं',
  deleteConfirm: 'क्या आप वाकई इस मैच को हटाना चाहते हैं?',
  cancel: 'रद्द करें',
  delete: 'हटाएं',
  edit: 'संपादन',
  vs: 'बनाम',
  noData: 'कोई डेटा नहीं',
  noDataDesc: 'इस फ़िल्टर के लिए कोई मैच नहीं है।',
  digitizedBy: 'खो-खो स्कोर द्वारा डिजिटाइज़',
  matchNotFound: 'मैच नहीं मिला',
  themeSettings: 'दिखावट',
  selectTheme: 'थीम चुनें',
  languageSettings: 'भाषा',
  selectLanguage: 'भाषा चुनें',
  autoSuggested: 'ऑटो-सुझाया',
  lowConfidence: 'कम विश्वसनीयता - कृपया सत्यापित करें',
  draft: 'ड्राफ्ट',
  permissionNeeded: 'अनुमति आवश्यक',
  cameraPermission: 'फोटो लेने के लिए कैमरा अनुमति आवश्यक है।',
  galleryPermission: 'फोटो चुनने के लिए गैलरी अनुमति आवश्यक है।',
  exportComplete: 'निर्यात पूर्ण',
  exportFailed: 'निर्यात विफल',
  exportFailedDesc: 'डेटा निर्यात करते समय एक त्रुटि हुई।',
  watermarkText: 'खो-खो स्कोर - आधिकारिक डिजिटल रिकॉर्ड',
  teamA: 'टीम A',
  teamB: 'टीम B',
};

const mr: Translations = {
  appName: 'खो-खो स्कोअर',
  digitizeSubtitle: 'तुमची स्कोअरशीट डिजिटल करा',
  home: 'होम',
  capture: 'कॅप्चर',
  matches: 'सामने',
  export: 'निर्यात',
  settings: 'सेटिंग्ज',
  total: 'एकूण',
  confirmed: 'पुष्टी',
  drafts: 'मसुदे',
  scanScoresheet: 'स्कोअरशीट स्कॅन करा',
  scanScoresheetDesc: 'खो-खो स्कोअरशीट कॅप्चर किंवा अपलोड करा',
  recentMatches: 'अलीकडील सामने',
  seeAll: 'सर्व पहा',
  noMatchesYet: 'अद्याप सामने नाहीत',
  captureToStart: 'सुरू करण्यासाठी स्कोअरशीट कॅप्चर करा',
  captureScoresheet: 'स्कोअरशीट कॅप्चर करा',
  takePhotoOrGallery: 'फोटो काढा किंवा गॅलरीतून निवडा',
  takePhoto: 'फोटो काढा',
  takePhotoDesc: 'स्कोअरशीट कॅप्चर करण्यासाठी कॅमेरा वापरा',
  fromGallery: 'गॅलरीतून',
  fromGalleryDesc: 'विद्यमान स्कोअरशीट फोटो निवडा',
  tipsTitle: 'चांगल्या परिणामासाठी टिप्स',
  tipsText: 'स्कोअरशीट चांगल्या प्रकाशात सपाट पृष्ठभागावर ठेवा. सावल्या आणि चमक टाळा.',
  extractData: 'डेटा काढा',
  processing: 'प्रक्रिया सुरू...',
  savedMatches: 'जतन केलेले सामने',
  matchesRecorded: 'सामने नोंदवले',
  searchPlaceholder: 'संघ, ठिकाण किंवा तारखेने शोधा...',
  noMatchesFound: 'सामने सापडले नाहीत',
  tryDifferentSearch: 'वेगळा शब्द वापरून पहा',
  capturedAppearHere: 'कॅप्चर केलेल्या स्कोअरशीट येथे दिसतील',
  exportData: 'डेटा निर्यात',
  shareRecords: 'तुमचे सामने रेकॉर्ड शेअर करा',
  exportOptions: 'निर्यात पर्याय',
  exportAll: 'सर्व सामने निर्यात करा',
  exportAllDesc: 'सर्व सामने CSV म्हणून डाउनलोड करा',
  confirmedOnly: 'फक्त पुष्टी केलेले',
  draftsOnly: 'फक्त मसुदे',
  aboutExports: 'निर्यातबद्दल',
  aboutExportsText: 'निर्यात CSV फायलींमध्ये अॅप नावाचे वॉटरमार्क समाविष्ट आहे. सर्व ऑटो-भरलेली फील्ड स्पष्टपणे चिन्हांकित आहेत.',
  ocrResults: 'OCR निकाल',
  extractionComplete: 'उतारा पूर्ण',
  avgConfidence: 'सरासरी विश्वसनीयता',
  playersFound: 'खेळाडू सापडले',
  autoFilled: 'ऑटो-भरले',
  matchInfo: 'सामना माहिती',
  date: 'तारीख',
  venue: 'ठिकाण',
  totalScore: 'एकूण गुण',
  player: 'खेळाडू',
  pts: 'गुण',
  conf: 'विश्व.',
  autoFilledDetected: 'ऑटो-भरलेली फील्ड आढळली',
  autoFilledDetectedDesc: 'या फील्डमध्ये कमी विश्वसनीयता होती: {fields}. कृपया पुष्टी करण्यापूर्वी तपासा.',
  reviewAndEdit: 'पुनरावलोकन आणि संपादन',
  confirmData: 'डेटा पुष्टी करा',
  editMatch: 'सामना संपादित करा',
  teamName: 'संघाचे नाव',
  players: 'खेळाडू',
  addPlayer: 'खेळाडू जोडा',
  saveDraft: 'मसुदा जतन करा',
  confirm: 'पुष्टी करा',
  missingInfo: 'माहिती गहाळ',
  enterBothTeams: 'कृपया दोन्ही संघांची नावे प्रविष्ट करा.',
  enterDate: 'कृपया सामन्याची तारीख प्रविष्ट करा.',
  duplicateMatch: 'डुप्लिकेट सामना',
  duplicateMatchDesc: 'याच संघ, तारीख आणि ठिकाणासह सामना आधीच अस्तित्वात आहे.',
  matchDetails: 'सामना तपशील',
  deleteMatch: 'सामना हटवा',
  deleteConfirm: 'तुम्हाला खात्री आहे की हा सामना हटवायचा आहे?',
  cancel: 'रद्द करा',
  delete: 'हटवा',
  edit: 'संपादन',
  vs: 'वि.',
  noData: 'डेटा नाही',
  noDataDesc: 'या फिल्टरसाठी कोणतेही सामने नाहीत.',
  digitizedBy: 'खो-खो स्कोअर द्वारे डिजिटाइज्ड',
  matchNotFound: 'सामना सापडला नाही',
  themeSettings: 'दिखावट',
  selectTheme: 'थीम निवडा',
  languageSettings: 'भाषा',
  selectLanguage: 'भाषा निवडा',
  autoSuggested: 'ऑटो-सुचवले',
  lowConfidence: 'कमी विश्वसनीयता - कृपया सत्यापित करा',
  draft: 'मसुदा',
  permissionNeeded: 'परवानगी आवश्यक',
  cameraPermission: 'फोटो काढण्यासाठी कॅमेरा परवानगी आवश्यक आहे.',
  galleryPermission: 'फोटो निवडण्यासाठी गॅलरी परवानगी आवश्यक आहे.',
  exportComplete: 'निर्यात पूर्ण',
  exportFailed: 'निर्यात अयशस्वी',
  exportFailedDesc: 'डेटा निर्यात करताना एक त्रुटी आली.',
  watermarkText: 'खो-खो स्कोअर - अधिकृत डिजिटल नोंद',
  teamA: 'संघ A',
  teamB: 'संघ B',
};

const translations: Record<LanguageKey, Translations> = { en, hi, mr };

export function getTranslations(lang: LanguageKey): Translations {
  return translations[lang] || translations.en;
}
