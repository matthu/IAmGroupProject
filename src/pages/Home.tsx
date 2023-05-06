/**
 * Main home page that displays introduction content
 */

import { Accordion, AccordionDetails, AccordionSummary, Button, Link, makeStyles, TextField, Typography } from '@material-ui/core';
import { useMemo, useState } from 'react';
import { getBios, getBioTokens } from '../utils/BioTokenizer';
import { getConcretenessValues } from '../utils/ConcretenessUtils';
import { getOptimalGroups } from '../utils/GroupingUtils';
import { getFinalSimilarityOfAllUsers, getFinalWeightOfUser } from '../utils/ScoringUtils';
import { tfidfScores } from '../utils/TfidfUtils';
import { filterTerms, findSimilarWords, getComparisonOfTerms, getNSimilarTermsToTerm, getSimilarityOfAllUsers, getUserCategoryWeights } from '../utils/Word2VecUtils';
import ProfileImage from '../images/i-am-group-logo.png';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';

type Scores = Record<string, Record<string, number>>;

const useStyles = makeStyles(theme => ({
  root: {
  },
  flexContainer: {
    display: "flex"
  },
  profileImage: {
    borderRadius: '8px',
    width: '500px',
    height: "fit-content",
    marginRight: '30px',
  },
  textContainer: {
    display: 'inline-block',
    width: '100%',
    verticalAlign: 'top',
  },
  subtext: {
    paddingLeft: '15px',
  },
  subtitleText: {
    fontWeight: 700
  },
  subtitleDescription: {
    fontStyle: "italic"
  },
  accordionHeading: {
    fontWeight: "bold"
  },
  accordionDetails: {
    display: "block"
  },
  parametersContainer: {
    maxWidth: "300px",
    marginRight: "40px"
  },
  groupsContainer: {
    flex: 1
  },
  groupButton: {
    width: "100%",
    fontWeight: "bold"
  },
}));

/** The home page of the application */
function Home() {
  const classes = useStyles();

  /** Parameters */
  const similarityWeight = 1.0; // The weight to apply to similarity weights. I.e. "How much we should pay attention to similarity weights".
  const tfidfWeight = 0.8; // The weight to apply to tf-idf weights. I.e. "How much we should pay attention to tf-idf weights".
  const categoryWeight = 0.8; // The weight to apply to category weights. I.e. "How much we should pay attention to category weigths".

  /** The word to find similar words to */
  const [localWord, setLocalWord] = useState("")
  const [word, setWord] = useState("")
  const [localFindUsersTerm, setLocalFindUsersTerm] = useState("")
  const [findUsersTerm, setFindUsersTerm] = useState("")
  const [categories, setCategories] = useState(["sports", "programming", "hobby", "food"])
  const [localCategories, setLocalCategories] = useState(categories)
  const [filteredScores, setFilteredScores] = useState<Scores>({});
  const [filteredNames, setFilteredNames] = useState<Scores>({});
  const [inputValue, setInputValue] = useState('');
  const [usernameLookupValue, setUsernameLookupValue] = useState('');
  // User pair similarity
  const [localUserA, setLocalUserA] = useState("")
  const [userA, setUserA] = useState("")
  const [localUserB, setLocalUserB] = useState("")
  const [userB, setUserB] = useState("")

  /** Finding similar words */
  const similarities = useMemo(() => {
    return findSimilarWords(10, word);
  }, [word])

  /** The raw bios of users */
  const bios: { [username: string]: string } = useMemo(() => {
    // return {}; // Uncomment to not load data
    return getBios();
  }, [])

  /** The extracted tokens from bios */
  const bioTokens: { [username: string]: string[] } = useMemo(() => {
    // return {}; // Uncomment to not load data
    return getBioTokens();
  }, [])

  /** The terms filtered to those in our word2vec or glove vocabulary */
  const filteredTerms: { [username: string]: string[] } = useMemo(() => {
    return filterTerms(bioTokens);
  }, [bioTokens])

  /** These are interest weights to try to find most valuable words to us */

  const sportWeights = useMemo(() => {
    return getNSimilarTermsToTerm(10, filteredTerms, "sports");
  }, [filteredTerms])

  const programmingWeights = useMemo(() => {
    return getNSimilarTermsToTerm(10, filteredTerms, "programming");
  }, [filteredTerms])

  const hobbyWeights = useMemo(() => {
    return getNSimilarTermsToTerm(10, filteredTerms, "hobby");
  }, [filteredTerms])

  const foodWeights = useMemo(() => {
    return getNSimilarTermsToTerm(10, filteredTerms, "food");
  }, [filteredTerms])

  /** The users that have a specific term */
  const foundUsers: string[] = useMemo(() => {
    return Object.keys(filteredTerms).filter(username => filteredTerms[username].includes(findUsersTerm))
  }, [findUsersTerm, filteredTerms])

  /** This finds all unique terms in the vocabulary */
  const uniqueTerms = useMemo(() => {
    var terms = new Set<string>();
    for (var username of Object.keys(bioTokens)) {
      for (var term of bioTokens[username]) {
        terms.add(term);
      }
    }
    return Array.from(terms.values()).sort();
  }, [bioTokens])

  const uniqueTermsList = useMemo(() => {
    var terms = [];
    for (var term of uniqueTerms) {
      terms.push({
        label: term.slice(0,1).toUpperCase() + term.slice(1),
        value: term
      });
    }
    return Array.from(terms.values()).sort();
  }, [uniqueTerms])

  /** These calculate the similarity between two users */

  const similarityWeightsA = useMemo(() => {
    if (userA && userB) {
      return getComparisonOfTerms(filteredTerms[userA], filteredTerms[userB]);
    }
    return {};
  }, [filteredTerms, userA, userB])

  const similarityWeightsB = useMemo(() => {
    if (userA && userB) {
      return getComparisonOfTerms(filteredTerms[userB], filteredTerms[userA]);
    }
    return {};
  }, [filteredTerms, userA, userB])

  /** These calculate the weights from the categories for the two users */

  const categoryWeightsA = useMemo(() => {
    if (userA && userB) {
      return getUserCategoryWeights(filteredTerms[userA], categories);
    }
    return {};
  }, [filteredTerms, userA, categories])

  const categoryWeightsB = useMemo(() => {
    if (userA && userB) {
      return getUserCategoryWeights(filteredTerms[userB], categories);
    }
    return {};
  }, [filteredTerms, userB, categories])

  /** These calculate the weights from the categories for the two users */

  const concretenessWeightsA = useMemo(() => {
    if (filteredTerms && filteredTerms[userA]) {
      return getConcretenessValues(filteredTerms[userA]);
    }
    return {};
  }, [filteredTerms, userA])

  const concretenessWeightsB = useMemo(() => {
    if (filteredTerms && filteredTerms[userB]) {
      return getConcretenessValues(filteredTerms[userB]);
    }
    return {};
  }, [filteredTerms, userB])

  /** These are the TF-IDF weights for the two users */

  const tfidfWeightsA = useMemo(() => {
    if (userA && userB) {
      return tfidfScores[userA];
    }
    return {};
  }, [tfidfScores, userA])

  const tfidfWeightsB = useMemo(() => {
    if (userA && userB) {
      return tfidfScores[userB];
    }
    return {};
  }, [tfidfScores, userB])

  /** These calculate the weights from the categories for the two users */

  const finalWeightsA = useMemo(() => {
    return getFinalWeightOfUser(similarityWeightsA, categoryWeightsA, tfidfWeightsA, concretenessWeightsA);
  }, [similarityWeightsA, categoryWeightsA, tfidfWeightsA, concretenessWeightsA])

  const finalWeightsB = useMemo(() => {
    return getFinalWeightOfUser(similarityWeightsB, categoryWeightsB, tfidfWeightsB, concretenessWeightsB);
  }, [similarityWeightsB, categoryWeightsB, tfidfWeightsB, concretenessWeightsB])
  
  /** 
   * This calculates the similarities of every user pair, across all users
   * Format is [userA, userB, similarityScore][]
   */
  const userSimilarities: [string, string, number][] = useMemo(() => {
    return getSimilarityOfAllUsers(filteredTerms).slice(0, 50);
  }, [filteredTerms])

  /** 
   * This calculates the similarities of every user pair, across all users
   * Format is [userA, userB, similarityScore][]
   */
   const userFinalSimilarities: [string, string, number][] = useMemo(() => {
    return getFinalSimilarityOfAllUsers(filteredTerms, categories, tfidfScores);
  }, [filteredTerms, categories])


  const userGroupings: string[][] = useMemo(() => {
    return getOptimalGroups(userFinalSimilarities);
  }, [userFinalSimilarities])

  function handleLookup(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value.trim());
  }
  // function to simply get the terms 
  function handleTerm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inputValue) {
      setFilteredScores({});
    } else {
      setFilteredScores(
        Object.entries(tfidfScores).reduce((acc: Scores, [username, scores]) => {
          const filtered = Object.entries(scores).filter(([term]) =>
            term.toLowerCase().includes(inputValue.toLowerCase())
          );
          if (filtered.length) {
            acc[username] = Object.fromEntries(filtered);
          }
          return acc;
        }, {})
      );
    }
  }
  // function to get the users and the terms 
  const handleUsernameLookup = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameLookupValue(event.target.value);
    if (!event.target.value) {
      setFilteredNames({});
    } else {
      setFilteredNames(
        Object.entries(tfidfScores)
          .filter(([username]) => username.toLowerCase().includes(event.target.value.trim().toLowerCase()))
          .reduce((acc: Scores, [username, scores]) => {
            acc[username] = scores;
            return acc;
          }, {})
      );
    }
  };

  // Get user names
  const getUserNames = (names: string[]) => {
    return names.map(name => getUserName(name));
  };

  const getUserName = (name: string) => {
    const parts = name.split("-");
    return parts.map(part => part.slice(0,1).toUpperCase() + part.slice(1)).join(" ")
  };

  return (
    <div>
      <div className={classes.textContainer}>
        <div className={classes.flexContainer}>
          <img className={classes.profileImage} src={ProfileImage} alt="I Am Group Logo"/>
          <div>
            <Typography variant='h5'>Introduction</Typography>
            <br />
            <Typography variant='subtitle1'>I AM GROUP is a unique group recommender tool used for grouping similar students together into groups of 4 by only analysing bios.</Typography>
            <br />
            <Typography variant='subtitle1'>It achieves this by comparing bio terms between students and assessing the relatedness to emphasis categories using word embeddings, while weighing by TF-IDF and concreteness scores. In the end, the tool is meant to generate most-similar groupings of students to increase performance and minimize interpersonal conflict within the groups.</Typography>
            <br />
            <Typography variant='subtitle1'>I AM GROUP was created by Evelyn Crowe, Matthew Kocmoud, Sergio Herrera, and Siddhant Thakur for CSCE 670 Spring '23, taught by Dr. Caverlee.</Typography>
          </div>
        </div>
        <br />
        <div className={classes.flexContainer}>
          <div className={classes.parametersContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.groupButton}
              onClick={() => setCategories(localCategories)}
            >
              Generate Groups
            </Button>
            <br />
            <br />
            <br />
            <Autocomplete
              multiple
              id="tags-standard"
              options={uniqueTermsList}
              getOptionLabel={(option) => option.label}
              defaultValue={uniqueTermsList.filter(item => localCategories.includes(item.value))}
              onChange={(event, items) => setLocalCategories(items.map(item => item.value))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ backgroundColor: "white" }}
                  variant="outlined"
                  label="Focus Categories"
                  placeholder="Select categories"
                />
              )}
            />
          </div>
          <div className={classes.groupsContainer}>
            <Typography variant='h5'>Groups</Typography>
            <br />
            <div>
              {userGroupings.map((group, index) =>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography className={classes.accordionHeading} style={{ minWidth: "100px" }}>Group {index + 1}</Typography>
                    <Typography>{getUserNames(group).join(", ")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.accordionDetails} style={{ paddingTop: "0px" }}>
                    <table>
                      {group.map(name =>
                        <tr>
                          <td style={{ borderTop: "1px solid #ccc", padding: "5px 5px 5px 0px"}}>
                            {getUserName(name)}
                          </td>
                          <td style={{ borderTop: "1px solid #ccc", padding: "5px 5px 5px 20px" }}>
                            {bios[name]}
                          </td>
                        </tr>
                      )}
                    </table>
                  </AccordionDetails>
                </Accordion>
              )}
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.accordionHeading}>Calculation Details</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <div>
                <br />
                <Typography className={classes.subtitleText}>Lookups:</Typography>
                <br />
                <TextField
                  label="Lookup Users with Term"
                  variant="outlined"
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      setFindUsersTerm(localFindUsersTerm);
                    }
                  }}
                  onChange={(e) => setLocalFindUsersTerm(e.target.value)}
                />
                {foundUsers.map((username) => <Typography>{username}</Typography>)}
                <br />
                <br />
                <form onSubmit={handleTerm}>
                  <TextField
                    label="Lookup TF-IDF Term"
                    variant="outlined"
                    value={inputValue}
                    onChange={handleLookup}
                  />
                </form>
                {Object.entries(filteredScores).map(([username, scores]) =>
                  <Typography>
                    {username + ": " +
                      Object.entries(scores).map(([term, score]) => score.toFixed(10)).join(", ")
                    }
                  </Typography>
                )}
                <br />
                <TextField
                  label="Lookup Username"
                  variant="outlined"
                  value={usernameLookupValue}
                  onChange={handleUsernameLookup}
                />
                {Object.entries(filteredNames).map(([username, scores]) =>
                    Object.entries(scores).map(([term, score]) => 
                      <Typography>{term + ": " + score.toFixed(10)}</Typography>
                    )
                )}
              </div>
              <br />
              <TextField
                label="Top 10 Similar Words"
                variant="outlined"
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    setWord(localWord);
                  }
                }}
                onChange={(e) => setLocalWord(e.target.value)}
              />
              <br />
              {similarities.map((item) => <Typography>{item[0]}: {item[1]}</Typography>)}
              <br />
              <br />
              <Typography className={classes.subtitleText}>User Pair Similarity Score:</Typography>
              <br />
              <TextField
                label="User A"
                variant="outlined"
                value={localUserA || ""}
                InputLabelProps={{ shrink: true }}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    if (localUserA && localUserB) {
                      setUserA(localUserA);
                      setUserB(localUserB);
                    } else {
                      setUserA("");
                      setUserB("");
                    }
                  }
                }}
                onChange={(e) => setLocalUserA(e.target.value)}
              />
              <TextField
                label="User B"
                variant="outlined"
                value={localUserB || ""}
                InputLabelProps={{ shrink: true }}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    if (localUserA && localUserB) {
                      setUserA(localUserA);
                      setUserB(localUserB);
                    } else {
                      setUserA("");
                      setUserB("");
                    }
                  }
                }}
                onChange={(e) => setLocalUserB(e.target.value)}
                style={{ marginLeft: "20px" }}
              />
              <div id='comparison'>
              {userA && userB &&
                <>
                  <br />
                  <br />
                  <Typography className={classes.subtitleText}>Original Slack Bios:</Typography>
                  <br />
                  <Typography>{userA}:</Typography>
                  <Typography>{bios[userA]}</Typography>
                  <br />
                  <Typography>{userB}:</Typography>
                  <Typography>{bios[userB]}</Typography>
                  <br />
                  <Typography className={classes.subtitleText}>User Pair Similarity:</Typography>
                  <Typography className={classes.subtitleDescription}>For each term of a user's bio, find the max similarity value to the other user's bio's terms.</Typography>
                  <br />
                  <Typography>{userA} to {userB} Average: {Object.values(similarityWeightsA).reduce((a, b) => a + b) / Object.keys(similarityWeightsA).length}</Typography>
                  <Typography>{Object.keys(similarityWeightsA).sort((a, b) => similarityWeightsA[a] > similarityWeightsA[b] ? -1 : 1).map(item => item + ": " + similarityWeightsA[item]).join(", ")}</Typography>
                  <br />
                  <Typography>{userB} to {userA} Average: {Object.values(similarityWeightsB).reduce((a, b) => a + b) / Object.keys(similarityWeightsB).length}</Typography>
                  <Typography>{Object.keys(similarityWeightsB).sort((a, b) => similarityWeightsB[a] > similarityWeightsB[b] ? -1 : 1).map(item => item + ": " + similarityWeightsB[item]).join(", ")}</Typography>
                  <Typography>Pair Similarity Average: {Object.values(similarityWeightsA).concat(Object.values(similarityWeightsB)).reduce((a, b) => a + b) / (Object.keys(similarityWeightsA).length + Object.keys(similarityWeightsB).length)}</Typography>
                  <br />
                  <Typography className={classes.subtitleText}>Category Weights:</Typography>
                  <Typography className={classes.subtitleDescription}>For each term, find the max similarity value to the list of categories.</Typography>
                  <br />
                  <Typography>{userA}:</Typography>
                  <Typography>{Object.keys(categoryWeightsA).sort((a, b) => categoryWeightsA[a] > categoryWeightsA[b] ? -1 : 1).map(item => item + ": " + categoryWeightsA[item]).join(", ")}</Typography>
                  <br />
                  <Typography>{userB}:</Typography>
                  <Typography>{Object.keys(categoryWeightsB).sort((a, b) => categoryWeightsB[a] > categoryWeightsB[b] ? -1 : 1).map(item => item + ": " + categoryWeightsB[item]).join(", ")}</Typography>
                  <br />
                  <Typography className={classes.subtitleText}>Concreteness Weights:</Typography>
                  <Typography className={classes.subtitleDescription}>For each term, find the concreteness value.</Typography>
                  <br />
                  <Typography>{userA}:</Typography>
                  <Typography>{Object.keys(concretenessWeightsA).sort((a, b) => concretenessWeightsA[a] > concretenessWeightsA[b] ? -1 : 1).map(item => item + ": " + concretenessWeightsA[item]).join(", ")}</Typography>
                  <br />
                  <Typography>{userB}:</Typography>
                  <Typography>{Object.keys(concretenessWeightsB).sort((a, b) => concretenessWeightsB[a] > concretenessWeightsB[b] ? -1 : 1).map(item => item + ": " + concretenessWeightsB[item]).join(", ")}</Typography>
                  <br />
                  <Typography className={classes.subtitleText}>TF-IDF Weights:</Typography>
                  <Typography className={classes.subtitleDescription}>For each term, calculate the tf-idf score. Score should be between 0 - 1, with 1 representing the most rare words.</Typography>
                  <br />
                  <Typography>{userA}:</Typography>
                  <Typography>{Object.keys(tfidfWeightsA).sort((a, b) => tfidfWeightsA[a] > tfidfWeightsA[b] ? -1 : 1).map(item => item + ": " + tfidfWeightsA[item]).join(", ")}</Typography>
                  <br />
                  <Typography>{userB}:</Typography>
                  <Typography>{Object.keys(tfidfWeightsB).sort((a, b) => tfidfWeightsB[a] > tfidfWeightsB[b] ? -1 : 1).map(item => item + ": " + tfidfWeightsB[item]).join(", ")}</Typography>
                  <br />
                  <Typography className={classes.subtitleText}>Final Similarity Weights:</Typography>
                  <Typography className={classes.subtitleDescription}>Multiply similarity, category, and tf-idf weights to find the final user-pair similarity score.</Typography>
                  <br />
                  <Typography>{userA}:</Typography>
                  <Typography>Average: {finalWeightsA.map(item => item[1]).reduce((a, b) => a + b) / Object.keys(finalWeightsA).length}</Typography>
                  <Typography>{finalWeightsA.map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
                  <br />
                  <Typography>{userB}:</Typography>
                  <Typography>Average: {finalWeightsB.map(item => item[1]).reduce((a, b) => a + b) / Object.keys(finalWeightsB).length}</Typography>
                  <Typography>{finalWeightsB.map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
                  <br />
                  <Typography className={classes.subtitleText}>Final Pair Similarity Score: {finalWeightsA.concat(finalWeightsB).map(item => item[1]).reduce((a, b) => a + b) / (finalWeightsA.length + finalWeightsB.length)}</Typography>
                </>
              }</div>
              <br />
              <br />
              <Typography className={classes.subtitleText}>User Groupings:</Typography>
              <br />
              {userGroupings.map((item, index) =>
                <Typography>{"Group " + (index + 1) + ": " + item.join(", ")}</Typography>)}
              <br />
              <br />
              <Typography className={classes.subtitleText}>Top 50 User Similarity Pairs:</Typography>
              <br />
              {userFinalSimilarities.slice(0, 50).map(item =>
                <Typography><div style={{ display: "inline-block", width: "400px" }}>{item[0] + " - " + item[1] + ": "}</div><div style={{ display: "inline-block", width: "200px" }}>{item[2]}</div><Link onClick={() => { setUserA(item[0]); setLocalUserA(item[0]); setUserB(item[1]); setLocalUserB(item[1]); window.location.href="#comparison"}}>Compare</Link></Typography>)}
              <br />
              <Typography className={classes.subtitleText}>User Bio Tokens:</Typography>
              <br />
              {Object.keys(bioTokens).map((username) =>
                <>
                  <Typography><b>{username}</b>:</Typography>
                  <Typography className={classes.subtext}><b><i>Original</i></b>: {bios[username]}</Typography>
                  <Typography className={classes.subtext}><b><i>Terms</i></b>: {bioTokens[username].join(", ")}</Typography>
                  <Typography className={classes.subtext}><b><i>Word2Vec Terms</i></b>: {filteredTerms[username].join(", ")}</Typography>
                  <Typography className={classes.subtext}><b><i>"Sports" Similarities</i></b>: {sportWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
                  <Typography className={classes.subtext}><b><i>"Programming" Similarities</i></b>: {programmingWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
                  <Typography className={classes.subtext}><b><i>"Food" Similarities</i></b>: {foodWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
                  <Typography className={classes.subtext}><b><i>"Hobby" Similarities</i></b>: {hobbyWeights[username].map(item => item[0] + ": " + item[1]).join(", ")}</Typography>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Home;
