import { formatTimestamp } from "../utils/formatTimestamp";

describe("formatTimestamp", () => {
  // Test dla dzisiejszej daty - powinien zwrócić "HH:MM"
  test("should return HH:MM format for today's date", () => {
    const today = new Date();
    const isoString = today.toISOString();
    const result = formatTimestamp(isoString);

    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    expect(result).toBe(`${hours}:${minutes}`);
  });
});
