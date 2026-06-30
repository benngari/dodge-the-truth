/**
 * questions.ts
 * ------------------------------------------------------------------
 * All quiz content lives here, separate from components, so the game
 * logic never has to change just because the jokes do.
 *
 * Each question has a "correct" answer — that's the button that will
 * dodge the cursor. The other answer is the one the player can
 * actually click. wrongResponse fires when they click the static
 * (intended) button; catchResponse fires in the rare case they
 * manage to corner the runaway button.
 */

export type AnswerValue = "yes" | "no";

export interface Question {
  /** Stable id, used as the React key and for any future analytics. */
  id: number;
  /** The question shown to the player. */
  prompt: string;
  /** Which button ("yes" | "no") is the runaway / correct one. */
  correctAnswer: AnswerValue;
  /** Shown when the player clicks the static (wrong) answer — the normal path. */
  wrongResponse: string;
  /** Shown on the rare occasion the player actually catches the correct answer. */
  catchResponse: string;
  /** When true, BOTH buttons dodge the cursor — pure chaos mode. */
  isTrickQuestion?: boolean;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Are you secretly a dinosaur?",
    correctAnswer: "no",
    wrongResponse: "Phew. The Cretaceous Period was getting worried.",
    catchResponse: "RAWR. The truth is out. You ARE a dinosaur.",
  },
  {
    id: 2,
    prompt: "Have you ever eaten an entire pizza by yourself and regretted nothing?",
    correctAnswer: "yes",
    wrongResponse: "Liar. Everyone has done this at least once.",
    catchResponse: "Confirmed: you have never once regretted a pizza. Respect.",
  },
  {
    id: 3,
    prompt: "Is your phone currently at less than 20% battery?",
    correctAnswer: "yes",
    wrongResponse: "Suspiciously well-charged. We don't trust it.",
    catchResponse: "Your battery anxiety has been officially logged.",
  },
  {
    id: 4,
    prompt: "Can you lick your own elbow?",
    correctAnswer: "no",
    wrongResponse: "Statistically true. Most humans physically cannot.",
    catchResponse: "Either you're extremely flexible or extremely dishonest.",
  },
  {
    id: 5,
    prompt: "Do you talk to your houseplants when no one's listening?",
    correctAnswer: "yes",
    wrongResponse: "Sure you don't. Ficus knows the truth though.",
    catchResponse: "Your plants have officially filed a statement confirming this.",
  },
  {
    id: 6,
    prompt: "Have you ever pretended to know a song's lyrics by mumbling confidently?",
    correctAnswer: "yes",
    wrongResponse: "Everyone has mumble-sung. EVERYONE.",
    catchResponse: "A bold and rare admission of total lyrical fraud.",
  },
  {
    id: 7,
    prompt: "Is the sky actually a 1990s screensaver we all agreed to believe in?",
    correctAnswer: "no",
    wrongResponse: "Good. Keep believing in the sky. It's load-bearing.",
    catchResponse: "Reality.exe has stopped responding.",
    isTrickQuestion: true,
  },
  {
    id: 8,
    prompt: "Do you sometimes practice arguments in the shower that you'll never actually have?",
    correctAnswer: "yes",
    wrongResponse: "Shower-you remains undefeated in zero real debates.",
    catchResponse: "Shower-you has finally been subpoenaed.",
  },
  {
    id: 9,
    prompt: "Could you beat a goose in a fight?",
    correctAnswer: "no",
    wrongResponse: "Wise answer. Geese are undefeated for a reason.",
    catchResponse: "Bold claim. The geese have been notified.",
  },
  {
    id: 10,
    prompt: "Have you ever clapped when the airplane landed?",
    correctAnswer: "yes",
    wrongResponse: "Sure, Mr./Ms. Too Cool For Aviation Applause.",
    catchResponse: "A confirmed member of the Airplane Clapping Club.",
  },
  {
    id: 11,
    prompt: "Is cereal technically a soup?",
    correctAnswer: "yes",
    wrongResponse: "Denial is the first stage of cereal-soup grief.",
    catchResponse: "The Cereal Soup Council thanks you for your honesty.",
  },
  {
    id: 12,
    prompt: "Do you sometimes wave back at someone who wasn't waving at you?",
    correctAnswer: "yes",
    wrongResponse: "Nobody's perfect. We've all wave-faked our way to shame.",
    catchResponse: "Public Wave Embarrassment, confirmed and notarized.",
  },
  {
    id: 13,
    prompt: "Are you a robot reading this in a binary monotone right now?",
    correctAnswer: "no",
    wrongResponse: "Beep boop. Sure. Totally human of you to say that.",
    catchResponse: "01001000 01001001 — busted, bot.",
  },
  {
    id: 14,
    prompt: "Have you ever Googled something while it was already open in another tab?",
    correctAnswer: "yes",
    wrongResponse: "Your search history disagrees, but okay.",
    catchResponse: "Tab 14 confirms: you absolutely did this twice this week.",
  },
  {
    id: 15,
    prompt: "Is a hot dog a sandwich?",
    correctAnswer: "yes",
    wrongResponse: "The Sandwich Tribunal will see you in court.",
    catchResponse: "Finally. Someone willing to face the sandwich truth.",
  },
  {
    id: 16,
    prompt: "Do you own at least one pair of socks with a hole you keep meaning to fix?",
    correctAnswer: "yes",
    wrongResponse: "Your toes called. They have a different story.",
    catchResponse: "The Sock Confession has been filed for the record.",
  },
  {
    id: 17,
    prompt: "Could a thousand duck-sized horses defeat one horse-sized duck?",
    correctAnswer: "no",
    wrongResponse: "Smart. Nobody truly wants to fight the horse-sized duck.",
    catchResponse: "You've sided with the duck. We respect the chaos.",
    isTrickQuestion: true,
  },
  {
    id: 18,
    prompt: "Have you ever said 'you too' after a waiter said 'enjoy your meal'?",
    correctAnswer: "yes",
    wrongResponse: "We don't believe you, but we admire the confidence.",
    catchResponse: "The 'you too' files have been officially reopened.",
  },
  {
    id: 19,
    prompt: "Is it socially acceptable to nap under your desk at work?",
    correctAnswer: "no",
    wrongResponse: "Correct. HR has strong feelings about this one.",
    catchResponse: "Bold. Your employer has entered the chat.",
  },
  {
    id: 20,
    prompt: "Have you ever called the elevator button repeatedly thinking it'd come faster?",
    correctAnswer: "yes",
    wrongResponse: "Sure. You've just never once been impatient in your life.",
    catchResponse: "The elevator has filed a restraining order against your thumb.",
  },
  {
    id: 21,
    prompt: "Are you currently wearing socks that don't match?",
    correctAnswer: "yes",
    wrongResponse: "A matching-sock household. How rare. How suspicious.",
    catchResponse: "Sock Inspector General confirms: full chaos detected.",
  },
  {
    id: 22,
    prompt: "Could you survive a week without your phone?",
    correctAnswer: "no",
    wrongResponse: "Honest. Most of us would crumble by Tuesday.",
    catchResponse: "Bold claim. Your phone is currently buzzing in protest.",
  },
  {
    id: 23,
    prompt: "Do you secretly read the last page of a book first?",
    correctAnswer: "yes",
    wrongResponse: "A patient reader. Truly admirable restraint.",
    catchResponse: "Spoiler Bandit, apprehended at last.",
  },
  {
    id: 24,
    prompt: "Is a tomato a vegetable in everyday cooking, even though it's botanically a fruit?",
    correctAnswer: "yes",
    wrongResponse: "Botanically incorrect, culinarily correct. We'll allow it.",
    catchResponse: "The Botany Department has been alerted to your defiance.",
  },
  {
    id: 25,
    prompt: "Have you ever pretended to be on a phone call to avoid an awkward conversation?",
    correctAnswer: "yes",
    wrongResponse: "Suuure. 'Hello? Sorry, can't talk' has never crossed your lips.",
    catchResponse: "Fake Phone Call Hall of Fame has a new inductee.",
  },
  {
    id: 26,
    prompt: "Can you parallel park on the first try, every single time?",
    correctAnswer: "no",
    wrongResponse: "Relatable. Parallel parking remains undefeated.",
    catchResponse: "The driving instructor community demands proof.",
  },
  {
    id: 27,
    prompt: "Do you check if the fridge light actually turns off when you close the door?",
    correctAnswer: "yes",
    wrongResponse: "A normal, well-adjusted person who trusts appliances. Suspicious.",
    catchResponse: "Confirmed: you have stared into a closing fridge door at least once.",
  },
  {
    id: 28,
    prompt: "Is it possible to fold a piece of paper in half more than 7 times?",
    correctAnswer: "no",
    wrongResponse: "Physics agrees with you. The paper simply refuses.",
    catchResponse: "You've apparently broken geometry. Congratulations, or our condolences.",
  },
];
