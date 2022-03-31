import { makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';
import vidssImage1 from './../images/vidss1.jpg';
import vidssImage2 from './../images/vidss2.jpg';
import vidssImage3 from './../images/vidss3.jpg';
import volemsImage1 from './../images/volems1.jpg';
import volemsImage2 from './../images/volems2.jpg';
import alimImage1 from './../images/alim1.png';

export const enum SUB_PAGE {
  storyline = 'storyline',
  sentiment = 'sentiment',
  interfaces = 'interfaces',
  vidss = 'vidss',
  volems = 'volems',
  alim = 'alim',
}

const useStyles = makeStyles(theme => ({
  root: {
  },
  tabs: {
    height: '100%',
  },
  flexContainer: {
    height: '100%',
  },
  tab: {
    borderRight: `2px solid ${theme.palette.divider}`,
    textTransform: 'none',
    '& > span': {
      textAlign: 'left',
      alignItems: 'normal',
    }
  },
  subTab: {
    marginLeft: '20px',
    borderRight: `2px solid ${theme.palette.divider}`,
    textTransform: 'none',
    '& > span': {
      textAlign: 'left',
      alignItems: 'normal',
    }
  },
  filler: {
    flex: 1,
    borderRight: `2px solid ${theme.palette.divider}`,
  },
  subPageContent: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  iframe: {
    boxSizing: 'border-box',
    margin: '0px',
    minWidth: '0px',
    width: '100%',
    height: '680px',
    minHeight: '680px',
    border: '0px',
  },
  smallIframe: {
    boxSizing: 'border-box',
    margin: '0px',
    minWidth: '0px',
    width: '100%',
    height: '420px',
    minHeight: '420px',
    border: '0px',
    '& body': {
      background: 'transparent !important',
    }
  },
  content: {
    padding: '20px',
  },
  smallImage: {
    maxWidth: 'calc(50% - 10px)',
    padding: '5px',
    cursor: 'pointer',
    opacity: 1,
    transition: 'opacity 1s',
    '&:hover': {
      opacity: 0.8,
      transition: 'opacity 300ms',
    },
  },
  fullscreenImage: {
    left: '0px',
    right: '0px',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '80vw',
    height: 'auto',
    top: '10vh',
    position: 'absolute',
    cursor: 'pointer',
  },
}));

interface ImageTileProps {
  id: string;
  src: any;
  fullscreenImageId: string | undefined;
  onClick(id: string): void;
}

function ImageTile(props: ImageTileProps) {
  const classes = useStyles();

  return (
    <img id={props.id} src={props.src} className={props.fullscreenImageId === props.id ? classes.fullscreenImage : classes.smallImage} onClick={() => props.onClick(props.id)} />
  )
}

function Projects() {
  const classes = useStyles();

  const [currentSubTab, setCurrentSubTab] = useState<SUB_PAGE>(SUB_PAGE.storyline);
  const [fullscreenImageId, setFullscreenImageId] = useState<string | undefined>(undefined);

  const toggleFullscreen = (id: string) => {
    if (fullscreenImageId == id) {
      setFullscreenImageId(undefined);
    }
    else {
      setFullscreenImageId(id);
    }
  }

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentSubTab}
        indicatorColor="primary"
        onChange={(event: React.ChangeEvent<{}>, newTab: SUB_PAGE) => setCurrentSubTab(newTab)}
        className={classes.tabs}
        classes={{ flexContainer: classes.flexContainer }}
      >
        <Tab label="Storyline Visualization" value={SUB_PAGE.storyline} className={classes.tab} />
        <Tab label="Sentiment Analysis" value={SUB_PAGE.sentiment} className={classes.tab} />
        <Tab label="Example Interfaces" value={SUB_PAGE.interfaces} className={classes.tab} />
        <Tab label="VIDSS" value={SUB_PAGE.vidss} className={classes.subTab} />
        <Tab label="VolEMS" value={SUB_PAGE.volems} className={classes.subTab} />
        <Tab label="ALIM" value={SUB_PAGE.alim} className={classes.subTab} />
        <div className={classes.filler} />
      </Tabs>
      <div className={classes.subPageContent}>
        { currentSubTab === SUB_PAGE.storyline &&
          <>
            <iframe className={classes.iframe} src="https://spatial-temporal-storyline.glitch.me" title="spatial-temporal-storyline" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen={true}></iframe>
            <div className={classes.content}>
              <p><b>Description</b></p>
              <p>Through the course of a semester, a small team of Die Hard enthusiasts got together to create a storyline visualization that very much needed to exist: Die Hard. The visualization tracks each notable character throughout the movie and gives details on movements, locations, and events that happen in what is deemed the best Christmas movie ever.</p>

              <span>Features</span>
              <ul>
                <li>The overall trend of the lines can vividly represent the evolution of the plot.</li>
                <li>The interval between the lines can also display the relation of the characters.</li>
                <li>Defined locations on y axis.</li>
                <li>Movie time is displayed on x axis.</li>
                <li>Icons for notable events, like flash grenades, C4 explosions, woundings, and deaths.</li>
                <li>Separation of character lines per location so they are easier to distinguish.</li>
                <li>Hover highlighting of characters and groups.</li>
                <li>Hover tooltip of movements and events to get more specific details.</li>
                <li>X-axis zoom and panning.</li>
                <li>Bottom overview ruler showing x-axis view range.</li>
              </ul>

              <p><b>Implementation</b></p>
              <p>This project was implemented in Javascript and D3 and was submitted as a course project for CSCE 679 Data Visualizations at Texas A&M University.</p>
            </div>
          </>
        }
        { currentSubTab === SUB_PAGE.sentiment &&
          <>
            <div className={classes.content}>
              <iframe className={classes.smallIframe} src="https://jsfiddle.net/matthu/3se0dj8h/show" title="sentiment-analysis" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen={true}></iframe>
              <iframe className={classes.smallIframe} src="https://jsfiddle.net/matthu/mc5zxoqd/show" title="sentiment-analysis" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen={true}></iframe>
            </div>
            <div className={classes.content}>
              <p><b>Description</b></p>
              <p>For fun, I attempted using Google's Sentiment Analysis to try to detect emotions in popular novels. So for all books of Harry Potter and Lord of the Rings, I fed each chapter, sentence by sentence, through Google's Sentiment Analysis and charted the results. Each sentence would be analyzed as a negative or positive emotion, ranging from -1 to 1, so I simply aggregated them into line charts by book</p>
            </div>
          </>
        }
        { currentSubTab === SUB_PAGE.interfaces &&
            <>
              <div className={classes.content}>
                <p>I have worked for the Texas A&M Center for Applied Technology (TCAT) for almost seven years now and have done a wide variety of projects. Most of my experience has revolved around interfaces and UI/UX work in front-end development. I am well-versed in React, Typescript, and other common libraries like Redux, Material UI, and Webpack. With a good eye for design, I can spin up a React app pretty quickly and get to customizing the UI to fit the client's needs. I prefer Material UI for UI elements since it offers a clean modern look while allowing customization.</p>
                <p>Below is a small showcase of some interfaces I have put together that are both functional and aesthetic. All are using Webpack, React, & Material UI among other libraries.</p>
              </div>
              <div className={classes.content}>
                <ImageTile id='vidss1' src={vidssImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
                <ImageTile id='vidss2' src={vidssImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
                <ImageTile id='vidss3' src={vidssImage3} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
                <ImageTile id='volems1' src={volemsImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
                <ImageTile id='volems2' src={volemsImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
                <ImageTile id='alim1' src={alimImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
              </div>
            </>
        }
        { currentSubTab === SUB_PAGE.vidss &&
          <>
            <div className={classes.content}>
              <p>VIDSS was a project funded by FeedTheFuture that investigated and facilitated crop rotation to increase Ethiopian agricultural yield. The interface was meant to be used by simple farmers, so it couldn't be too complicated, as well as more advanced users, so we had to find a blend of the two. The interface allows easy toggling of different crop layers for farmers to then note what and when they can plant in order to maximize yield. The top navigation bar even offers a walkthrough, where it lists steps and guides farmers in choosing what crops to focus on, as shown below.</p>
            </div>
            <div className={classes.content}>
              <ImageTile id='vidss1' src={vidssImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
              <ImageTile id='vidss2' src={vidssImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
              <ImageTile id='vidss3' src={vidssImage3} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
            </div>
          </>
        }
        { currentSubTab === SUB_PAGE.volems &&
          <>
            <div className={classes.content}>
              <p>VolEMS was a project meant to allow volunteers to help in emergency situations. The incentive was that volunteers could be nearby to an emergency and help in the critical minutes before an ambulance might arrive. The user interface was meant to be very simple, with the dispatcher only having to enter minimal information before volunteers are notified through a mobile app.</p>
            </div>
            <div className={classes.content}>
              <ImageTile id='volems1' src={volemsImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
              <ImageTile id='volems2' src={volemsImage2} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
            </div>
          </>
        }
        { currentSubTab === SUB_PAGE.alim &&
          <>
            <div className={classes.content}>
              <p>This project relied on using a BIM model viewer to allow users to fully explore a building with all of its intricate components. I was in charge the UI as well as linking the BIM viewer into the interface and customizing it as needed.</p>
            </div>
            <div className={classes.content}>
              <ImageTile id='alim1' src={alimImage1} fullscreenImageId={fullscreenImageId} onClick={toggleFullscreen} />
            </div>
          </>
        }
      </div>
    </>
  );
}

export default Projects;
