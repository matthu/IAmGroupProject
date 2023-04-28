/**
 * The main nav bar for the interface
 */

import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import { PAGE } from '../App';
import TitleImage from '../images/showcase.svg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    boxShadow: '0px 4px 4px 0px rgb(0 0 0 / 5%), 0px 1px 12px 0px rgb(0 0 0 / 20%)',
    background: 'linear-gradient(142deg, rgba(47,148,2,1) 11%, rgba(63,185,0,1) 50%, rgba(142,228,95,1) 92%)',
    paddingLeft: '10vw',
    paddingRight: '10vw',
  },
  titleImage: {
    marginLeft: '-30px',
    marginRight: '30px',
    maxWidth: '200px',
  },
  nav: {
    fontWeight: "bold"
  },
  indicator: {
    backgroundColor: 'white'
  },
}));

interface NavProps {
  currentTab: string;
  onChangeTab:(tab: PAGE) => void;
}

function Nav(props: NavProps) {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <img className={classes.titleImage} src={TitleImage} />
      <Tabs
          className={classes.nav}
          value={props.currentTab}
          onChange={(event: React.ChangeEvent<{}>, newTab: PAGE) => props.onChangeTab(newTab)}
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="full width tabs example"
          classes={{indicator: classes.indicator}}
        >
          <Tab style={{ fontWeight: "bold" }} label="I AM GROUP" value={PAGE.home} />
          <Tab style={{ fontWeight: "bold" }} label="About" value={PAGE.about} />
        </Tabs>
    </AppBar>
  );
}

export default Nav;
