/**
 * Useful component for displaying an image and allowing it to be fullscreened
 */

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
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
  
  export default function ImageTile(props: ImageTileProps) {
    const classes = useStyles();
  
    return (
      <img id={props.id} src={props.src} className={props.fullscreenImageId === props.id ? classes.fullscreenImage : classes.smallImage} onClick={() => props.onClick(props.id)} />
    )
  }