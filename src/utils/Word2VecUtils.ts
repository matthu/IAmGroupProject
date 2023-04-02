// import wordVecs2 from "../data/wordvecs10000.json";
import wordVecs1 from "../data/wordvecs25000.1.json";
import wordVecs2 from "../data/wordvecs25000.2.json";


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

  filterTerms(userTerms: {[id: string]: string[]}) {
    var filteredTerms: {[id: string]: string[]} = {};
    for (var username of Object.keys(userTerms)) {
      filteredTerms[username] = userTerms[username].filter(term => (wordVecs1 as any).hasOwnProperty(term))
    }
    return filteredTerms;
  }

  diffN(n: number, word1: string, word2: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!(wordVecs1 as any).hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return this.getNClosestMatches(
      n,
      this.subVecs((wordVecs1 as any)[word1], (wordVecs1 as any)[word2])
    ); 
  }

  composeN(n: number, word1: string, word2: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!(wordVecs1 as any).hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return this.getNClosestMatches(
      n,
      this.addVecs((wordVecs1 as any)[word1], (wordVecs1 as any)[word2])
    ); 
  }

  mixAndMatchN(n: number, sub1: string, sub2: string, add1: string) {
    for (var ai = 1; ai < arguments.length; ai++) {
      if (!(wordVecs1 as any).hasOwnProperty(arguments[ai])) {
        return [false, arguments[ai]];
      }
    }

    return this.getNClosestMatches(
      n,
      this.addVecs((wordVecs1 as any)[add1], this.subVecs((wordVecs1 as any)[sub1], (wordVecs1 as any)[sub2]))
    ); 
  }

  /**
   * Find similar words, modified to find in all 25k words
   */
  findSimilarWords(n: number, word: string) {
    var vec = [];
    if ((wordVecs1 as any).hasOwnProperty(word)) {
      vec = (wordVecs1 as any)[word];
    }
    else if ((wordVecs2 as any).hasOwnProperty(word)) {
      vec = (wordVecs2 as any)[word];
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
    var sims1: [string, number][] = [];
    for (var word in (wordVecs1 as any)) {
      var sim = this.getCosSim(vec, (wordVecs1 as any)[word]);
      sims1.push([word, sim]);
    }
    sims1.sort((a, b) => {
      return b[1] - a[1]; 
    });
    sims = sims1.slice(0, n);

    var sims2: [string, number][] = [];
    for (var word in (wordVecs2 as any)) {
      var sim = this.getCosSim(vec, (wordVecs2 as any)[word]);
      sims2.push([word, sim]);
    }
    sims2.sort((a, b) => {
      return b[1] - a[1]; 
    });
    sims = sims.concat(sims2.slice(0, n));

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
