export const handleFileSelect = (
  event,
  MAX_FILE_SIZE,
  allowedFileTypes,
  selectedChatId,
  handleSendAttachment
) => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `Plik jest za duży. Maksymalny rozmiar to ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`
      );

      event.target.value = "";
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      alert(
        "Nieprawidłowy typ pliku. Dozwolone rozszerzenia: PDF, DOC, DOCX, TXT, JPG, PNG, GIF"
      );
      event.target.value = "";
      return;
    }

    handleSendAttachment(selectedChatId, file);
  }
};
