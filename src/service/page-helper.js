export function generateDisplayList(n) {
  const startNumber = ((n - 1) * 4);

  const result = [];
  for (let i = 0; i < 4; i++) {
    result.push(startNumber + i);
  }

  return result;
}

// Creator commentary : 1 room has 4 display, and the first room is number 1.