import { useRef, useCallback } from 'react';
import { DollarRecognizer, Point } from '@/utils/dollar-recognizer';

/**
 * Hook for gesture recognition using $1 Recognizer
 * Returns recognizer instance and helper functions
 */
export const useDollarRecognizer = () => {
  const recognizerRef = useRef(new DollarRecognizer());

  // Add a gesture template
  const addGesture = useCallback((name, points) => {
    const dollarPoints = points.map(p => new Point(p.x, p.y));
    recognizerRef.current.addGesture(name, dollarPoints);
  }, []);

  // Recognize a drawn gesture
  const recognize = useCallback((points) => {
    const dollarPoints = points.map(p => new Point(p.x, p.y));
    return recognizerRef.current.recognize(dollarPoints);
  }, []);

  // Get all registered gesture names
  const getGestureNames = useCallback(() => {
    return recognizerRef.current.getGestureNames();
  }, []);

  // Clear all gestures
  const clearGestures = useCallback(() => {
    recognizerRef.current.clear();
  }, []);

  // Add predefined shorthand strokes as gesture templates
  const addShorthandTemplates = useCallback(() => {
    // These are example templates - customize based on your shorthand system
    const templates = {
      'A': [
        { x: 50, y: 150 }, { x: 100, y: 50 }, { x: 150, y: 150 },
        { x: 60, y: 100 }, { x: 140, y: 100 }
      ],
      'E': [
        { x: 50, y: 50 }, { x: 50, y: 150 },
        { x: 50, y: 100 }, { x: 150, y: 100 },
        { x: 50, y: 150 }, { x: 150, y: 150 }
      ],
      'L': [
        { x: 50, y: 50 }, { x: 50, y: 150 }, { x: 150, y: 150 }
      ]
    };

    Object.entries(templates).forEach(([name, points]) => {
      addGesture(name, points);
    });
  }, [addGesture]);

  return {
    recognizer: recognizerRef.current,
    addGesture,
    recognize,
    getGestureNames,
    clearGestures,
    addShorthandTemplates
  };
};
