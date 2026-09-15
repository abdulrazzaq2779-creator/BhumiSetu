/**
 * Citizen portal i18n — EN / हिंदी.
 *
 * Scope: the citizen portal only (the analyst console stays English, as a
 * real GoI internal tool would). Flat key → string maps; the toggle lives
 * in the citizen layout header and persists for the session.
 */
import type { CitizenLang } from './portalTypes';

const en = {
  banner: 'CITIZEN PORTAL',
  greeting: (name: string, village: string) => `Namaste, ${name} — ${village}`,
  messages: 'Messages',
  signOut: 'Sign out',
  tabs: {
    status: 'My Property Status',
    notifications: 'Notifications',
    documents: 'Documents',
  },
  status: {
    eyebrow: 'CITIZEN PORTAL',
    title: 'My Property Status',
    intro:
      'One place to see where your property stands in the acquisition process.',
    surveyNo: 'Survey No.',
    partOf: 'Part of:',
    stage: {
      notification: 'Notification',
      survey: 'Survey',
      valuation: 'Valuation',
      compensation: 'Compensation',
      possession: 'Possession',
    },
    current: 'Current',
    sentences: {
      0: 'Your property is at the notification stage. Officials will visit to record survey details within the next few weeks.',
      1: 'Your property is under survey. A valuation visit will follow once survey numbers are confirmed.',
      2: 'Your property is under valuation. Estimated compensation decision in 30–45 days.',
      3: 'Your compensation award is being prepared. Disbursement follows once documents are verified.',
      4: 'Compensation has been awarded. Possession formalities will conclude after final payment.',
    },
    demo:
      'Demo notice: this tracker is linked to a sample property record for the demonstration. In production it would link through your Aadhaar-linked land record.',
    timelineTitle: 'Journey so far',
  },
  notifications: {
    eyebrow: 'CITIZEN PORTAL',
    title: 'Notifications',
    intro:
      "Messages from the District Collector's office about your property.",
    emptyTitle: 'No messages yet',
    empty:
      'When an official sends you a notice — a document request, a compensation offer or a hearing date — it will appear here immediately.',
    emptyTip:
      'Demo tip: open the Official Portal\'s Alerts page and press "Notify Landowner" to watch a message arrive here live.',
    count: (n: number) =>
      `${n} message${n === 1 ? '' : 's'} received — newest first.`,
    sentBy: "Sent by the District Collector's office · regarding",
  },
  documents: {
    eyebrow: 'CITIZEN PORTAL',
    title: 'My Documents',
    intro:
      'Upload land records and identity proofs. Officials verify each document and update its status here.',
    uploadTitle: 'Upload a document',
    uploadCta: 'Tap to choose a file (PDF or photo)',
    uploading: 'Uploading…',
    uploadHint: 'Patta passbook, Aadhaar, bank passbook — up to 10 MB',
    demoNotice:
      'Demo notice: files are not uploaded anywhere — only the file name and size are shown in the list below.',
    listTitle: 'Your documents',
    langNote: 'Labels appear in हिंदी when you switch the language above.',
  },
};

const hi: typeof en = {
  banner: 'नागरिक पोर्टल',
  greeting: (name: string, village: string) => `नमस्ते, ${name} — ${village}`,
  messages: 'संदेश',
  signOut: 'साइन आउट',
  tabs: {
    status: 'मेरी संपत्ति की स्थिति',
    notifications: 'सूचनाएँ',
    documents: 'दस्तावेज़',
  },
  status: {
    eyebrow: 'नागरिक पोर्टल',
    title: 'मेरी संपत्ति की स्थिति',
    intro:
      'अधिग्रहण प्रक्रिया में आपकी संपत्ति कहाँ खड़ी है, यह देखने के लिए एक ही जगह।',
    surveyNo: 'सर्वे नं.',
    partOf: 'इसका भाग:',
    stage: {
      notification: 'अधिसूचना',
      survey: 'सर्वेक्षण',
      valuation: 'मूल्यांकन',
      compensation: 'मुआवज़ा',
      possession: 'कब्ज़ा',
    },
    current: 'वर्तमान',
    sentences: {
      0: 'आपकी संपत्ति अधिसूचना चरण में है। अधिकारी अगले कुछ हफ़्तों में सर्वेक्षण विवरण दर्ज करने आएंगे।',
      1: 'आपकी संपत्ति का सर्वेक्षण हो रहा है। सर्वे नंबर पुष्ट होते ही मूल्यांकन भ्रमण होगा।',
      2: 'आपकी संपत्ति का मूल्यांकन हो रहा है। अनुमानित मुआवज़ा निर्णय 30–45 दिनों में।',
      3: 'आपका मुआवज़ा पुरस्कार तैयार हो रहा है। दस्तावेज़ सत्यापन के बाद भुगतान होगा।',
      4: 'मुआवज़ा स्वीकृत हो गया है। अंतिम भुगतान के बाद कब्ज़े की औपचारिकताएँ पूरी होंगी।',
    },
    demo:
      'डेमो सूचना: यह ट्रैकर प्रदर्शन के लिए एक नमूना संपत्ति रिकॉर्ड से जुड़ा है। वास्तविक प्रणाली में यह आधार-लिंक्ड भूमि रिकॉर्ड से जुड़ेगा।',
    timelineTitle: 'अब तक की यात्रा',
  },
  notifications: {
    eyebrow: 'नागरिक पोर्टल',
    title: 'सूचनाएँ',
    intro: 'आपकी संपत्ति के बारे में जिला कलेक्टर कार्यालय के संदेश।',
    emptyTitle: 'अभी कोई संदेश नहीं',
    empty:
      'जब कोई अधिकारी आपको सूचना भेजेगा — दस्तावेज़ अनुरोध, मुआवज़ा प्रस्ताव या सुनवाई तिथि — तो वह यहाँ तुरंत दिखाई देगी।',
    emptyTip:
      'डेमो सुझाव: आधिकारिक पोर्टल के अलर्ट पृष्ठ पर जाकर "भूमि स्वामी को सूचित करें" दबाएँ और संदेश को यहाँ सीधे आते देखें।',
    count: (n: number) =>
      `${n} संदेश प्राप्त हुए — नवीनतम पहले।`,
    sentBy: 'जिला कलेक्टर कार्यालय द्वारा भेजा गया · संबंधित',
  },
  documents: {
    eyebrow: 'नागरिक पोर्टल',
    title: 'मेरे दस्तावेज़',
    intro:
      'भूमि रिकॉर्ड और पहचान प्रमाण अपलोड करें। अधिकारी प्रत्येक दस्तावेज़ का सत्यापन करके यहाँ स्थिति अपडेट करते हैं।',
    uploadTitle: 'दस्तावेज़ अपलोड करें',
    uploadCta: 'फ़ाइल चुनने के लिए टैप करें (PDF या फ़ोटो)',
    uploading: 'अपलोड हो रहा है…',
    uploadHint: 'पट्टा पासबुक, आधार, बैंक पासबुक — 10 MB तक',
    demoNotice:
      'डेमो सूचना: फ़ाइलें कहीं अपलोड नहीं होतीं — केवल फ़ाइल का नाम और आकार नीचे सूची में दिखता है।',
    listTitle: 'आपके दस्तावेज़',
    langNote: 'ऊपर भाषा बदलने पर लेबल हिंदी में दिखेंगे।',
  },
};

export const STRINGS: Record<CitizenLang, typeof en> = { en, hi };

/** Hook-less selector for components that already have `state.lang`. */
export function t(lang: CitizenLang) {
  return STRINGS[lang];
}
