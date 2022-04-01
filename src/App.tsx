/**
 * Main page of the app that contains pages of content
 */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Nav from './components/Nav';
import About from './pages/About';
import Home from './pages/Home';
import Projects from './pages/Projects';
import circuitImage1 from './images/circuit1.png';
import circuitImage2 from './images/circuit2.png';

export const enum PAGE {
  home = 'home',
  about = 'about',
  projects = 'projects'
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(0deg, rgba(221,223,247,1) 0%, rgba(255,255,255,1) 100%);',
  },
  body: {
    overflow: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url("/showcase/static/media/circuit1.2ecb49810ca7da854f0c.png"), url("/showcase/static/media/circuit2.8fb5820aee7e10f35fd9.png")',
    backgroundSize: 'contain, contain',
    backgroundPosition: 'right -10vh top 100px, left -10vh top -150px',
    backgroundRepeat: 'no-repeat, no-repeat',
  },
  content: {
    flex: 1,
    display: 'flex',
    marginLeft: '10vw',
    marginRight: '10vw',
    marginTop: '20px',
    marginBottom: '20px',
  },
}));

function App() {
  const classes = useStyles();
  const circuit1 = circuitImage1;
  const circuit2 = circuitImage2;

  // Save the current tab state
  const [currentTab, setCurrentTab] = useState<PAGE>(PAGE.home);

  return (
    <div className={classes.root}>
      <Nav
        currentTab={currentTab}
        onChangeTab={(tab: PAGE) => setCurrentTab(tab)}
      />
      <div className={classes.body}>
        <div className={classes.content}>
          { currentTab === PAGE.home &&
            <Home />
          }
          { currentTab === PAGE.about &&
            <About />
          }
          { currentTab === PAGE.projects &&
            <Projects />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
