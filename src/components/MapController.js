import React, { FC, useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController = ({selectedReview, setLineWidth}) => {
  const map = useMap();
  const flyToDuration = 1.5;

  const flyTo = (location) => {
    setLineWidth(3)
    map.flyTo(location, 15, {
      animate: true,
      duration: flyToDuration,
    });
  };

  const flyToCenter = () => {
    setLineWidth(1)
    map.flyTo([1.345, 103.82], 12, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if(selectedReview) {
      flyTo(selectedReview.location);
    } else {
      flyToCenter();
    }
  }, [selectedReview])

  return null;
};

export { MapController };