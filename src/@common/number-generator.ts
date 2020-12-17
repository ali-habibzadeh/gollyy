function getRandomInt(min: number, max: number): number {
  const lowerBound = Math.ceil(min);
  const upperBound = Math.floor(max);
  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

export const generateLotteryNumbers = (): [number, number] => [getRandomInt(1, 59), getRandomInt(1, 59)];
