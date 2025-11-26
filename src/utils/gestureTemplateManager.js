/**
 * Gesture Template Manager
 * Loads and manages gesture templates from training data
 */

export class GestureTemplateManager {
  constructor() {
    this.templates = {};
    this.templateCache = new Map();
  }

  /**
   * Add a gesture template
   * @param {string} name - Gesture name (e.g., 'a', 'b', 'letter-a')
   * @param {Array<{x: number, y: number}>} points - Point coordinates
   */
  addTemplate(name, points) {
    if (!this.templates[name]) {
      this.templates[name] = [];
    }
    this.templates[name].push(points);
  }

  /**
   * Get all templates for a gesture
   */
  getTemplates(name) {
    return this.templates[name] || [];
  }

  /**
   * Get all gesture names
   */
  getGestureNames() {
    return Object.keys(this.templates);
  }

  /**
   * Clear all templates
   */
  clear() {
    this.templates = {};
    this.templateCache.clear();
  }

  /**
   * Get total number of templates
   */
  getTotalTemplates() {
    return Object.values(this.templates).reduce((sum, arr) => sum + arr.length, 0);
  }

  /**
   * Load templates from JSON data
   * Expects format: { 'a': [[{x, y}, ...], ...], 'b': [...], ... }
   */
  loadFromJSON(data) {
    this.templates = data;
    this.templateCache.clear();
  }

  /**
   * Export templates to JSON
   */
  exportToJSON() {
    return JSON.stringify(this.templates);
  }
}

/**
 * Create default shorthand templates
 * These are pre-defined Gregg shorthand character patterns
 */
export function createDefaultTemplates() {
  const manager = new GestureTemplateManager();

  // More distinctive normalized coordinates (0-1 scale) for shorthand characters
  const templates = {
    'a': [
      [
        { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.3 }, { x: 0.5, y: 0.1 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.7 },
        { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.5 }
      ]
    ],
    'b': [
      [
        { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.9 }, { x: 0.7, y: 0.9 }, { x: 0.7, y: 0.5 }, { x: 0.2, y: 0.5 }, { x: 0.7, y: 0.1 }
      ]
    ],
    'c': [
      [
        { x: 0.8, y: 0.2 }, { x: 0.3, y: 0.2 }, { x: 0.2, y: 0.5 }, { x: 0.3, y: 0.8 }, { x: 0.8, y: 0.8 }
      ]
    ],
    'd': [
      [
        { x: 0.8, y: 0.1 }, { x: 0.8, y: 0.9 }, { x: 0.2, y: 0.9 }, { x: 0.2, y: 0.2 }, { x: 0.8, y: 0.2 }
      ]
    ],
    'e': [
      [
        { x: 0.8, y: 0.3 }, { x: 0.2, y: 0.3 }, { x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 },
        { x: 0.2, y: 0.7 }, { x: 0.8, y: 0.7 }
      ]
    ],
    'f': [
      [
        { x: 0.7, y: 0.1 }, { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.9 },
        { x: 0.2, y: 0.5 }, { x: 0.7, y: 0.5 }
      ]
    ],
    'g': [
      [
        { x: 0.8, y: 0.2 }, { x: 0.2, y: 0.2 }, { x: 0.2, y: 0.7 }, { x: 0.8, y: 0.7 }, { x: 0.8, y: 0.95 }, { x: 0.2, y: 0.95 }
      ]
    ],
    'h': [
      [
        { x: 0.2, y: 0.1 }, { x: 0.2, y: 0.9 }, { x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }, { x: 0.8, y: 0.1 }, { x: 0.8, y: 0.9 }
      ]
    ],
    'i': [
      [
        { x: 0.5, y: 0.15 }, { x: 0.5, y: 0.85 }
      ]
    ],
    'l': [
      [
        { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.9 }
      ]
    ],
    'o': [
      [
        { x: 0.5, y: 0.2 }, { x: 0.8, y: 0.35 }, { x: 0.8, y: 0.65 },
        { x: 0.5, y: 0.8 }, { x: 0.2, y: 0.65 }, { x: 0.2, y: 0.35 }, { x: 0.5, y: 0.2 }
      ]
    ],
    's': [
      [
        { x: 0.8, y: 0.2 }, { x: 0.2, y: 0.2 }, { x: 0.2, y: 0.45 },
        { x: 0.8, y: 0.55 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }
      ]
    ],
    't': [
      [
        { x: 0.2, y: 0.15 }, { x: 0.8, y: 0.15 }, { x: 0.5, y: 0.15 }, { x: 0.5, y: 0.85 }
      ]
    ]
  };

  Object.entries(templates).forEach(([name, variants]) => {
    variants.forEach(points => manager.addTemplate(name, points));
  });

  return manager;
}

/**
 * Normalize points to 0-1 scale
 */
export function normalizePoints(points) {
  if (points.length === 0) return [];

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  // Find bounds
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Normalize
  return points.map(p => ({
    x: (p.x - minX) / rangeX,
    y: (p.y - minY) / rangeY
  }));
}

/**
 * Denormalize points back to canvas coordinates
 */
export function denormalizePoints(points, width, height) {
  let minX = points[0]?.x || 0;
  let maxX = points[0]?.x || 0;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
  }

  const rangeX = maxX - minX || 1;

  return points.map(p => ({
    x: p.x * width,
    y: p.y * height
  }));
}
