import { handleCreateChat, handleChatSwitch } from "../src/utils/chatHandlers";

// Mock fetch
global.fetch = jest.fn();

describe("chatHandlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    window.alert = jest.fn();
  });

  // ============ handleCreateChat Test ============
  test("handleCreateChat should create chat and call setters with response data", async () => {
    const mockChatData = {
      id: 1,
      name: "New Chat",
      color: 5,
      inviteLink: "http://localhost:3000/invite/1",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValueOnce(JSON.stringify(mockChatData)),
    });

    const setChats = jest.fn();
    const setSelectedChatId = jest.fn();
    const setInviteLink = jest.fn();
    const setShowSuccessPopup = jest.fn();

    await handleCreateChat(
      "New Chat",
      setChats,
      setSelectedChatId,
      setInviteLink,
      setShowSuccessPopup
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/chat/create-chat"),
      expect.objectContaining({ method: "POST" })
    );
    expect(setSelectedChatId).toHaveBeenCalledWith(1);
    expect(setShowSuccessPopup).toHaveBeenCalledWith(true);
  });

  // ============ handleChatSwitch Test ============
  test("handleChatSwitch should switch chat and invoke SignalR methods", async () => {
    const mockFetchMessages = jest.fn();
    const mockHubConnection = {
      current: {
        invoke: jest.fn().mockResolvedValue(undefined),
      },
    };

    const setSelectedChatId = jest.fn();

    await handleChatSwitch(
      2,
      1,
      mockHubConnection,
      setSelectedChatId,
      mockFetchMessages
    );

    expect(mockHubConnection.current.invoke).toHaveBeenCalledWith(
      "QuitChatSubscription",
      1
    );
    expect(mockHubConnection.current.invoke).toHaveBeenCalledWith(
      "JoinChatSubscription",
      2
    );
    expect(setSelectedChatId).toHaveBeenCalledWith(2);
    expect(mockFetchMessages).toHaveBeenCalledWith(2);
  });
});
