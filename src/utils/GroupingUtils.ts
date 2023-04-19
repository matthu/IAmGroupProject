
/** A utility class for grouping most similar users */

const groupSize = 4;

/**
 * Get the optimal user groupings.
 * 
 * Works by grouping the most similarity pair of users, then filling in the rest of the group with the most
 * similar user to a user already in the group.
 */
export function getOptimalGroups(userPairSimilarity: [string, string, number][]): string[][] {
  // Sort by highest to lowest
  let similarities = userPairSimilarity;
  // Total list of groups
  let groups: string[][] = [];
  // Total list of users already grouped
  const groupedUsers: string[] = [];
  // Go thrigh entire list of user pair similarities
  while (similarities.length) {
    // Get first item
    const userPairSimilarity = similarities[0] as [string, string, number];
    similarities = similarities.slice(1);
    // Get item values
    const user1 = userPairSimilarity[0];
    const user2 = userPairSimilarity[1];
    const similarity = userPairSimilarity[2];
    // If neither user already group, then group together 
    if (!groupedUsers.includes(user1) && !groupedUsers.includes(user2)) {
      const group = [user1, user2];
      const groupSimilarities: number[] = [similarity];
      groupedUsers.push(user1);
      groupedUsers.push(user2);
      // Now try to fill the group with the highest similar available users
      for (let i = 0; i < groupSize - 2; i++) {
        // Find the highest similar user not already grouped
        const mostSimilarPair = similarities.find(item =>
          (group.includes(item[0]) && !group.includes(item[1]) && !groupedUsers.includes(item[1])) ||
          (group.includes(item[1]) && !group.includes(item[0]) && !groupedUsers.includes(item[0])))
        // Now add most similar new user
        if (mostSimilarPair && group.includes(mostSimilarPair[0])) {
          group.push(mostSimilarPair[1]);
          groupedUsers.push(mostSimilarPair[1]);
          groupSimilarities.push(mostSimilarPair[2]);
        } else if (mostSimilarPair && group.includes(mostSimilarPair[1])) {
          group.push(mostSimilarPair[0]);
          groupedUsers.push(mostSimilarPair[0]);
          groupSimilarities.push(mostSimilarPair[2]);
        }
      }
      const groupSimilarityAvg = groupSimilarities.reduce((a, b) => a + b) / groupSimilarities.length;
      console.log("Group " + (groups.length + 1) + " Avg Similarity: " + groupSimilarityAvg.toString());
      // Add new group to groups list
      groups.push(group);
    }
  }
  return groups;
}
