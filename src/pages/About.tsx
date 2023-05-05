/**
 * About page displaying more personal details
 */

import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
  },
}));

function About() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='h4'>Introduction / Problem Background / Motivation</Typography>
      <br />
      <Typography>Ego-spurred artistic disagreements. Individuals who can barely be in the same room together, but have to spend dozens of hours weekly working on projects critical to their careers. Members with my-way-or-the-highway attitudes, or members who never show up on time and never pull their weight. </Typography>
      <br />
      <Typography>Sounds like a chart-topping rock band, right? Or maybe the set of a top-grossing, high pressure movie franchise? Unfortunately, these dynamics show up time and time again in a much less glamorous setting: the world of engineering group projects. Engineering curriculums at both the graduate and undergraduate level rely heavily on group projects to teach students to understand material at the synthesis level, develop a sense of creative design, and become comfortable working in teams. On the surface, it’s a wonderful way to enrich an engineering education and ease students into a workforce-like environment.</Typography>
      <br />
      <Typography>However, life rarely imitates theory. Group projects are often plagued with problems stemming from incompatible personal dynamics. Since most projects last a semester at the longest and there is little to no oversight of group dynamics, there are few incentives to compromise. Group issues often fester, harming both productivity and the mental health or state of mind of team members, until the project is complete. These difficulties are shockingly ubiquitous; ask any engineering student about their worst team project experience and some of the tales you’ll hear are worthy of Hugo or Dickens. </Typography>
      <br />
      <Typography>As previously mentioned, the root of the problem is incompatible personal dynamics. Sometimes this takes the form of drastically different working styles; half the team prefers to finish work as quickly as possible, and the other half thrives on procrastinating and powering through a week of work the night before the deadline. Sometimes team members just don’t get along very well on a personal level- maybe they have nothing to talk about, maybe they rub each other the wrong way- and avoid communicating or working together as much as possible to escape unpleasant social situations. Sometimes team members have diametrically opposed visions for the final outcome of their project, and every decision point turns into a drawn-out fight. Since groups are typically assigned randomly or pseudo-randomly (alphabetically, based on where students happened to sit on the first day of class), there is no way for students to escape these problems, and universities seem to be content with letting them suffer through it. </Typography>
      <br />
      <Typography variant='h4'>Proposed Solution/Methods Used</Typography>
      <br />
      <Typography>The proposed solution to this given problem is to assign students to a generated group optimized for performance and efficiency, with no interpersonal conflicts. The students will simply submit a brief bio and the highly advanced algorithm developed by our team will automatically pair that student with a group of people who share similar interests and goals, among other factors. This optimized pairing removes the uncertainty that comes when groups are assigned randomly and ensures that the teams will focus on delivering a quality end product, rather than spending allotted time arguing simply because the group chemistry is poor. </Typography>
      <br />
      <Typography>The way the algorithm works is that when the user submits their bio, those sentences will be broken up into individual words, called tokens, that will then be used for the subsequent calculations. From these tokens, the algorithm selected the most important terms based on GloVe embeddings, focus categories, concreteness, and TF-IDF scores. The GloVe embeddings assess the different tokens and works by adding words that are frequently occurring into the same vector space because they are likely to have similar meanings. Essentially, the GloVe analyzes the co-occurrence statistics of words in a corpus of text. From there, the focus categories are selected, which gives priority to tokens that are relevant to the project’s needs. For example, if the project is focused on programming languages people have in common, then programming language would be a relevant category of interest that would help in further pairing the groups together. Lastly, another factor are the TF-IDF scores, which essentially assigns higher scores to words that appear less frequently on the document and lower scores that appear very frequently. This is because if the word appears very frequently, it is likely to be a stop word. Therefore, less frequent words have a higher importance and therefore receive a higher score.  </Typography>
      <br />
      <Typography>Once all scores have been computed from the factors above, the combined weighted scores are used to create total-student similarity scores. Essentially, these total scores show how similar a student is to another student. The closer their scores are to each other, the more similar those students are. This is then used to form the groups based on students that are more similar. The groups are of four students. </Typography>
      <br />
      <Typography variant='h4'>Evaluation and Analysis of Results</Typography>
      <br />
      <Typography>Evaluation of any recommender system based product can be a little tricky. For our project, we decided to randomly select 5 groups recommended by our recommender system and the 5 actual groups from our class for comparison. The users filling the form decide on which group might be more functional in working as a team by reading their slack bios.</Typography>
      <br />
      <Typography>In total, we got 13 users to participate in filling the form, and we received an overwhelmingly positive result. Over 63% of the time, our recommended groups were chosen to be more functional than the class’s actual groups. This clearly shows that humans also tend to group people together based on their similarities and interests. This is also evident since around 91% of the users, in their college experience, had their groups chosen based on similar interests and skills.</Typography>
      <br />
      <Typography variant='h4'>Conclusion</Typography>
      <br />
      <Typography>In conclusion, this project is definitely a step towards making more functional groups for class projects to allow for a seamless work experience and optimal performance with minimal interpersonal conflict. Any project has its extensions to make it better and more efficient in terms of computations and general calculations. Future work for our product includes prompting users to specifically describe their interests and skills in their bios for better matching and taking context into account by inculcating better deep learning models when comparing similarities. We can also add a data scraper to the grouping tool or allow the professors or TAs to insert user bios into the recommender system through the web application. We can have the product run on a server to make use of the full list of GloVe embeddings and get better results. We can add on to the user bios by scraping LinkedIn bios to get a scope of their professional skills and industry experience. In the end, we can also optimize the grouping algorithm to find the best possible grouping of all groups which can be considered as a NP-hard problem. All of these extensions can lead to even better grouping of students utilizing all the textual context from their bios. We would also love to get more user experience on our product by including these for more courses like Project Capstones for, hopefully, optimal performance.</Typography>
      <br />
    </div>
  );
}

export default About;
