// Comment analysis for the MCP server. The same rules as the comment analyzer and comment audit in
// creator-tools/public/shared.js (isQuestion, INTENT, STOP, the scam/money/links phrases from BLOCK_SETS
// and the audit score); change both together. Times are UTC here, since there is no viewer time zone.

const Q_START = /^(how|why|where|when|which|who|whose)\b|^(can|could|does|do|did|is|are|was|should|will|would|has|have|anyone|anybody)\s|^what\s+(is|are|was|were|do|does|did|should|can|about|if|time|happened)\b/i;
const INTENT = /\b(price|pricing|how much (is|does|for|do)|buy|purchase|where (can|do) i (get|buy|find|order)|link (to|for|please|pls|plz)|drop the link|discount|coupon|promo code|affiliate|sponsor\w*|collab\w*|business (email|inquiry|enquiry|contact)|merch|ship(ping)? to)\b/i;
const STOP = new Set(("the a an and or but if of to in on at for with from by is are was were be been being it its this that these those i you he she we they me my your our their his her them us " +
  "so not no yes do does did done have has had just like can could would should will im ive its dont cant thats there here what when where who why how which all any more most very " +
  "too also than then into out up down about over again only own same such get got one two video videos really much even well still make made know think see way want need good great " +
  "please thank thanks lol omg yeah hey hi hello because some other them him who whom been being am let lets ill youre theyre were wasnt isnt arent didnt doesnt").split(" "));
const SPAM = ["whatsapp me", "message me on whatsapp", "contact me on whatsapp", "chat me on whatsapp", "text me on whatsapp", "telegram me", "message me on telegram", "contact me on telegram", "reach me on telegram", "add me on telegram", "my telegram is", "write to me on telegram", "signal me", "wa.me", "t.me/", "you have been selected", "you have been chosen", "you are among the winners", "you won a prize", "claim your prize", "claim your reward", "congratulations you won", "congrats you won", "dm to claim", "message to claim", "giveaway winner", "selected winner", "winner of the giveaway", "official support team", "customer support number", "recovery expert", "account recovery service", "recover your account", "hire a hacker", "ethical hacker", "spell caster", "spell casting", "sugar daddy", "sugar mommy",
  "bitcoin investment", "crypto investment", "invest in bitcoin", "forex trading", "binary options", "guaranteed profit", "guaranteed returns", "guaranteed income", "double your money", "daily profit", "weekly profit", "earn 5000 weekly", "trading signals", "account manager helped", "my portfolio manager", "expert trader", "crypto mentor", "investment manager", "financial expert helped", "recovered my funds", "recover lost crypto", "free crypto", "free bitcoin", "crypto airdrop", "usdt giveaway", "pump group", "mining investment", "make money from home", "work from home and earn",
  "bit.ly", "tinyurl", "cutt.ly", "shorturl", "is.gd", "rb.gy", "t.ly/", "free gift card", "free gift cards", "free robux", "free vbucks", "free v-bucks", "free v bucks", "free discord nitro", "free nitro", "steam gift card", "free iphone", "verify your account", "login to claim", "click the link in my bio", "link in my bio", "link in my profile", "click my profile", "check my profile", "look at my profile", "visit my profile"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isQuestion = (t) => { t = String(t || "").trim(); return t.includes("?") || Q_START.test(t); };
const isSpam = (t) => { t = String(t || "").toLowerCase(); return SPAM.some((w) => t.includes(w)); };
const clip = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
const link = (url, c) => url + "&lc=" + encodeURIComponent(c.id);

// One video's comments (or several videos' comments put together, each tagged with its video url).
function summarize(items, owner) {
  const byParent = {};
  items.forEach(({ c }) => { if (c.parent) (byParent[c.parent] = byParent[c.parent] || []).push(c); });
  const top = items.filter(({ c }) => !c.parent);
  const answered = (c) => (byParent[c.id] || []).some((r) => r.authorChannelId === owner);
  const viewers = top.filter(({ c }) => c.authorChannelId !== owner);
  const questions = viewers.filter(({ c }) => isQuestion(c.text));
  const open = questions.filter(({ c }) => !answered(c)).sort((a, b) => b.c.likes - a.c.likes);
  const intent = viewers.filter(({ c }) => INTENT.test(c.text)).sort((a, b) => b.c.likes - a.c.likes);
  const spam = viewers.filter(({ c }) => isSpam(c.text));
  const hours = {}, words = {}, people = {};
  top.forEach(({ c, url }) => {
    const t = new Date(c.publishedAt), k = DAYS[t.getUTCDay()] + " " + String(t.getUTCHours()).padStart(2, "0") + ":00 UTC";
    hours[k] = (hours[k] || 0) + 1;
    const seen = new Set();
    String(c.text || "").toLowerCase().replace(/https?:\/\/\S+|@\S+/g, " ").replace(/[’']/g, "").split(/[^\p{L}\p{N}]+/u).forEach((w) => {
      if (w.length < 3 || STOP.has(w) || /^\d+$/.test(w) || seen.has(w)) return; seen.add(w); words[w] = (words[w] || 0) + 1;
    });
    if (c.authorChannelId !== owner) { const p = (people[c.authorChannelId || c.author] = people[c.authorChannelId || c.author] || { name: c.author, comments: 0, videos: new Set() }); p.comments++; p.videos.add(url); }
  });
  const row = ({ c, url }) => ({ author: c.author, text: clip(c.text, 300), likes: c.likes, publishedAt: c.publishedAt, url: link(url, c) });
  return {
    commentsRead: top.length,
    viewerComments: viewers.length,
    channelReplyRate: viewers.length ? Math.round(viewers.filter(({ c }) => answered(c)).length / viewers.length * 1000) / 10 : null,
    questions: questions.length,
    unansweredQuestions: open.length,
    buyingOrCollabComments: intent.length,
    scamSpamVisible: spam.length,
    differentCommenters: Object.keys(people).length,
    busiestHoursUtc: Object.entries(hours).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([hour, comments]) => ({ hour, comments })),
    topWords: Object.entries(words).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([word, comments]) => ({ word, comments })),
    unansweredQuestionList: open.slice(0, 20).map(row),
    buyingOrCollabList: intent.slice(0, 10).map(row),
    scamSpamList: spam.slice(0, 10).map(row),
    _people: people,
  };
}

function analyzeVideo(d) {
  const s = summarize(d.comments.map((c) => ({ c, url: d.video.url })), d.video.channelId);
  delete s._people;
  return { video: d.video, order: d.order, moreAvailable: d.truncated, rules: "Questions: a question mark or a leading question word. Buying/collab: words like price, buy, link to, discount, sponsor, collab. Not AI.", ...s };
}

function auditChannel(a) {
  const read = a.videos.filter((x) => x.comments && x.comments.length);
  const items = [].concat(...read.map((x) => x.comments.map((c) => ({ c, url: x.url }))));
  const s = summarize(items, a.channel.id);
  const people = Object.values(s._people), regulars = people.filter((p) => p.videos.size >= 2).sort((x, y) => y.videos.size - x.videos.size || y.comments - x.comments);
  delete s._people;
  const views = read.reduce((t, x) => t + (x.views || 0), 0), counted = read.reduce((t, x) => t + (x.commentCount || 0), 0), per1k = views ? counted / views * 1000 : 0;
  const rr = (s.channelReplyRate || 0) / 100, qa = s.questions ? (s.questions - s.unansweredQuestions) / s.questions : 1;
  const reg = people.length ? regulars.length / people.length : 0, sp = s.viewerComments ? s.scamSpamVisible / s.viewerComments : 0;
  const parts = { replyRate: Math.min(35, rr / 0.30 * 35), questionsAnswered: 25 * qa, conversation: Math.min(20, per1k / 5 * 20), regularCommenters: Math.min(10, reg / 0.10 * 10), freeOfScamSpam: Math.max(0, 10 - sp / 0.05 * 10) };
  const score = Math.round(Object.values(parts).reduce((t, p) => t + p, 0));
  Object.keys(parts).forEach((k) => { parts[k] = Math.round(parts[k] * 10) / 10; });
  return {
    channel: { id: a.channel.id, title: a.channel.title, handle: a.channel.handle, url: a.channel.url, subscribers: a.channel.hiddenSubscribers ? null : a.channel.subscribers },
    commentHealthScore: score,
    band: score >= 80 ? "Thriving" : score >= 60 ? "Healthy" : score >= 40 ? "Needs attention" : "Neglected",
    scoreParts: parts,
    scoreNote: "Passive Array's rubric, not a YouTube metric. Full marks: 30% reply rate (35), every question answered (25), 5 comments per 1,000 views (20), 10% of commenters on 2+ videos (10), no scam spam (10; zero at 5%).",
    commentsPer1000Views: Math.round(per1k * 10) / 10,
    regulars: regulars.slice(0, 15).map((p) => ({ name: p.name, videos: p.videos.size, comments: p.comments })),
    videos: a.videos.map((x) => ({ title: x.title, url: x.url, publishedAt: x.publishedAt, views: x.views, commentCount: x.commentCount, commentsRead: x.comments ? x.comments.filter((c) => !c.parent).length : 0, skipped: x.skipped || undefined })),
    ...s,
  };
}

module.exports = { analyzeVideo, auditChannel, isQuestion, isSpam, INTENT };
