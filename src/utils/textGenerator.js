const COMMON_WORDS = [
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

export const generatePassage = (wordCount) => {
    const words = [];
    let sentenceLength = 0;
    let targetSentenceLength = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence

    for (let i = 0; i < wordCount; i++) {
        let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];

        // Capitalize start of sentence
        if (sentenceLength === 0) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        // Add punctuation at end of sentence
        sentenceLength++;
        if (sentenceLength >= targetSentenceLength && i < wordCount - 1) {
            word += ".";
            sentenceLength = 0;
            targetSentenceLength = Math.floor(Math.random() * 10) + 5;
        }

        words.push(word);
    }

    // Ensure passing ends with period if not already
    let lastWord = words[words.length - 1];
    if (lastWord && !lastWord.endsWith(".")) {
        words[words.length - 1] = lastWord + ".";
    }

    return words.join(" ");
};
