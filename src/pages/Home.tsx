/**
 * Main home page that displays introduction content
 */

import { makeStyles } from '@material-ui/core';
import React from 'react';
import ProfileImage from '../images/profile.jpg';

const useStyles = makeStyles(theme => ({
  root: {
  },
  profileImage: {
    borderRadius: '8px',
    maxWidth: '300px',
    marginRight: '30px',
  },
  textContainer: {
    display: 'inline-block',
    width: 'calc(100% - 330px)',
    verticalAlign: 'top',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div>
      <img className={classes.profileImage} src={ProfileImage} />
      <div className={classes.textContainer}>
        <p>Howdy! I am a Computer Science masters student from College Station, Texas, working for TCAT, the Texas A&M Center for Applied Technology. My non-work hours are dedicated to my loving wife and kid at home, but on the side I enjoy programming, graphic design, art, photography, and music. I wanted to dedicate this website to showcasing React, Material UI, JSX, and other libraries.</p>
        <p>In programming development, I am very familiar with ReactJS, having coded in it for a couple years now. I also have past experience coding in Python, Java, JavaScript, C++ and C. I am currently working at the Texas Center for Applied Technology (TCAT) within TEES in the Texas A&M University. I enjoy working in Photoshop and Illustrator, both of which I used in my art classes. I am rather handy with a drawing utensil, so I love sketching, drawing, and Acrylic painting. I like to practice guitar and piano when I can, but I am best at bass guitar and harmonica. I even have some songs that I hope to release someday. I used to sing bass in the Singing Cadets - a well-known all-male singing group at Texas A&M. We sang for around 70 to 100 performances a year, and we even got to perform in China.</p>
      </div>
    </div>
  );
}

export default Home;
