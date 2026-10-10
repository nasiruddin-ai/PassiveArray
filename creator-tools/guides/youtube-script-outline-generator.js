// Long-form guide for /creator-tools/youtube-script-outline-generator/. Merged into tools.js by build-tools.js.
// Matches the yt_script prompt in api/creator-ai.js (4 sections for a Short, 8 to 9 for long-form, hook in quotes,
// no greeting) and ytScriptLocal() in public/shared.js: Shorts get 4 beats at 0:00, 0:03, 0:12, 0:40; long-form gets
// 9 beats (8 at the 5-minute option, which drops "Main point three"), spaced evenly across the target minutes.
module.exports = {
  seoTitle: "YouTube Script Outline Generator: Free Template | Passive Array",
  seoDescription: "Free YouTube script outline generator, no sign-up. Get a timed outline with the hook written out, the beats in order and a close that points to the next video.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube script outline generator gives you",
      p: ["Type your topic, optionally who it is for, and pick a target length: under a minute for Shorts, about 5 minutes, 8 to 10 minutes, or 15 minutes or more. You get a table with three columns:"],
      list: [
        "<b>At</b>: a rough timestamp for where each section starts.",
        "<b>Section</b>: a short name, such as Hook, Promise or Proof.",
        "<b>What happens</b>: what to say or show. The hook is written out as words to say; later sections describe what to cover.",
      ],
      after: [
        "It is a structure to film from, not a word-for-word script. Copy it with one click and fill in your own words, examples and footage.",
      ],
    },
    {
      h: "The YouTube script structure it uses",
      p: ["When the AI writer is off, long videos follow this nine-part structure, filled with your topic. The AI writer follows the same idea: 8 or 9 sections for long-form, 4 for a Short, and never a greeting or channel branding at the start."],
      table: {
        head: ["Section", "What it does"],
        rows: [
          ["Hook", "Opens on the result or the problem, never on a greeting"],
          ["Promise", "Says exactly what the viewer will be able to do by the end"],
          ["Context", "The minimum background needed, and nothing they already know"],
          ["Main point one", "The first real step, shown on screen"],
          ["Main point two", "The next step. Retention often dips here, so put your strongest visual in it"],
          ["Main point three", "The third step, or the common mistake that undoes the first two"],
          ["Proof", "A result, a before and after, or a number that makes the advice believable"],
          ["Recap", "Three sentences at most, confirming the promise was kept"],
          ["Next click", "Points to one specific next video and says why it follows"],
        ],
      },
      after: ["At the 5-minute length, Main point three is dropped, leaving eight sections. If you add your audience, the Context section is written for them."],
    },
    {
      h: "How to structure a YouTube Short",
      p: ["Pick \"Under a minute\" and you get four beats instead of nine. In built-in mode they land at fixed times:"],
      table: {
        head: ["At", "Beat", "What happens"],
        rows: [
          ["0:00", "Hook", "One line said over the action, not a title card"],
          ["0:03", "The point", "The single thing this Short teaches"],
          ["0:12", "Show it", "Demonstrate rather than describe, with no intro"],
          ["0:40", "Payoff and loop", "Land the result, then end on a line that makes the first frame worth watching again"],
        ],
      },
      after: ["One idea per Short. If you need more than one point, that is two Shorts or one long video."],
    },
    {
      h: "How the timings work, and when to ignore them",
      p: [
        "For long videos, the built-in outline spreads the sections evenly across your target length. At 8 minutes, nine sections start roughly every 53 seconds: 0:00, 0:53, 1:47, 2:40 and so on. The 8 to 10 minute option times the outline across 8 minutes, and the 15 minutes or more option across 15. The AI writer sets its own timings within the length you pick.",
        "Even spacing is a starting point, not a rule. A hook usually needs far less time than its slot, and your main points far more. Use the timings to spot imbalance: if one section would run three times longer than the others, it is probably its own video.",
        "The 8-minute option exists because videos of eight minutes or longer can carry mid-roll ads. Only choose it if your content really fills the time. Padding a video to reach a length tends to cost you viewers, which costs more than the extra ad.",
      ],
    },
    {
      h: "How to write a YouTube hook that holds viewers",
      p: ["The opening is the only part written out in full, because the first seconds decide whether people stay. A good hook:"],
      list: [
        "<b>Starts on the problem or the result.</b> \"If your photos come out blurry, it is almost always one of these\" beats \"Hey guys, welcome back\".",
        "<b>Matches the title and thumbnail.</b> The viewer clicked for a promise. Confirm it straight away.",
        "<b>Sounds like you.</b> Rewrite the generated hook in your own words, then say it out loud before you film.",
      ],
      after: [
        "Need an idea first? The <a href=\"../youtube-video-ideas-generator/\">video ideas generator</a> gives each idea a ready-made hook. Once the outline is done, pick the title with the <a href=\"../youtube-title-generator/\">title generator</a>, and after you edit, turn your real section times into chapters with the <a href=\"../youtube-description-generator/\">description generator</a>.",
      ],
    },
  ],
  faq: [
    ["Is this YouTube script outline generator free?", "Yes. No sign-up and no account. Generate as many outlines as you like."],
    ["Is this a full YouTube script?", "No. It is an outline: the hook is written out, and the other sections say what to cover. You fill in the words, which keeps the video sounding like you rather than like a template."],
    ["How long should a YouTube script be?", "As long as the content needs. Pick the target length that fits your topic. If a section runs much longer than the others, consider making it a separate video rather than padding the rest."],
    ["Should I start my video with an intro?", "Not a greeting or a branded intro. Both the AI writer and the built-in outline open on the problem or result, because viewers decide in the first seconds whether to stay."],
    ["Why is there an 8-minute option?", "Videos of eight minutes or longer can carry mid-roll ads. Choose it only if the content really fills the time, because padding usually costs viewers."],
    ["Does it work for Shorts?", "Yes. Pick \"Under a minute\" and you get four beats: hook, the point, show it, and payoff with a loop back to the start."],
    ["Will the AI invent facts or results for my video?", "No. It is told never to invent facts, numbers or results. The Proof section asks you to show your own result or example. If you do not have one, drop that section rather than making one up."],
    ["Can I use the timestamps as YouTube chapters?", "Not as they are. They are planning times. After you edit, use the real start time of each section as your chapters in the description."],
  ],
};
