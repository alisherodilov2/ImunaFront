import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const handleFullScreen = (targetElement?: boolean) => {
  // const dispatch = useDispatch<AppDispatch>()
  const element = document.documentElement; // Get the root element (HTML)
  const [screen, setScreen] = useState(false)
  const handleClick = () => {
    if (document.fullscreenElement) {
      // If already in fullscreen, exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setScreen(false)
        // if (targetElement) {
        //   // dispatch(isFullScreenFunction())
        // }
      }
    } else {
      // If not in fullscreen, request fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen();
        setScreen(true)
        // if (targetElement) {
        //   // dispatch(isFullScreenFunction())
        // }
      }
    }
  }

  return {
    handleClick,
    screen
  }
};