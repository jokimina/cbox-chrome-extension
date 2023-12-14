export function flatArray(arr: any[]): any[] {
  return arr.reduce((result: any[], current: any) => {
    if (Array.isArray(current)) {
      result.push(...flatArray(current));
    } else {
      result.push(current);
    }
    return result;
  }, []);
}

export function getAllCombinations(arr: any[]): any[][] {
  const combinations: any[][] = [];

  function generateCombinations(
    currentCombination: any[],
    remainingElements: any[],
  ) {
    if (currentCombination.length === 2) {
      combinations.push(currentCombination);
      return;
    }

    for (let i = 0; i < remainingElements.length; i++) {
      const newCombination = [...currentCombination, remainingElements[i]];
      const newRemainingElements = remainingElements.slice();
      newRemainingElements.splice(i, 1);
      generateCombinations(newCombination, newRemainingElements);
    }
  }

  generateCombinations([], arr);
  return combinations;
}

export function deduplicateArray<T>(arr: T[]): T[] {
  const uniqueSet = new Set<T>();
  const result: T[] = [];

  for (const item of arr) {
    if (!uniqueSet.has(item)) {
      uniqueSet.add(item);
      result.push(item);
    }
  }

  return result;
}