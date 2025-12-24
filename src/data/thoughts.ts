export interface Thought {
  text: string;
  category: 'past' | 'present' | 'future';
}

export const pastThoughts: string[] = [
  "I used to be afraid of the dark",
  "I once believed in forever",
  "I forgot to water the plants again",
  "I left the oven on once",
  "I used to count the stars",
  "I had a dream about flying",
  "I missed the last train home",
  "I wrote a letter I never sent",
  "I danced in the rain alone",
  "I lost my favorite book",
  "I believed in magic then",
  "I watched the sunset from the roof",
  "I held my breath underwater",
  "I made a wish on a coin",
  "I climbed trees as a child",
  "I laughed until I cried",
  "I forgot their name already",
  "I slept through the morning",
  "I drew pictures in the sand",
  "I kept all the movie tickets",
  "I learned to let go slowly",
  "I whispered secrets to the moon",
  "I collected shells by the sea",
  "I believed the world was small",
  "I traced the cracks in the ceiling",
];

export const presentThoughts: string[] = [
  "I am drinking cold coffee",
  "I am listening to the silence",
  "I am forgetting what I was thinking",
  "I am watching dust float in light",
  "I am breathing slowly now",
  "I am wondering about dinner",
  "I am feeling the floor beneath me",
  "I am noticing the shadows move",
  "I am counting my heartbeats",
  "I am aware of my hands",
  "I am existing in this moment",
  "I am hearing distant traffic",
  "I am blinking more than usual",
  "I am thinking about thinking",
  "I am feeling slightly hungry",
  "I am noticing the temperature",
  "I am waiting for something",
  "I am humming an old song",
  "I am tasting yesterday's tea",
  "I am watching the light change",
  "I am feeling the weight of air",
  "I am here, somehow",
  "I am listening to my own thoughts",
  "I am aware of time passing",
  "I am simply being",
];

export const futureThoughts: string[] = [
  "I will find my keys tomorrow",
  "I will remember this feeling",
  "I will learn to be patient",
  "I will forget to call them",
  "I will see the ocean again",
  "I will make better choices",
  "I will wake up earlier someday",
  "I will finish what I started",
  "I will become someone else",
  "I will understand eventually",
  "I will let the plants grow",
  "I will watch the seasons change",
  "I will find peace in small things",
  "I will learn a new language",
  "I will visit old friends",
  "I will write that letter finally",
  "I will sleep under the stars",
  "I will forgive myself someday",
  "I will dance again soon",
  "I will embrace the unknown",
  "I will find what I'm looking for",
  "I will be okay with silence",
  "I will remember to breathe",
  "I will welcome the morning light",
  "I will grow into myself",
];

export const hiddenQuotes: string[] = [
  "In the space between thoughts, there is everything.",
  "The dust settles where attention fades.",
  "Time moves differently when you're not watching.",
  "Entropy is just the universe exhaling.",
  "What grows in neglect teaches us patience.",
  "The hum beneath silence is the sound of being.",
  "We are all just frequencies looking for harmony.",
  "Clean windows reveal nothing new, only clarity.",
  "The moss knows what the stone has forgotten.",
  "Every moment is a small death of the one before.",
];

export const getRandomThought = (category: 'past' | 'present' | 'future'): string => {
  let thoughts: string[];
  
  switch (category) {
    case 'past':
      thoughts = pastThoughts || [];
      break;
    case 'present':
      thoughts = presentThoughts || [];
      break;
    case 'future':
      thoughts = futureThoughts || [];
      break;
    default:
      thoughts = presentThoughts || [];
  }
  
  if (!thoughts || thoughts.length === 0) {
    return "A thought drifts by...";
  }
  
  return thoughts[Math.floor(Math.random() * thoughts.length)];
};

export const getRandomQuote = (): string => {
  return hiddenQuotes[Math.floor(Math.random() * hiddenQuotes.length)];
};
