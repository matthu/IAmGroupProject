// import wordVecs from "../data/word2Vecs.json";
import wordVecs from "../data/gloveVecs.json";

/** A utility class for calculating simularity scores */

const similarityMin = 0.0;

/** Get a term's vec */
export function getTermVec(term: string): number[] {
  if ((wordVecs as any).hasOwnProperty(term)) {
    return (wordVecs as any)[term];
  }
  else {
    return [];
  }
}

/** Get n most similar user terms to a specific term */
export function getNSimilarTermsToTerm(n: number, userTerms: {[id: string]: string[]}, term: string) {
  var vec = getTermVec(term);

  var termSimilarities: {[id: string]: [string, number][]} = {};
  for (var username of Object.keys(userTerms)) {
    var sims: [string, number][] = [];
    for (var userTerm of userTerms[username]) {
      var termVec = getTermVec(userTerm);
      var sim = getCosSim(vec, termVec);
      sims.push([userTerm, sim]);
    }

    sims.sort((a, b) => {
      return b[1] - a[1]; 
    });
    sims = sims.slice(0, n);

    termSimilarities[username] = sims;
  }
  return termSimilarities;
}

/** This calculates the similarity of one user's terms to another user's terms */
export function getComparisonOfTermsList(userA: string[], userB: string[]) {
  var sims: [string, number][] = [];
  for (const i of userA) {
    const iVec = getTermVec(i);
    var termSims: number[] = userB.map(term => getCosSim(iVec, getTermVec(term)));
    var sim = Math.max(...termSims)
    // Add similarity if above min
    sim = (sim >= similarityMin) ? sim : 0;
    sims.push([i, sim]);
  }
  return sims;
}

/** This calculates the similarity of one user's terms to another user's terms */
export function getComparisonOfTerms(userA: string[], userB: string[]) {
  var sims: {[id: string]: number} = {};
  for (const i of userA) {
    const iVec = getTermVec(i);
    var termSims: number[] = userB.map(term => getCosSim(iVec, getTermVec(term)));
    var sim = Math.max(...termSims)
    // Add similarity if above min
    sim = (sim >= similarityMin) ? sim : 0;
    sims[i] = sim;
  }
  return sims;
}

export function getUserCategoryWeightsList(user: string[], terms: string[]) {
  var sims: [string, number][] = [];
  for (const userTerm of user) {
    const iVec = getTermVec(userTerm);
    var termSims: number[] = terms.map(term => getCosSim(iVec, getTermVec(term)));
    var sim = Math.max(...termSims)
    // Add similarity if above min
    sim = (sim >= similarityMin) ? sim : 0;
    sims.push([userTerm, sim]);
  }
  sims.sort((a, b) => {
    return b[1] - a[1]; 
  });
  return sims;
}

export function getUserCategoryWeights(user: string[], terms: string[]) {
  var sims: {[id: string]: number} = {};
  for (const userTerm of user) {
    const iVec = getTermVec(userTerm);
    var termSims: number[] = terms.map(term => getCosSim(iVec, getTermVec(term)));
    const sim = Math.max(...termSims)
    // Add similarity if above min
    sims[userTerm] = (sim >= similarityMin) ? sim : 0;
  }
  return sims;
}

/** This calculates the similarity between two users' bio terms */
export function getSimilarityOfTwoUsers(userA: string[], userB: string[]) {
  var sims: number[] = [];
  for (const i of userA) {
    const iVec = getTermVec(i);
    var termSims: number[] = userB.map(term => getCosSim(iVec, getTermVec(term)));
    var sim = Math.max(...termSims)
    // Add similarity if above min
    sim = (sim >= similarityMin) ? sim : 0;
    sims.push(sim);
  }
  for (const i of userB) {
    const iVec = getTermVec(i);
    var termSims: number[] = userA.map(term => getCosSim(iVec, getTermVec(term)));
    var sim = Math.max(...termSims)
    // Add similarity if above min
    sim = (sim >= similarityMin) ? sim : 0;
    sims.push(sim);
  }
  var average = sims.reduce((a, b) => a + b) / sims.length;
  return average;
}

/**
 * This calculates the similarities of every user pair, across all users
 * Format is [usernameA, usernameB, similarityScore][]
 */
export function getSimilarityOfAllUsers(userTerms: {[id: string]: string[]}) {
  var pairsEncountered: string[] = []
  var sims: [string, string, number][] = [];
  for (var usernameA of Object.keys(userTerms)) {
    var userA = userTerms[usernameA];
    for (var usernameB of Object.keys(userTerms)) {
      if (usernameB !== usernameA && !pairsEncountered.includes(usernameB + usernameA)) {
        var userB = userTerms[usernameB];
        var simScore = getSimilarityOfTwoUsers(userA, userB);
        sims.push([usernameA, usernameB, simScore]);
        pairsEncountered.push(usernameA + usernameB);
      }
    }
  }
  sims.sort((a, b) => {
    return b[2] - a[2]; 
  });
  return sims;
}

/** Get terms filtered to those in our word2vec or glove vocabulary */
export function filterTerms(userTerms: {[id: string]: string[]}) {
  var filteredTerms: {[id: string]: string[]} = {};
  for (var username of Object.keys(userTerms)) {
    filteredTerms[username] = userTerms[username].filter(term => (wordVecs as any).hasOwnProperty(term))
  }
  return filteredTerms;
}

export function diffN(n: number, word1: string, word2: string) {
  for (var ai = 1; ai < arguments.length; ai++) {
    if (!(wordVecs as any).hasOwnProperty(arguments[ai])) {
      return [false, arguments[ai]];
    }
  }

  return getNClosestMatches(
    n,
    subVecs((wordVecs as any)[word1], (wordVecs as any)[word2])
  ); 
}

export function composeN(n: number, word1: string, word2: string) {
  for (var ai = 1; ai < arguments.length; ai++) {
    if (!(wordVecs as any).hasOwnProperty(arguments[ai])) {
      return [false, arguments[ai]];
    }
  }

  return getNClosestMatches(
    n,
    addVecs((wordVecs as any)[word1], (wordVecs as any)[word2])
  ); 
}

export function mixAndMatchN(n: number, sub1: string, sub2: string, add1: string) {
  for (var ai = 1; ai < arguments.length; ai++) {
    if (!(wordVecs as any).hasOwnProperty(arguments[ai])) {
      return [false, arguments[ai]];
    }
  }

  return getNClosestMatches(
    n,
    addVecs((wordVecs as any)[add1], subVecs((wordVecs as any)[sub1], (wordVecs as any)[sub2]))
  ); 
}

/**
 * Find similar words, modified to find in all 25k words
 */
 export function findSimilarWords(n: number, word: string) {
  var vec = [];
  if ((wordVecs as any).hasOwnProperty(word)) {
    vec = (wordVecs as any)[word];
  }
  else {
    return [];
  }

  return getNClosestMatches(
    n, vec
  );
}

export function getNClosestMatches(n: number, vec: number[]) {
  var sims: [string, number][] = [];
  for (var word in (wordVecs as any)) {
    var sim = getCosSim(vec, (wordVecs as any)[word]);
    sims.push([word, sim]);
  }
  sims.sort((a, b) => {
    return b[1] - a[1]; 
  });
  return sims.slice(0, n);
}

export function getNClosestMatchesOnVec(n: number, vec: number[], wordVec: any) {
  var sims: [string, number][] = [];
  for (var word in wordVec) {
    var sim = getCosSim(vec, wordVec[word]);
    sims.push([word, sim]);
  }
  sims.sort((a, b) => {
    return b[1] - a[1]; 
  });
  return sims.slice(0, n);
}

/********************
 * helper functions */
export function getCosSim(f1: number[], f2: number[]) {
  return Math.abs(f1.reduce((sum, a, idx) => {
    return sum + a*f2[idx];
  }, 0)/(mag(f1)*mag(f2))); //magnitude is 1 for all feature vectors
}

export function mag(a: number[]) {
  return Math.sqrt(a.reduce((sum, val) => {
    return sum + val*val;  
  }, 0));
}

export function norm(a: number[]) {
  var magValue = mag(a);
  return a.map((val) => {
    return val/magValue; 
  });
}

export function addVecs(a: number[], b: number[]) {
  return a.map((val, idx) => {
    return val + b[idx]; 
  });
}

export function subVecs(a: number[], b: number[]) {
  return a.map((val, idx) => {
    return val - b[idx]; 
  });
}

// export function getVecs() {
//   return {
//     diffN: diffN,
//     composeN: composeN,
//     findSimilarWords: findSimilarWords,
//     mixAndMatchN: mixAndMatchN,
//     addVecs: addVecs,
//     subVecs: subVecs,
//     getNClosestMatches: getNClosestMatches,
//     getCosSim: getCosSim
//   };
// }
