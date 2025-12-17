import React from "react";
import { render, screen } from "@testing-library/react";
import Message from "../src/components/Message";

describe("Message Component", () => {
  const mockMessage = {
    id: 1,
    content: "Test message content",
    type: "message",
    timestamp: "2025-12-17T10:00:00Z",
  };

  const mockFormatTimestamp = (timestamp) => "10:00";

  test("renderuje wiadomość tekstowa jesli message.type to 'message'", () => {
    render(
      <Message
        message={mockMessage}
        isMyMessage={false}
        senderName="John Doe"
        senderShortName="JD"
        formatTimestamp={mockFormatTimestamp}
        senderColor="bg-blue-500"
      />
    );
    expect(screen.getByText("Test message content")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  test("Jeśli wiadomość jest moją wiadomością, to wrapper ma klasę 'justify-end'", () => {
    const { container } = render(
      <Message
        message={mockMessage}
        isMyMessage={true}
        senderName="John Doe"
        senderShortName="JD"
        formatTimestamp={mockFormatTimestamp}
        senderColor="bg-blue-500"
      />
    );
    const wrapper = container.getByText("Test message content").parentElement;
    expect(wrapper).toHaveClass("justify-end");
  });

  test("Jeśli wiadomość nie jest moją wiadomością, to wrapper ma klasę 'justify-start'", () => {
    const { container } = render(
      <Message
        message={mockMessage}
        isMyMessage={false}
        senderName="John Doe"
        senderShortName="JD"
        formatTimestamp={mockFormatTimestamp}
        senderColor="bg-blue-500"
      />
    );
    const wrapper = container.getByText("Test message content").parentElement;
    expect(wrapper).toHaveClass("justify-start");
  });
});
