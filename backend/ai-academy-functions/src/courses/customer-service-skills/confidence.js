// The confidence check used at the start and end of the course.

const CONFIDENCE = {
  min: 1,
  max: 5,
  labels: ["Not confident", "A little", "Somewhat", "Confident", "Very confident"],
  groups: [
    {
      title: "Everyday service",
      statements: [
        "Finding out exactly what a customer needs.",
        "Showing empathy so a customer feels understood.",
        "Adapting my style to different types of customer.",
        "Making a positive first impression.",
        "Handling phone calls, holds and transfers professionally.",
      ],
    },
    {
      title: "Difficult situations",
      statements: [
        "Calming an angry customer.",
        "Saying no without upsetting the customer.",
        "Handling a customer who asks for my manager.",
        "Dealing with a complaint so the customer stays loyal.",
        "Staying calm and not taking rudeness personally.",
      ],
    },
  ],
  bands: [
    { min: 10, max: 20, title: "Getting started", text: "This course will give you the principles and practice to build real confidence." },
    { min: 21, max: 30, title: "Developing", text: "You handle everyday service; the course will strengthen you for difficult situations." },
    { min: 31, max: 40, title: "Capable", text: "You're confident in most situations; use the role-plays to sharpen the hardest ones." },
    { min: 41, max: 50, title: "Highly confident", text: "Use the course to refine your technique — and to coach others." },
  ],
};

module.exports = { CONFIDENCE };
