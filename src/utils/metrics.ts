/**
 * Parses a metric value (e.g., "80%", "4K+") into its numeric and suffix components.
 * Used for animating counts and applying localized formatting.
 */
export const parseMetricValue = (val: string) => {
  const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
  const suffix = val.replace(/[0-9.]/g, '');
  return { num, suffix };
};

/**
 * Generates descriptive tooltips for project metrics.
 * Ensures consistent messaging across the 'Studio' brand identity.
 */
export const getMetricTooltip = (label: string, val: string) => {
  const combined = `${val} ${label}`.toUpperCase();
  
  if (combined.includes('EVENTS/SEC')) {
    return "Four thousand events per second. Ingested. Processed. Visualised.";
  }
  if (combined.includes('RECLAIMED')) {
    return "That's 624 hours a year. You're welcome, VNS.";
  }
  if (combined.includes('LOAD TIME') || combined.includes('REDUCTION')) {
    return "From 3 seconds to 0.6. No magic, just good engineering.";
  }
  if (combined.includes('MSC GRADE') || combined.includes('SIMILARITY')) {
    return "Highest grade available. Not that we're counting.";
  }
  
  return "";
};
