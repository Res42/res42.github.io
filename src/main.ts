import { saveAs } from "file-saver";
import "./components/Card";
import "./components/FileCard";
import type { FileCard, FileSelectedEvent } from "./components/FileCard";
import { transformMakTransactionHistoryToPortfolioPerformance } from "./mak-to-pp";

const fileCard = document.querySelector<FileCard>("#makToPp")!;
const havasdModeInput =
  document.querySelector<HTMLInputElement>("#havasdMode")!;

fileCard.addEventListener("file-selected", async (e) => {
  const file = (e as FileSelectedEvent).detail.files?.[0];

  if (file == null) {
    return;
  }

  const newFile = await transformMakTransactionHistoryToPortfolioPerformance(
    file,
    havasdModeInput.checked,
  );

  saveAs(newFile, "transaction.csv");
});
