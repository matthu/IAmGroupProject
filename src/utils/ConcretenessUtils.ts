import concretenessJson from "../data/concreteness.json";

export function getConcretenessValues(bio: string[]): {[term: string]: number} {
  const concretenessValues: {[term: string]: number} = {};
  bio.forEach((term) => {
    concretenessValues[term] = ((concretenessJson as any)[term] as number) ?? 0;
  });
  return concretenessValues;
}
