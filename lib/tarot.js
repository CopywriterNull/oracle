import { randomInt } from 'node:crypto';

// 78-card Rider-Waite deck. Meanings are our own short wording of the standard upright / reversed meanings.
// Reversed = the card's energy is blocked, delayed, or too much / too little, not simply the opposite.
// Meanings follow 《塔罗葵花宝典》 (the PDF from the partner): kw = the book's keyword list for each card,
// up / rev = our own short English summary of the book's upright and reversed readings (no book prose is copied).
// Reversed = the card's energy is blocked, delayed, or too much / too little, not simply the opposite.
const MAJOR = [
  ['The Fool', '愚人', '开始，冒险，大胆，天真，愚笨，我行我素，潜力，漂泊，旅行', 'a fresh start, a bold leap, endless potential, travel', 'too much: reckless, careless choices; too little: timid, overcautious, missing the chance'],
  ['The Magician', '魔术师', '创造力，沟通，交际，技能，精通，万事俱备，新计划，主动', 'skill, creativity, everything in place to begin, taking the initiative', 'energy aimed the wrong way, tricks or deceit, losing confidence and drive'],
  ['The High Priestess', '女祭司', '静止，消极，直觉，智慧，神秘', 'stillness, intuition, quiet inner wisdom, mystery', 'ignoring your intuition, chasing surface knowledge, restless instead of still'],
  ['The Empress', '皇后', '丰收，生产，创造，自然，母爱，美，欢乐，主动，热情', 'abundance, nurturing, creativity, beauty, warmth', 'feelings held back or care withheld, or ruled only by emotion; at best, calm reason in matters of the heart'],
  ['The Emperor', '皇帝', '父亲，权力，秩序，统治', 'authority, order, structure, a father figure', 'too little: weak, indecisive, irresponsible; too much: controlling, rigid, a tyrant'],
  ['The Hierophant', '教宗', '宗教，传统，援助，仪式，教育，道德，社会规范', 'tradition, guidance, help from a mentor, learning, ritual', 'time to break convention, or being too rigid; advice may not be reliable, plans or ceremonies delayed'],
  ['The Lovers', '恋人', '选择，爱情，性，结合，人际关系', 'love, union, an important choice, relationships', 'love that is not going smoothly, a hard or wrong choice, holding on to what is gone'],
  ['The Chariot', '战车', '意志，自律，胜利，旅程，竞争', 'willpower, discipline, victory, moving forward', 'setbacks from overreaching or rushing, conflict, travel delayed'],
  ['Strength', '力量', '力量，勇气，信心，耐心，以柔克刚', 'courage, confidence, patience, gentle strength that wins', 'self-doubt and fear take over, or strength misused; deal with your own emotions first'],
  ['The Hermit', '隐士', '谨慎，孤独，内省，指引', 'caution, solitude, reflection, inner guidance', 'careless, withdrawing too far, not listening to anyone'],
  ['Wheel of Fortune', '命运之轮', '命运，转变，契机，进展，幸运', 'fate turning in your favor, change, a lucky opening', 'the wheel turning down, bad timing, resisting a change that is coming anyway'],
  ['Justice', '正义', '决定，正义，平衡，法律', 'a fair decision, balance, truth, legal matters', 'unfair treatment, something hidden, a decision that is hard to make'],
  ['The Hanged Man', '吊人', '牺牲，等待，换个角度看，以退为进', 'a pause, sacrifice, seeing it from a new angle, stepping back to move forward', 'struggling instead of letting go, a sacrifice not paying off, or the waiting finally ending'],
  ['Death', '死神', '结束，转变，新生', 'an ending, transformation, rebirth', 'refusing to let go, fear of change, stuck in the past'],
  ['Temperance', '节制', '中庸，调和，沟通，教学，旅行', 'balance, moderation, harmony, good communication', 'going to extremes, poor communication, getting too emotional'],
  ['The Devil', '恶魔', '欲望，束缚，沉迷，物质主义', 'desire, attachment, temptation, materialism', 'breaking free from what binds you, or chasing desire by the wrong means'],
  ['The Tower', '塔', '剧变，灾难，破坏，天启', 'sudden upheaval, things falling apart, a revelation', 'a smaller shake-up, or holding back a change that needs to happen'],
  ['The Star', '星星', '宁静，和平，信心，希望', 'calm, peace, faith, hope', 'losing hope and faith, discouragement'],
  ['The Moon', '月亮', '幻觉，不安，恐惧，神秘，危险，隐藏的敌人', 'illusion, unease, fear, hidden dangers', 'hidden things coming to light, fear easing'],
  ['The Sun', '太阳', '成功，自由，快乐，团体', 'success, freedom, joy, togetherness', 'a smaller or later success, or getting it and still not feeling satisfied'],
  ['Judgement', '审判', '召唤，决定，解放，再生，判断，因果，业力', 'a calling, a decision, release, renewal, reaping what was sown', 'resisting the call, avoiding a decision, a short-sighted choice'],
  ['The World', '世界', '完成，完整，成功，成就，旅行', 'completion, wholeness, achievement, travel', 'almost there, one last step missing, not wanting to move on to the next stage'],
];

const SUITS = {
  Wands: ['♣', '权杖', [
    ['新行动，创造，机会，灵感', 'a new action, inspiration, opportunity', 'delays or a false start, poor planning'],
    ['权力，胆识，计划，决定', 'power, boldness, planning, deciding', 'losing nerve, a wrong plan, or finally stopping overthinking and acting'],
    ['贸易，领导，远见，合作，探索', 'vision, leadership, teamwork, exploring further', 'poor partners, short-sightedness, overconfidence, delays'],
    ['稳固，欢庆，和谐，繁荣', 'stability, celebration, harmony, a happy milestone', 'shaky foundations, discord, goals that do not line up'],
    ['冲突，竞争，奋斗，混乱，模仿', 'competition, struggle, a fair fight', 'unfair play, quarrels, disputes'],
    ['胜利，进展，自信，好消息', 'victory, progress, confidence, good news', 'a fall, pride before failure, bad news, success that comes late'],
    ['防御，挑战，勇气，对立，有利的位置', 'standing your ground, courage, the upper hand', 'losing the advantage, losing nerve'],
    ['迅速，抵达，旅行，讯息', 'speed, arrival, travel, news on the way', 'moving too fast and losing control, or delays'],
    ['警觉，固执，防御，经验，等待', 'alertness, holding the line, experience, waiting', 'worn down, unprepared, longer delays'],
    ['疲累，压力，努力，责任', 'exhaustion, pressure, heavy responsibility', 'at the breaking point, or finally setting the load down'],
    ['小顽童', 'a playful, curious child; eager and enthusiastic', 'spoiled and fickle, enthusiasm that fades fast, misleading news'],
    ['行动派，积极份子，阳光男孩，运动健将', 'a doer, energetic, sunny, adventurous', 'rash and impatient, or held back from acting'],
    ['傻大姐，阳光女孩，热情的农妇，女中豪杰，快乐，财运', 'cheerful, warm, generous, upfront, good fortune', 'jealous, sharp-tongued, controlling'],
    ['开国君主，威权，创造力', 'a founding leader, authority, vision', 'a tyrant, rash decisions, or weak and easily fooled'],
  ]],
  Cups: ['♥', '圣杯', [
    ['新感情，爱，喜悦，感受，直觉', 'new feelings, love, joy, intuition', 'emotional letdown, feeling rejected, a new relationship slow to start'],
    ['恋情，友谊，合作，结合', 'romance, friendship, partnership, coming together', 'imbalance, mistrust, drifting apart'],
    ['欢庆，结盟，团体，宴会，成功', 'celebration, alliances, friends, success', 'overindulgence, a group falling out, success fizzling'],
    ['不满，拒绝，冷淡，退缩，外遇', 'discontent, turning things down, withdrawal', 'dissatisfaction ending, ready to take the chance in front of you'],
    ['悲伤，忧郁，失落，失望', 'grief, disappointment, focusing on what was lost', 'deeper sorrow or bottled-up feelings; at best, seeing what you still have'],
    ['童年，回忆，思乡，照顾，馈赠', 'childhood, nostalgia, care, gifts', 'stuck in the past, or finally ready to look ahead'],
    ['迷惘，幻觉，想像，梦境，选择', 'confusion, daydreams, illusion, too many choices', 'the fog lifting, finally choosing and acting'],
    ['抛弃，不满足，行动，牺牲', 'walking away, wanting more, leaving something behind', 'afraid to leave, or leaving something worth keeping'],
    ['享乐，得意，美梦成真', 'pleasure, satisfaction, a wish come true', 'looking past pleasure for something deeper, or feelings hidden away'],
    ['情感团体，家庭，满足，和谐', 'family, belonging, contentment, harmony', 'family friction, a rift, not letting yourself enjoy what you have'],
    ['好奇的小孩，好朋友', 'a curious, gentle soul; a good friend; a sweet message', 'oversensitive, refusing kindness, disappointing news'],
    ['白马王子，浪漫诗人', 'a romantic, a charming prince, an invitation', 'sweet talk without commitment, escapism, be careful with offers'],
    ['修女，灵媒，言情小说的女主角，女艺术家', 'devoted, intuitive, compassionate, artistic', 'overwhelmed by emotion, living in fantasy, insecure and clingy'],
    ['宗教家，慈善家，艺术家', 'kind, generous, emotionally steady, creative', 'two-faced, hiding feelings, dishonest'],
  ]],
  Swords: ['♠', '宝剑', [
    ['新挑战，极端，理智，决心', 'a new challenge, clear thinking, determination', 'the challenge more likely to go badly, unfairness or misused power'],
    ['逃避，抗拒，对立，僵局，紧张', 'avoidance, a stalemate, tension', 'breaking the stalemate, though hidden lies may surface'],
    ['悲伤，失落，延迟', 'heartbreak, loss, delays', 'healing slowly, shutting others out, or a milder hurt'],
    ['休息，消极，沉思，准备，隐遁', 'rest, reflection, preparing, stepping back', 'rested and ready to return, or unable to rest'],
    ['无谓的胜利，自私，失落，争执，屈辱', 'a hollow win, selfishness, conflict, humiliation', 'a greater chance of losing, or finally dropping a pointless fight'],
    ['忧郁，疗伤，痊愈，旅行', 'sadness easing, healing, moving on, travel', 'more rough water ahead, slow healing, or finally opening up'],
    ['欺诈，孤立，尝试，自信', 'deception, going it alone, a risky attempt', 'getting good advice, schemes coming to light'],
    ['画地为限，坏消息，压迫，迷惑', 'feeling trapped, self-imposed limits, confusion', 'waking up to it, starting to step free'],
    ['绝望，梦魇，痛苦，失眠', 'despair, nightmares, sleepless worry', 'starting to see the light, hope returning'],
    ['惨痛，结束，黎明的黑暗', 'a painful ending, the darkness before dawn', 'the worst passing, a narrow escape, lessons from the fall'],
    ['间谍，狗仔队', 'watchful, alert, a sharp observer', 'suspicious of everyone, miscommunication, bad news'],
    ['战士，极端份子，反叛人士', 'a fighter, fast and fearless, a rebel', 'harsh, cutting words, rebelling for its own sake, or stalled'],
    ['强悍的寡妇，冰山美人，铁娘子', 'independent, sharp, honest, cool-headed', 'cold to the point of cruel, spiteful words, sorrow or separation'],
    ['专业人士，律师', 'a professional, sharp intellect, sound judgment', 'harsh and cold, or not as expert as they seem; do not lean on authority now'],
  ]],
  Pentacles: ['♦', '钱币', [
    ['财富，享乐，安全，实质，金钱计划', 'wealth, security, a solid money plan, something real', 'a money decision going wrong, less or later reward; play it safe'],
    ['波动，弹性，平衡，娱乐，抉择', 'ups and downs, flexibility, juggling, a choice', 'losing balance, too rigid; go with the flow'],
    ['合作，协调，计划，荣誉，才干', 'teamwork, skill, planning, recognition', 'problems at work, a team out of sync, not enough skill yet'],
    ['获得，控制，占有，遗产', 'gaining, holding on, security, an inheritance', 'gripping too tight, possessive, stingy'],
    ['欠缺，贫穷，疾病，艰困，爱侣', 'hardship, lack, hard times shared', 'more hardship, or pulling through against the odds'],
    ['慈善，慷慨，理财，施与受，宽大', 'generosity, giving and receiving, good money sense', 'stinginess, overspending, unfair dealings'],
    ['收成，暂停，思索', 'a harvest, a pause, weighing what to do next', 'little reward, a small gain falling apart; be patient'],
    ['技能，勤劳，工作', 'skill, diligence, craft, hard work', 'burnout, not enough skill, wanting to change jobs'],
    ['成功，信心，自律，独立', 'success, confidence, discipline, independence', 'slacking, effort spent on the wrong things, money loss'],
    ['富裕，事业团体，物质成功，传承', 'wealth, family business, lasting success, legacy', 'money problems, family friction over money, hold off on partnerships'],
    ['学生，学徒，小商人', 'a student, an apprentice, eager to learn', 'slacking off, bills or money bad news, plans cancelled'],
    ['企业家第二代，现实份子，工作狂', 'reliable, practical, hardworking', 'a workaholic, or drifting and unmotivated'],
    ['女企业家，老板娘，职业妇女', 'capable, nurturing, practical, secure', 'money trouble, neglectful, or over-controlling'],
    ['商人，实业家，老板', 'a successful businessperson, wealth, steady success', 'money not working out, stubborn, greedy'],
  ]],
};
const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
const ZH_RANKS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍者', '骑士', '王后', '国王'];
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

export const DECK = [
  ...MAJOR.map(([name, zh, kw, up, rev], i) => ({ name, zh, kw, glyph: ROMAN[i], up, rev })),
  ...Object.entries(SUITS).flatMap(([suit, [glyph, suitZh, cards]]) =>
    cards.map(([kw, up, rev], i) => ({ name: `${RANKS[i]} of ${suit}`, zh: suitZh + ZH_RANKS[i], kw, glyph, up, rev })),
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
