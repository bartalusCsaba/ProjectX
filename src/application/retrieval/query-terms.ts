
export const MAX_TERMS = 32;
const WORD = /[\p{L}\p{N}]{2,}/gu;
const WHITESPACES = /\s+/g;
const STOP_WORDS = "a an and are as at be but by can could did do does for from get got had has have how i if in into is it its me my no not of on or our should so than that the their them then there these they this to too was we were what when where which who why will with would you your\n" +
  "a az és egy hogy is nem meg de ha van volt lesz mi mit ki kik hol mikor miért hány mennyi milyen melyik ez azt ezt el fel le be ki csak még már vagy mint\n" +
  "și sau un o al ale ai la în din pe de cu care ce cum cine când unde câte cât este sunt fost pentru prin fie dar nu mai se să"
const stopWordsList = new Set(STOP_WORDS.split(WHITESPACES));

export function queryTerms(text: string): string[] {
  const words = text.toLowerCase().match(WORD) ?? [];
  const meaningful = words.filter(word => !stopWordsList.has(word));
  const terms = meaningful.length > 0 ? meaningful : words;
  return [...new Set(terms)].slice(0, MAX_TERMS);
}

