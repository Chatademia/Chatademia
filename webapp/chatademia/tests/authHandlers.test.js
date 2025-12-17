import {
  handleLogout,
  getUserData,
  getChatsData,
} from "../src/utils/authHandlers";

global.fetch = jest.fn();
const mockNavigate = jest.fn();

describe("authHandlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    mockNavigate.mockClear();
    console.error = jest.fn();
  });

  // ============ handleLogout Tests ============
  describe("handleLogout", () => {
    test("should send DELETE request to /api/auth/session", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await handleLogout(mockNavigate);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/session"),
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        })
      );
    });
  });

  // ============ getUserData Tests ============
  describe("getUserData", () => {
    test("should send GET request to /api/users/user", async () => {
      const mockUserData = {
        id: 1,
        firstName: "Jan",
        lastName: "Kowalski",
        color: 5,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockUserData)),
      });

      const setUserData = jest.fn();
      await getUserData(setUserData, mockNavigate);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/user"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        })
      );
    });

    test("should call setUserData with fetched data", async () => {
      const mockUserData = {
        id: 1,
        firstName: "Jan",
        lastName: "Kowalski",
        color: 5,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockUserData)),
      });

      const setUserData = jest.fn();
      await getUserData(setUserData, mockNavigate);

      expect(setUserData).toHaveBeenCalledWith(mockUserData);
    });
  });

  // ============ getChatsData Tests ============
  describe("getChatsData", () => {
    test("should send GET request to /api/users/chats", async () => {
      const mockChatsData = [
        { id: 1, name: "Czat 1", shortName: "C1", color: 0 },
        { id: 2, name: "Czat 2", shortName: "C2", color: 1 },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockChatsData)),
      });

      const setChats = jest.fn();
      const setSelectedChatId = jest.fn();
      await getChatsData(setChats, setSelectedChatId, mockNavigate);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/users/chats"),
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        })
      );
    });
  });
});
