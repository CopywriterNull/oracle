import { randomInt } from 'node:crypto';

// 78-card Rider-Waite deck. Meanings are our own short wording of the standard upright / reversed meanings.
// Reversed = the card's energy is blocked, delayed, or too much / too little, not simply the opposite.
const MAJOR = [
  ['The Fool', 'new beginnings, a leap of faith, spontaneity', 'recklessness, hesitation, holding back'],
  ['The Magician', 'willpower, skill, making it happen', 'scattered energy, talent used the wrong way'],
  ['The High Priestess', 'intuition, inner knowing, mystery', 'ignoring your gut, secrets, confusion'],
  ['The Empress', 'nurturing, abundance, creativity', 'smothering, creative block, neglecting yourself'],
  ['The Emperor', 'structure, authority, stability', 'control, rigidity, misuse of power'],
  ['The Hierophant', 'tradition, guidance, commitment', 'breaking convention, feeling restricted'],
  ['The Lovers', 'love, harmony, an important choice', 'imbalance, misalignment, a choice avoided'],
  ['The Chariot', 'determination, momentum, victory', 'no direction, pulled two ways, stalled'],
  ['Strength', 'courage, gentle strength, patience', 'self-doubt, impatience, low confidence'],
  ['The Hermit', 'reflection, solitude, inner guidance', 'isolation, withdrawing too far'],
  ['Wheel of Fortune', 'change, cycles, a turning point', 'bad timing, resisting change, setbacks'],
  ['Justice', 'fairness, truth, cause and effect', 'unfairness, dodging accountability'],
  ['The Hanged Man', 'pause, surrender, a new perspective', 'stalling, needless sacrifice, indecision'],
  ['Death', 'endings, transformation, letting go', 'resisting an ending, feeling stuck'],
  ['Temperance', 'balance, moderation, patience', 'excess, imbalance, rushing'],
  ['The Devil', 'attachment, temptation, unhealthy patterns', 'breaking free, reclaiming your power'],
  ['The Tower', 'sudden upheaval, revelation, the false falling away', 'a softer shake-up, delaying the inevitable'],
  ['The Star', 'hope, healing, renewal', 'discouragement, lost faith'],
  ['The Moon', 'uncertainty, illusion, hidden fears', 'fears fading, the truth surfacing'],
  ['The Sun', 'joy, success, warmth', 'a dimmer yes, joy arriving a little later'],
  ['Judgement', 'awakening, reckoning, a calling', 'self-doubt, ignoring the call'],
  ['The World', 'completion, fulfillment, wholeness', 'loose ends, almost there'],
];

const SUITS = {
  Wands: ['♣', 'action, passion, ambition', [
    ['new spark, inspiration, a bold start', 'delays, a false start'],
    ['planning, vision, deciding where to go', 'fear of the unknown, poor planning'],
    ['expansion, looking ahead, progress', 'obstacles, frustrated plans'],
    ['celebration, home, a milestone', 'instability, celebration on hold'],
    ['competition, friction, conflict', 'avoiding conflict, tension easing'],
    ['victory, recognition, confidence', 'self-doubt, falling short of recognition'],
    ['standing your ground, perseverance', 'overwhelmed, on the back foot'],
    ['speed, movement, news arriving fast', 'delays, waiting, frustration'],
    ['resilience, the last stretch', 'exhaustion, ready to quit'],
    ['burden, overload, too much responsibility', 'setting a burden down'],
    ['curiosity, enthusiasm, new ideas', 'scattered, no follow-through'],
    ['passion, adventure, impulsive action', 'haste, recklessness, burnout'],
    ['confidence, warmth, determination', 'jealousy, insecurity'],
    ['vision, leadership, boldness', 'impulsive, overbearing'],
  ]],
  Cups: ['♥', 'feelings, love, relationships', [
    ['new love, an open heart', 'blocked feelings, emptiness'],
    ['partnership, mutual attraction', 'imbalance, disconnection'],
    ['friendship, celebration, community', 'gossip, overindulgence, a third party'],
    ['apathy, missing what is offered', 'renewed interest, saying yes to an offer'],
    ['grief, regret, focusing on loss', 'acceptance, moving on'],
    ['nostalgia, innocence, reunion', 'stuck in the past'],
    ['many choices, fantasy, illusion', 'clarity, finally choosing'],
    ['walking away, seeking deeper meaning', 'fear of leaving, drifting'],
    ['a wish fulfilled, contentment', 'a wish fulfilled later than hoped'],
    ['harmony, family, lasting happiness', 'broken harmony, misaligned values'],
    ['tender feelings, a sweet message', 'emotional immaturity'],
    ['romance, charm, following the heart', 'moodiness, unrealistic hopes'],
    ['compassion, emotional security', 'codependence, overwhelmed by feeling'],
    ['emotional balance, kindness', 'moodiness, coldness'],
  ]],
  Swords: ['♠', 'thoughts, truth, conflict', [
    ['clarity, a breakthrough, the truth', 'confusion, miscommunication'],
    ['stalemate, a hard decision, avoidance', 'indecision, too much information'],
    ['heartbreak, grief, a painful truth', 'healing, recovery, forgiveness'],
    ['rest, recovery, stepping back', 'restlessness, burnout'],
    ['conflict, winning at a cost', 'reconciliation, regret'],
    ['transition, calmer waters ahead', 'resisting change, unfinished business'],
    ['deception, strategy, going it alone', 'coming clean, conscience'],
    ['feeling trapped, self-imposed limits', 'release, a new perspective'],
    ['anxiety, worry, sleepless nights', 'fears easing, hope returning'],
    ['a painful ending, the dark before dawn', 'recovery, surviving it'],
    ['curiosity, sharp words, new ideas', 'gossip, hasty words'],
    ['ambition, fast action, bluntness', 'rushing, careless words'],
    ['honesty, clarity, independence', 'coldness, cutting words'],
    ['intellect, truth, authority', 'harshness, manipulation'],
  ]],
  Pentacles: ['♦', 'money, work, the body', [
    ['a new opportunity, a solid start', 'a missed chance, poor planning'],
    ['juggling, balance, adaptability', 'overwhelm, overcommitment'],
    ['teamwork, skill, building something', 'sloppy work, no teamwork'],
    ['holding on, security, control', 'loosening your grip, or losing what you clutch'],
    ['hardship, feeling left out in the cold', 'help arriving, recovery'],
    ['generosity, giving and receiving', 'strings attached, careless spending'],
    ['patience, a long-term investment', 'impatience, little reward yet'],
    ['diligence, craft, mastery', 'perfectionism, lack of focus'],
    ['independence, self-sufficiency, ease', 'overwork, financial setbacks'],
    ['wealth, legacy, family security', 'financial loss, family friction'],
    ['ambition, study, a new venture', 'procrastination'],
    ['hard work, reliability, routine', 'stagnation, all work or no work'],
    ['nurturing, practical, generous', 'self-neglect, work-home imbalance'],
    ['wealth, security, discipline', 'materialism, stubbornness'],
  ]],
};
const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

export const DECK = [
  ...MAJOR.map(([name, up, rev], i) => ({ name, glyph: ROMAN[i], up, rev })),
  ...Object.entries(SUITS).flatMap(([suit, [glyph, theme, cards]]) =>
    cards.map(([up, rev], i) => ({ name: `${RANKS[i]} of ${suit}`, glyph, up, rev, theme })),
  ),
];

export const SPREADS = {
  'tarot-yesno': ['Card 1', 'Card 2', 'Card 3'],
  'tarot-guidance': ['The core', 'The obstacle', 'What to do', 'Your strength'],
};

// Shuffle = randomness, as the book itself says; each card lands upright or reversed 50/50.
export function draw(mode, rand = randomInt) {
  const deck = [...DECK];
  return SPREADS[mode].map((position) => {
    const card = deck.splice(rand(deck.length), 1)[0];
    return { position, ...card, reversed: rand(2) === 1 };
  });
}

// Yes / No spread: count upright cards.
export function tarotVerdict(cards) {
  return ['No', 'Probably no', 'Probably yes', 'Yes'][cards.filter((c) => !c.reversed).length];
}
