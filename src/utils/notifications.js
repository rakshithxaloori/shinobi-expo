const titles = ["The weekend is here! 💥"];

const bodies = ["Let's record some video games! 🕹"];

const _randomTitle = () => {
  return titles[Math.floor(Math.random() * titles.length)];
};

const _randomBody = () => {
  return bodies[Math.floor(Math.random() * bodies.length)];
};

export const WEEKLY_NOTIFICATIONS = [
  {
    content: {
      title: _randomTitle(),
      body: _randomBody(),
    },
    trigger: {
      weekday: 7, // Saturday
      hour: 19,
      minute: 0,
      repeats: true,
    },
  },
  {
    content: {
      title: _randomTitle(),
      body: _randomBody(),
    },
    trigger: {
      weekday: 1, // Sunday
      hour: 19,
      minute: 0,
      repeats: true,
    },
  },
];
