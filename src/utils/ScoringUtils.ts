import { getConcretenessValues } from "./ConcretenessUtils";
import { getComparisonOfTerms, getUserCategoryWeights } from "./Word2VecUtils";

export const similarityWeight = 1.0;
export const categoryWeight = 1.0;
export const concretenessWeight = 0.5;
export const tfidfWeight = 2.0;

export const kTopSimilarWords = 5;

/**
 * This calculates the final weight of a single user, given similarity, category, and tf-idf weights
 */
export function getFinalWeightOfUser(similarityWeights: {[id: string]: number}, categoryWeights: {[id: string]: number}, tfidfWeights: {[id: string]: number}, concretenessWeights: {[id: string]: number}) {
  let finalWeights: [string, number][] = [];
  for (const term of Object.keys(similarityWeights)) {
    const similarity = similarityWeights[term] ?? 0;
    const category = categoryWeights[term] ?? 0;
    const tfidf = tfidfWeights[term] ?? 0;
    const concreteness = concretenessWeights[term] ?? 0;
    finalWeights.push([term, (similarity * similarityWeight) + (category * categoryWeight) + (tfidf * tfidfWeight) + (concreteness * concretenessWeight)]);
  }
  finalWeights = finalWeights.sort((a, b) => {
    return b[1] - a[1]; 
  });
  return finalWeights.slice(0, kTopSimilarWords);
}

/**
 * This calculates the similarities of every user pair, across all users
 * Format is [usernameA, usernameB, similarityScore][]
 */
export function getFinalSimilarityOfAllUsers(userTerms: {[id: string]: string[]}, categories: string[], tfidfScores: {[id: string]: {[term: string]: number; }}) {
  // Precalculate category and tf-idf user weights
  var userWeights: {[username: string]: {[term: string]: number}} = {};
  for (var username of Object.keys(userTerms)) {
    userWeights[username] = {};
    var categoryWeights = getUserCategoryWeights(userTerms[username], categories);
    var tfidfWeights = tfidfScores[username];
    var concretenessWeights = getConcretenessValues(userTerms[username]);
    for (var term of userTerms[username]) {
      userWeights[username][term] = (categoryWeights[term] * categoryWeight) + (tfidfWeights[term] * tfidfWeight) + (concretenessWeights[term] * concretenessWeight);
    }
  }
  
  // Now compute similarities between all users, adding in the precalculated category and user weights
  var pairsEncountered: string[] = []
  var sims: [string, string, number][] = [];
  for (var usernameA of Object.keys(userTerms)) {
    var userA = userTerms[usernameA];
    for (var usernameB of Object.keys(userTerms)) {
      if (usernameB !== usernameA && !pairsEncountered.includes(usernameB + usernameA)) {
        var userB = userTerms[usernameB];
        var weights: number[] = [];

        // Get comparison of A to B
        var simScoresA = getComparisonOfTerms(userA, userB);
        // Add weights
        var weightsA: number[] = [];
        for (var simTerm of Object.keys(simScoresA)) {
          var weight = userWeights[usernameA][simTerm];
          weightsA.push(simScoresA[simTerm] * similarityWeight + weight);
        }
        weightsA.sort((a, b) => {
          return b - a; 
        });
        weights = weights.concat(weightsA.slice(0, kTopSimilarWords));

        // Get comparison of B to A
        var simScoresB = getComparisonOfTerms(userB, userA);
        // Add weights
        var weightsB: number[] = [];
        for (var simTerm of Object.keys(simScoresB)) {
          var weight = userWeights[usernameB][simTerm];
          weightsB.push(simScoresB[simTerm] * similarityWeight + weight);
        }
        weightsB.sort((a, b) => {
          return b - a; 
        });
        weights = weights.concat(weightsB.slice(0, kTopSimilarWords));

        var score = weights.reduce((a, b) => a + b) / (kTopSimilarWords * 2);
        sims.push([usernameA, usernameB, score]);
        pairsEncountered.push(usernameA + usernameB);
      }
    }
  }
  sims.sort((a, b) => {
    return b[2] - a[2]; 
  });
  return sims;
}
