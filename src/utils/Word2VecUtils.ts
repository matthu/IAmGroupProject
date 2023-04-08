// import wordVecs2 from "../data/wordvecs10000.json";
// import wordVecs1 from "../data/wordvecs25000.1.json";
// import wordVecs2 from "../data/wordvecs25000.2.json";
// import wordVecs from "../data/word2Vecs.json";
import wordVecs from "../data/gloveVecs.json";


class Word2VecUtils {

  /**********
   * config */

  /*************
   * constants */
  // var WORDS = Object.keys((wordVecs as any));

  /*********************
   * working variables */

  /**
   * Work functions
   */

  getTermVec(term: string): number[] {
    if ((wordVecs as any).hasOwnProperty(term)) {
      return (wordVecs as any)[term];
    }
    // else if ((wordVecs2 as any).hasOwnProperty(term)) {
    //   return (wordVecs2 as any)[term];
    // }
    else {
      return [];
    }
  }

  getNSimilarTermsToTerm(n: number, userTerms: {[id: string]: string[]}, term: string) {
    var vec = this.getTermVec(term);

    var termSimilarities: {[id: string]: [string, number][]} = {};
    for (var username of Object.keys(userTerms)) {
      var sims: [string, number][] = [];
      for (var userTerm of userTerms[username]) {
        var termVec = this.getTermVec(userTerm);
        var sim = this.getCosSim(vec, termVec);
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

  getComparisonOfTerms(userA: string[], userB: string[]) {
    var sims: [string, number][] = [];
    for (const i of userA) {
      const iVec = this.getTermVec(i);
      var termSims: number[] = userB.map(term => this.getCosSim(iVec, this.getTermVec(term)));
      const sim = Math.max(...termSims)
      sims.push([i, sim]);
    }
    return sims;
  }

  getSimilarityOfTwoUsers(userA: string[], userB: string[]) {
    var sims: number[] = [];
    for (const i of userA) {
      const iVec = this.getTermVec(i);
      var termSims: number[] = userB.map(term => this.getCosSim(iVec, this.getTermVec(term)));
      const sim = Math.max(...termSims)
      sims.push(sim);
    }
    for (const i of userB) {
      const iVec = this.getTermVec(i);
      var termSims: number[] = userA.map(term => this.getCosSim(iVec, this.getTermVec(term)));
      const sim = Math.max(...termSims)
      sims.push(sim);
    }
    var average = sims.reduce((a, b) => a + b) / sims.length;
    return average;
  }

  getSimilarityOfAllUsers(userTerms: {[id: string]: string[]}) {
    var pairsEncountered: string[] = []
    var sims: [string, string, number][] = [];
    for (var usernameA of Object.keys(userTerms)) {
      var userA = userTerms[usernameA];
      for (var usernameB of Object.keys(userTerms)) {
        if (usernameB !== usernameA && !pairsEncountered.includes(usernameB + usernameA)) {
          var userB = userTerms[usernameB];
          var simScore = this.getSimilarityOfTwoUsers(userA, userB);
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

  filterTerms(userTerms: {[id: string]: string[]}) {
    var filteredTerms: {[id: string]: string[]} = {};
    for (var username of Object.keys(userTerms)) {
      filteredTerms[username] = userTerms[username].filter(term => (wordVecs as any).hasOwnProperty(term))
    }
    return filteredTerms;
  }

  diffN(n: number, word1: string, word2: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!(wordVecs as any).hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return this.getNClosestMatches(
      n,
      this.subVecs((wordVecs as any)[word1], (wordVecs as any)[word2])
    ); 
  }

  composeN(n: number, word1: string, word2: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!(wordVecs as any).hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return this.getNClosestMatches(
      n,
      this.addVecs((wordVecs as any)[word1], (wordVecs as any)[word2])
    ); 
  }

  mixAndMatchN(n: number, sub1: string, sub2: string, add1: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!(wordVecs as any).hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return this.getNClosestMatches(
      n,
      this.addVecs((wordVecs as any)[add1], this.subVecs((wordVecs as any)[sub1], (wordVecs as any)[sub2]))
    ); 
  }

  /**
   * Find similar words, modified to find in all 25k words
   */
  findSimilarWords(n: number, word: string) {
    var vec = [];
    if ((wordVecs as any).hasOwnProperty(word)) {
      vec = (wordVecs as any)[word];
    }
    else {
      return [];
    }

    return this.getNClosestMatches(
      n, vec
    );
  }

  getNClosestMatches(n: number, vec: number[]) {
    var sims: [string, number][] = [];
    for (var word in (wordVecs as any)) {
      var sim = this.getCosSim(vec, (wordVecs as any)[word]);
      sims.push([word, sim]);
    }
    sims.sort((a, b) => {
      return b[1] - a[1]; 
    });
    return sims.slice(0, n);
  }

  getNClosestMatchesOnVec(n: number, vec: number[], wordVec: any) {
    var sims: [string, number][] = [];
    for (var word in wordVec) {
      var sim = this.getCosSim(vec, wordVec[word]);
      sims.push([word, sim]);
    }
    sims.sort((a, b) => {
      return b[1] - a[1]; 
    });
    return sims.slice(0, n);
  }

  /********************
   * helper functions */
  getCosSim(f1: number[], f2: number[]) {
    return Math.abs(f1.reduce((sum, a, idx) => {
      return sum + a*f2[idx];
    }, 0)/(this.mag(f1)*this.mag(f2))); //magnitude is 1 for all feature vectors
  }

  mag(a: number[]) {
    return Math.sqrt(a.reduce((sum, val) => {
      return sum + val*val;  
    }, 0));
  }

  norm(a: number[]) {
    var magValue = this.mag(a);
    return a.map((val) => {
      return val/magValue; 
    });
  }

  addVecs(a: number[], b: number[]) {
    return a.map((val, idx) => {
      return val + b[idx]; 
    });
  }

  subVecs(a: number[], b: number[]) {
    return a.map((val, idx) => {
      return val - b[idx]; 
    });
  }

  getVecs() {
    return {
      diffN: this.diffN,
      composeN: this.composeN,
      findSimilarWords: this.findSimilarWords,
      mixAndMatchN: this.mixAndMatchN,
      addVecs: this.addVecs,
      subVecs: this.subVecs,
      getNClosestMatches: this.getNClosestMatches,
      getCosSim: this.getCosSim
    };
  }
};

export default Word2VecUtils; 
