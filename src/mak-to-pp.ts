import XLSX from "xlsx";

interface MakRow {
  Instrumentum: string;
  "Tranzakció státusza": "Lezárt" | "Teljesült" | "Visszautasított";
  "Tranzakció típusa":
    | "Esedékesség fizetés"
    | "Eladás"
    | "Vétel"
    | "Pénzszámla befizetés"
    | "Pénzszámla kifizetés"
    | "ÚB eseti rendelkezés"
    | "Utalás érkeztetés"
    | "Esedékességi szerz.";
  Névérték: number;
  Összeg: number;
  Értéknap: string;
}

interface PpRow {
  Shares: number;
  Value: number;
  Date: string;
  Type: "Buy" | "Sell" | "Dividend" | "Deposit";
  "Security Name": string;
}

function normalizeInt(num: unknown): number {
  if (typeof num === "number") {
    return num;
  }

  if (num == null || num === "") {
    return 0;
  }

  if (typeof num === "string") {
    return parseInt(num.replaceAll(" ", ""), 10);
  }

  throw new Error(`Invalid numeric data: ${num}`);
}

function isPpSupportedRow(row: MakRow): boolean {
  const tipus = row["Tranzakció típusa"];
  const statusz = row["Tranzakció státusza"];

  return (
    (tipus === "Esedékesség fizetés" ||
      tipus === "Eladás" ||
      tipus === "Vétel" ||
      tipus === "Utalás érkeztetés") &&
    (statusz === "Lezárt" || statusz === "Teljesült")
  );
}

function isDiszkontKincstarjegy(row: MakRow): boolean {
  return row.Instrumentum.startsWith("Diszkont");
}

function transformShares(row: MakRow, shares: number) {
  if (isDiszkontKincstarjegy(row)) {
    return shares / 10_000;
  }
  return shares;
}

function transformType(row: MakRow): PpRow["Type"] {
  const tipus = row["Tranzakció típusa"];

  switch (tipus) {
    case "Eladás":
      return "Sell";
    case "Esedékesség fizetés":
      // Diszkont kincstárjegynél a lezárás "Esedékesség fizetés"
      return isDiszkontKincstarjegy(row) ? "Sell" : "Dividend";
    case "Vétel":
      return "Buy";
    case "Utalás érkeztetés":
      return "Deposit";

    default:
      throw new Error(`Unsupported type: ${tipus}.`);
  }
}

function transformName(name: string): string {
  name = name.replace(/_BABA$/, "").replace(/_EUR$/, "");

  if (/^Diszkont Kincstárjegy D\d+$/.test(name)) {
    name = name.replace(" D", " ");
  }

  return name;
}

function transform(row: MakRow, havasdMode: boolean): PpRow {
  return {
    Shares: transformShares(row, normalizeInt(row.Névérték)),
    Value: normalizeInt(row.Összeg),
    Date: row.Értéknap,
    Type: transformType(row),
    "Security Name": havasdMode
      ? transformName(row.Instrumentum)
      : row.Instrumentum,
  };
}

export async function transformMakTransactionHistoryToPortfolioPerformance(
  file: File,
  havasdMode: boolean,
  separator = ";",
): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (sheetName == null) {
    throw new Error("Missing sheet.");
  }

  const sheet = workbook.Sheets[sheetName];

  if (sheet == null) {
    throw new Error("Missing sheet.");
  }

  const data = XLSX.utils.sheet_to_json<MakRow>(sheet, {
    raw: true,
    defval: null,
  });

  const outputData = data
    .filter(isPpSupportedRow)
    .map((row) => transform(row, havasdMode));

  const outputSheet = XLSX.utils.json_to_sheet(outputData);

  const csv = XLSX.utils.sheet_to_csv(outputSheet, { FS: separator });

  return new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
}
