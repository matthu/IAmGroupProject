import { stemmer } from "stemmer";
import slackBios from "../data/slackBios.json";

interface WinkPosTags {
  value: string;
  tag: string;
  normal: string;
  pos: string;
  lemma: string;
}

/** A utility class for extracting tokens from bios */
class BioTokenizer {

  private stopWords = [
    "ourselves", "hers", "between", "yourself", "but", "again", "there", "about", "once", "during", "out", "very", "having", "with", "they", "own", "an", "be",
    "some", "for", "do", "its", "yours", "such", "into", "of", "most", "itself", "other", "off", "is", "s", "am", "or", "who", "as", "from", "him", "each", "the",
    "themselves", "until", "below", "are", "we", "these", "your", "his", "through", "don", "nor", "me", "were", "her", "more", "himself", "this", "down", "should",
    "our", "their", "while", "above", "both", "up", "to", "ours", "had", "she", "all", "no", "when", "at", "any", "before", "them", "same", "and", "been", "have",
    "in", "will", "on", "does", "yourselves", "then", "that", "because", "what", "over", "why", "so", "can", "did", "not", "now", "under", "he", "you", "herself",
    "has", "just", "where", "too", "only", "myself", "which", "those", "i", "after", "few", "whom", "t", "being", "if", "theirs", "my", "against", "a", "by",
    "doing", "it", "how", "further", "was", "here", "than", "m"
  ];

  /** The raw bios of users */
  getBios() {
    return slackBios as {[id: string]: string};
  }

  /** Get the extracted tokens from bios */
  getBioTokens() {
    var bioTokens: {[id: string]: string[]} = {}
    for (var username in (slackBios as any)) {
      var bio: string = (slackBios as any)[username];

      // bio = bio.replaceAll(".", "");
      // bio = bio.replaceAll(",", "");
      // bio = bio.replaceAll("!", "");
      // bio = bio.replaceAll("?", "");

      // var terms = bio.split(" ");

      // Stem words
      // terms = terms.map(term => stemmer(term));

      var posTagger = require( 'wink-pos-tagger' );
      var tagger = posTagger();
      var tags: WinkPosTags[] = tagger.tagSentence(bio);
      // Uncomment below to see tags in browser console
      // console.log(tags);

      // Filter to lemma stemmed words
      var terms: string[] = tags.filter(tag => tag.lemma && tag.tag == "word").map(tag => tag.lemma);

      // Remove stop words
      terms = terms.filter(term => !this.stopWords.includes(term));
      bioTokens[username] = terms;
    }
    return bioTokens;
  }

}

export default BioTokenizer;
