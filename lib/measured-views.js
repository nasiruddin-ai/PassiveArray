// Views per day measured from the store's daily snapshots of a channel's total views.
// Used by the monetization checker to bracket watch hours; null when there are fewer
// than 14 days of history in the last 90.
const history = require("./history.js");
const DAY = 86400000;

module.exports = async function measuredViews(channelId) {
  if (!channelId) return null;
  const { series } = await history.read("yt", channelId);
  const cutoff = Date.now() - 90 * DAY;
  const pts = series.filter((p) => typeof p.v === "number" && new Date(p.d).getTime() >= cutoff);
  if (pts.length < 2) return null;
  const first = pts[0], last = pts[pts.length - 1];
  const days = Math.round((new Date(last.d) - new Date(first.d)) / DAY);
  if (days < 14 || last.v < first.v) return null;
  return { perDay: (last.v - first.v) / days, days };
};
