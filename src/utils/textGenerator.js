// ── English Common Words ──
const ENGLISH_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "not",
    "for", "on", "with", "he", "as", "you", "do", "at", "this", "but",
    "his", "by", "from", "they", "we", "say", "her", "she", "or", "an",
    "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
    "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
    "can", "like", "time", "no", "just", "him", "know", "take", "people", "into",
    "year", "your", "good", "some", "could", "them", "see", "other", "than", "then",
    "now", "look", "only", "come", "its", "over", "think", "also", "back", "after",
    "use", "two", "how", "our", "work", "first", "well", "way", "even", "new",
    "want", "because", "any", "these", "give", "day", "most", "us", "is", "are",
    "was", "were", "been", "has", "had", "did", "does", "said", "made", "went",
    "came", "took", "gave", "saw", "knew", "thought", "felt", "told", "asked", "called",
    "life", "world", "school", "state", "city", "family", "student", "group", "country", "problem",
    "hand", "part", "place", "case", "week", "company", "system", "program", "question", "work",
    "number", "night", "point", "home", "water", "room", "mother", "area", "money", "story",
    "fact", "month", "lot", "right", "study", "book", "eye", "job", "word", "business",
    "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour",
    "game", "line", "end", "member", "law", "car", "city", "community", "name", "president",
    "team", "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others",
    "level", "office", "door", "health", "person", "art", "war", "history", "party", "result",
    "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force"
];

// ── Marathi Common Words (Devanagari) ──
const MARATHI_WORDS = [
    "आणि", "हे", "आहे", "एक", "तो", "ती", "ते", "हा", "या", "त्या",
    "माझा", "माझी", "माझे", "तुमचा", "तुमची", "तुमचे", "आम्ही", "आपण", "कोण", "काय",
    "होता", "होती", "होते", "असा", "अशी", "असे", "सर्व", "प्रत्येक", "कोणी", "कोणत्या",
    "घर", "शाळा", "गाव", "शहर", "देश", "नदी", "पाणी", "अन्न", "जमीन", "आकाश",
    "दिवस", "रात्र", "सकाळ", "संध्याकाळ", "वेळ", "आठवडा", "महिना", "वर्ष", "आज", "उद्या",
    "माणूस", "मूल", "बाई", "आई", "वडील", "भाऊ", "बहीण", "मित्र", "शिक्षक", "विद्यार्थी",
    "काम", "अभ्यास", "विचार", "प्रश्न", "उत्तर", "समस्या", "मार्ग", "जागा", "वस्तू", "पुस्तक",
    "चांगले", "वाईट", "मोठे", "लहान", "नवीन", "जुने", "सुंदर", "सोपे", "कठीण", "महत्त्वाचे",
    "करणे", "जाणे", "येणे", "बोलणे", "ऐकणे", "वाचणे", "लिहिणे", "खाणे", "पिणे", "पाहणे",
    "शिकणे", "खेळणे", "चालणे", "धावणे", "बसणे", "उभे", "राहणे", "देणे", "घेणे", "सांगणे",
    "म्हणून", "परंतु", "किंवा", "जर", "तर", "मग", "कारण", "नंतर", "आधी", "सोबत",
    "खूप", "थोडे", "जास्त", "कमी", "फक्त", "नेहमी", "कधी", "कसे", "कुठे", "इथे",
    "तिथे", "वर", "खाली", "पुढे", "मागे", "आत", "बाहेर", "जवळ", "दूर", "मध्ये",
    "लोक", "समाज", "सरकार", "कार्यालय", "शिक्षण", "आरोग्य", "पैसे", "व्यापार", "उद्योग", "कला",
    "संगीत", "चित्र", "भाषा", "संस्कृती", "इतिहास", "विज्ञान", "तंत्रज्ञान", "प्रगती", "विकास", "स्वातंत्र्य",
    "पर्वत", "समुद्र", "फूल", "झाड", "प्राणी", "पक्षी", "हवा", "ऊन", "पाऊस", "थंडी"
];

// ── Hindi Common Words (Devanagari) ──
const HINDI_WORDS = [
    "और", "यह", "है", "एक", "वह", "को", "में", "से", "पर", "का",
    "की", "के", "ने", "भी", "तो", "कर", "हो", "या", "जो", "तक",
    "मैं", "हम", "तुम", "आप", "वे", "कोई", "कुछ", "सब", "अपना", "अपनी",
    "घर", "देश", "शहर", "गाँव", "नदी", "पानी", "खाना", "जमीन", "आसमान", "रास्ता",
    "दिन", "रात", "सुबह", "शाम", "समय", "हफ्ता", "महीना", "साल", "आज", "कल",
    "आदमी", "औरत", "बच्चा", "माँ", "पिता", "भाई", "बहन", "दोस्त", "गुरु", "छात्र",
    "काम", "पढ़ाई", "सोच", "सवाल", "जवाब", "समस्या", "रास्ता", "जगह", "चीज़", "किताब",
    "अच्छा", "बुरा", "बड़ा", "छोटा", "नया", "पुराना", "सुंदर", "आसान", "मुश्किल", "जरूरी",
    "करना", "जाना", "आना", "बोलना", "सुनना", "पढ़ना", "लिखना", "खाना", "पीना", "देखना",
    "सीखना", "खेलना", "चलना", "दौड़ना", "बैठना", "खड़ा", "रहना", "देना", "लेना", "बताना",
    "इसलिए", "लेकिन", "अगर", "तब", "फिर", "क्योंकि", "बाद", "पहले", "साथ", "बिना",
    "बहुत", "थोड़ा", "ज्यादा", "कम", "सिर्फ", "हमेशा", "कभी", "कैसे", "कहाँ", "यहाँ",
    "वहाँ", "ऊपर", "नीचे", "आगे", "पीछे", "अंदर", "बाहर", "पास", "दूर", "बीच",
    "लोग", "समाज", "सरकार", "दफ्तर", "शिक्षा", "स्वास्थ्य", "पैसा", "व्यापार", "उद्योग", "कला",
    "संगीत", "भाषा", "संस्कृति", "इतिहास", "विज्ञान", "तकनीक", "प्रगति", "विकास", "स्वतंत्रता", "शांति",
    "पहाड़", "समंदर", "फूल", "पेड़", "जानवर", "पक्षी", "हवा", "धूप", "बारिश", "ठंड"
];

// ── Passage Generation ──
const buildPassage = (wordList, wordCount, usePurnaViram = false) => {
    const words = [];
    let sentenceLength = 0;
    let targetSentenceLength = Math.floor(Math.random() * 10) + 5;
    const period = usePurnaViram ? "।" : ".";

    for (let i = 0; i < wordCount; i++) {
        let word = wordList[Math.floor(Math.random() * wordList.length)];

        // Capitalize start of sentence (only for English)
        if (!usePurnaViram && sentenceLength === 0) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        sentenceLength++;
        if (sentenceLength >= targetSentenceLength && i < wordCount - 1) {
            word += period;
            sentenceLength = 0;
            targetSentenceLength = Math.floor(Math.random() * 10) + 5;
        }

        words.push(word);
    }

    // Ensure passage ends with period
    let lastWord = words[words.length - 1];
    if (lastWord && !lastWord.endsWith(period)) {
        words[words.length - 1] = lastWord + period;
    }

    return words.join(" ");
};

/**
 * Generate a passage in the specified language.
 * @param {number} wordCount
 * @param {'english'|'marathi'|'hindi'} language
 */
export const generatePassage = (wordCount, language = 'english') => {
    switch (language) {
        case 'marathi':
            return buildPassage(MARATHI_WORDS, wordCount, true);
        case 'hindi':
            return buildPassage(HINDI_WORDS, wordCount, true);
        default:
            return buildPassage(ENGLISH_WORDS, wordCount, false);
    }
};
