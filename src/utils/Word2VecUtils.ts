import wordVecs from "../data/wordvecs10000.json";

/******************\
|  Word2Vec Utils  |
| @author Anthony  |
| @version 0.2.1   |
| @date 2016/01/08 |
| @edit 2016/01/08 |
\******************/

class Word2VecUtils {
  

  /**********
   * config */

  /*************
   * constants */
  // var WORDS = Object.keys((wordVecs as any));

  /*********************
   * working variables */

  /******************
   * work functions */
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

  findSimilarWords(n: number, word: string) {
    if (!(wordVecs as any).hasOwnProperty(word)) {
      return [];
    }

    return this.getNClosestMatches(
      n, (wordVecs as any)[word]
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
