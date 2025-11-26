/**
 * Official $1 Recognizer
 * JavaScript implementation of the $1 Gesture Recognizer
 * Based on: https://depts.washington.edu/aimgroup/proj/dollar/dollar.html
 */

const NumPointsInGesture = 64;
const SquareSize = 250.0;
const Origin = { x: 0, y: 0 };
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = Diagonal / 2.0;
const AngleRange = 45.0;
const AnglePrecision = 2.0;
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Result {
  constructor(name, score, time = 0) {
    this.name = name;
    this.score = score;
    this.time = time;
  }
}

class Gesture {
  constructor(name, points) {
    this.name = name;
    this.points = resample(points, NumPointsInGesture);
    this.radians = indicativeAngle(this.points);
    this.points = rotateBy(this.points, -this.radians);
    this.points = scaleToSquare(this.points, SquareSize);
    this.points = translateToOrigin(this.points);
  }
}

// Resample points to N equally-spaced points
function resample(points, n) {
  const I = pathLength(points) / (n - 1);
  let D = 0.0;
  const newPoints = [new Point(points[0].x, points[0].y)];

  for (let i = 1; i < points.length; i++) {
    const d = distance(points[i - 1], points[i]);
    if (D + d >= I) {
      const qx = points[i - 1].x + (I - D) / d * (points[i].x - points[i - 1].x);
      const qy = points[i - 1].y + (I - D) / d * (points[i].y - points[i - 1].y);
      const q = new Point(qx, qy);
      newPoints.push(q);
      points.splice(i, 0, q);
      D = 0.0;
    } else {
      D += d;
    }
  }

  if (newPoints.length === n - 1) {
    newPoints.push(new Point(points[points.length - 1].x, points[points.length - 1].y));
  }

  return newPoints;
}

// Calculate total path length
function pathLength(points) {
  let length = 0.0;
  for (let i = 1; i < points.length; i++) {
    length += distance(points[i - 1], points[i]);
  }
  return length;
}

// Euclidean distance between two points
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Get angle in radians
function indicativeAngle(points) {
  const centroid = getCentroid(points);
  return Math.atan2(centroid.y - points[0].y, centroid.x - points[0].x);
}

// Get centroid of points
function getCentroid(points) {
  let x = 0.0;
  let y = 0.0;
  for (let i = 0; i < points.length; i++) {
    x += points[i].x;
    y += points[i].y;
  }
  x /= points.length;
  y /= points.length;
  return new Point(x, y);
}

// Rotate points by radians
function rotateBy(points, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const centroid = getCentroid(points);
  const newPoints = [];

  for (let i = 0; i < points.length; i++) {
    const qx = (points[i].x - centroid.x) * cos - (points[i].y - centroid.y) * sin + centroid.x;
    const qy = (points[i].x - centroid.x) * sin + (points[i].y - centroid.y) * cos + centroid.y;
    newPoints.push(new Point(qx, qy));
  }

  return newPoints;
}

// Scale points to square
function scaleToSquare(points, size) {
  const B = boundingBox(points);
  const newPoints = [];

  for (let i = 0; i < points.length; i++) {
    const qx = points[i].x * (size / B.width);
    const qy = points[i].y * (size / B.height);
    newPoints.push(new Point(qx, qy));
  }

  return newPoints;
}

// Get bounding box of points
function boundingBox(points) {
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;

  for (let i = 0; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    maxX = Math.max(maxX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
  }

  return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}

// Translate points to origin
function translateToOrigin(points) {
  const centroid = getCentroid(points);
  const newPoints = [];

  for (let i = 0; i < points.length; i++) {
    const qx = points[i].x - centroid.x;
    const qy = points[i].y - centroid.y;
    newPoints.push(new Point(qx, qy));
  }

  return newPoints;
}

// Main recognizer class
export class DollarRecognizer {
  constructor() {
    this.gestures = [];
  }

  // Add a gesture template
  addGesture(name, points) {
    this.gestures.push(new Gesture(name, points));
  }

  // Recognize a drawn gesture
  recognize(points) {
    if (points.length < 10) {
      return new Result('UNKNOWN', 0.0);
    }

    const candidate = new Gesture('CANDIDATE', points);
    let bestScore = Number.NEGATIVE_INFINITY;
    let bestName = 'UNKNOWN';
    let bestTime = 0;

    const startTime = performance.now();

    for (let i = 0; i < this.gestures.length; i++) {
      const score = optimalCosineDistance(this.gestures[i].points, candidate.points);
      if (score > bestScore) {
        bestScore = score;
        bestName = this.gestures[i].name;
      }
    }

    const endTime = performance.now();
    const time = endTime - startTime;

    return new Result(bestName, bestScore, time);
  }

  // Get all registered gesture names
  getGestureNames() {
    return this.gestures.map(g => g.name);
  }

  // Clear all gestures
  clear() {
    this.gestures = [];
  }
}

// Calculate optimal cosine distance
function optimalCosineDistance(points1, points2) {
  const n = points1.length;
  let bestDistance = Number.NEGATIVE_INFINITY;

  for (let start = 0; start < n; start += AnglePrecision) {
    const d = cosineSimilarity(points1, points2, start);
    bestDistance = Math.max(bestDistance, d);
  }

  return bestDistance;
}

// Calculate cosine similarity
function cosineSimilarity(points1, points2, start) {
  let sum = 0.0;

  for (let i = 0; i < points1.length; i++) {
    const index = (start + i) % points1.length;
    sum += points1[i].x * points2[index].x + points1[i].y * points2[index].y;
  }

  return sum / points1.length;
}

export { Point, Rectangle, Result, Gesture };
