// The starting / Week 12 snapshot scale (shared so both use the same statements).

const SNAPSHOT = {
  min: 1,
  max: 5,
  labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
  groups: [
    {
      title: "Awareness",
      statements: [
        "I notice the thoughts I repeat about myself.",
        "I can name at least one belief that holds me back.",
        "I know where some of my beliefs came from.",
        "I can tell the difference between a fact and a belief about myself.",
      ],
    },
    {
      title: "Self-talk",
      statements: [
        "When I make a mistake, I talk to myself fairly.",
        "I can replace a harsh thought with a more balanced one.",
        "I believe my worth does not depend on my latest result.",
        "I can accept praise without dismissing it.",
      ],
    },
    {
      title: "Action",
      statements: [
        "I act on important goals even when I feel doubt.",
        "I can say no when something isn't right for me.",
        "I try new things even if I might look foolish.",
        "I have habits that support the person I want to become.",
      ],
    },
  ],
  bands: [
    { min: 12, max: 24, title: "Starting point", text: "Many of your beliefs are running on autopilot. This programme will help you see and rewrite them." },
    { min: 25, max: 36, title: "Aware", text: "You notice some of your beliefs, but they still often decide what you do." },
    { min: 37, max: 48, title: "Rewriting", text: "You already challenge some beliefs; this programme will make it a reliable skill." },
    { min: 49, max: 60, title: "Self-authoring", text: "You actively shape your self-talk. Use the programme to go deeper and help others." },
  ],
};

module.exports = { SNAPSHOT };
