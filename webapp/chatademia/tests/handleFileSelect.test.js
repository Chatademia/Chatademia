import { handleFileSelect } from "../src/utils/handleFileSelect";

describe("handleFileSelect", () => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];
  const mockHandleSendAttachment = jest.fn();
  const selectedChatId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  // ============ Test Sukcesu ============
  test("should call handleSendAttachment with correct parameters for valid file", () => {
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockEvent = {
      target: {
        files: [mockFile],
        value: "C:\\fakepath\\test.pdf",
      },
    };

    handleFileSelect(
      mockEvent,
      MAX_FILE_SIZE,
      allowedFileTypes,
      selectedChatId,
      mockHandleSendAttachment
    );

    expect(mockHandleSendAttachment).toHaveBeenCalledWith(
      selectedChatId,
      mockFile
    );
    expect(window.alert).not.toHaveBeenCalled();
  });
});
