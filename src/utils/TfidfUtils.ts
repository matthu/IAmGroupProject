import { getBioTokens } from "./BioTokenizer";

class TfidfUtils {

    private bioTokens: {[id: string]: string[]};
  
    constructor(bioTokens: {[id: string]: string[]}) {
      this.bioTokens = bioTokens;
    }
  
    private computeTF(bio: string[], terms: string[]): {[term: string]: number} {
      const termFrequency: {[term: string]: number} = {};
      const totalTerms = bio.length;
      terms.forEach((term) => {
        const count = bio.filter((word) => word === term).length;
        // Matthew: shouldn't this just be the log of count + 1? I thought this was taught in the class
        // termFrequency[term] = count / totalTerms;
        termFrequency[term] = Math.log10(1 + count);
        // termFrequency[term] = count;
      });
      return termFrequency;
    }
  
    private computeIDF(bios: string[][], term: string): number {
      let count = 0;
      for (let i = 0; i < bios.length; i++) {
        if (bios[i].includes(term)) {
          count++;
        }
      }
      // Matthew: why count + 1? Shouldn't it just be count since count is not 0 based?
      // return Math.log(bios.length / (count + 1));
      return Math.log10(bios.length / count);
    }
  
    public computeTFIDF(): {[id: string]: {[term: string]: number}} {
      const tfidf: {[id: string]: {[term: string]: number}} = {};
      const bios: string[][] = Object.values(this.bioTokens);
      const allTerms: string[] = Array.from(new Set(bios.flat()));
  
      for (const [username, bio] of Object.entries(this.bioTokens)) {
        const tf: {[term: string]: number} = this.computeTF(bio, allTerms);
        tfidf[username] = {};
        for (const term of Object.keys(tf)) {
          const idf = this.computeIDF(bios, term);
          if (tf[term] * idf > 0){
            tfidf[username][term] = tf[term] * idf;
          }
          
        }
      }
  
      return tfidf;
    }
  }

  const bioTokens = getBioTokens();
  
  const tfidf = new TfidfUtils(bioTokens);
  export const tfidfScores = tfidf.computeTFIDF();

  