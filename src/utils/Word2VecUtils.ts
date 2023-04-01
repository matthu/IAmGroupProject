import { wordVecs } from "../data/wordvecs25000";

/******************\
|  Word2Vec Utils  |
| @author Anthony  |
| @version 0.2.1   |
| @date 2016/01/08 |
| @edit 2016/01/08 |
\******************/

const Word2VecUtils = () => {
  

  /**********
   * config */

  /*************
   * constants */
  var WORDS = Object.keys(wordVecs);

  /*********************
   * working variables */

  /******************
   * work functions */
  function diffN(n: number, word1: string, word2: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!wordVecs.hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return getNClosestMatches(
      n,
      subVecs(wordVecs[word1], wordVecs[word2])
    ); 
  }

  function composeN(n: number, word1: string, word2: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!wordVecs.hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return getNClosestMatches(
      n,
      addVecs(wordVecs[word1], wordVecs[word2])
    ); 
  }

  function mixAndMatchN(n: number, sub1: string, sub2: string, add1: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!wordVecs.hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return getNClosestMatches(
      n,
      addVecs(wordVecs[add1], subVecs(wordVecs[sub1], wordVecs[sub2]))
    ); 
  }

  function findSimilarWords(n: number, word: string) {
    if (!wordVecs.hasOwnProperty(word)) {
      return [false, word];
    }

    return getNClosestMatches(
      n, wordVecs[word]
    );
  }

  function getNClosestMatches(n: number, vec: number[]) {
    var sims: [string, number][] = [];
    for (var word in wordVecs) {
      var sim = getCosSim(vec, wordVecs[word]);
      sims.push([word, sim]);
    }
    sims.sort((a, b) => {
      return b[1] - a[1]; 
    });
    return sims.slice(0, n);
  }

  /********************
   * helper functions */
  function getCosSim(f1: number[], f2: number[]) {
    return Math.abs(f1.reduce((sum, a, idx) => {
      return sum + a*f2[idx];
    }, 0)/(mag(f1)*mag(f2))); //magnitude is 1 for all feature vectors
  }

  function mag(a: number[]) {
    return Math.sqrt(a.reduce((sum, val) => {
      return sum + val*val;  
    }, 0));
  }

  function norm(a: number[]) {
    var magValue = mag(a);
    return a.map((val) => {
      return val/magValue; 
    });
  }

  function addVecs(a: number[], b: number[]) {
    return a.map((val, idx) => {
      return val + b[idx]; 
    });
  }

  function subVecs(a: number[], b: number[]) {
    return a.map((val, idx) => {
      return val - b[idx]; 
    });
  }

  return {
    diffN: diffN,
    composeN: composeN,
    findSimilarWords: findSimilarWords,
    mixAndMatchN: mixAndMatchN,
    addVecs: addVecs,
    subVecs: subVecs,
    getNClosestMatches: getNClosestMatches,
    getCosSim: getCosSim
  };
};

export default Word2VecUtils; 
