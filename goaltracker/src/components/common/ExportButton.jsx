import { Button } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useTranslation } from "react-i18next";

export default function ExportButton({
  goals,
  fileName = "goals_export.json",
  disabled = false,
}) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  const handleExport = () => {
    if (!goals || goals.length === 0) return;

    const goalsToExport = goals.map(
      ({
        id,
        title,
        category,
        type,
        target,
        progress,
        status,
        startDate,
        endDate,
        logs,
      }) => ({
        id,
        title,
        category,
        type,
        target,
        progress,
        status,
        startDate,
        endDate,
        logs,
      })
    );

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(goalsToExport, null, 2));

    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);

    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadRoundedIcon />}
      onClick={handleExport}
      disabled={disabled}
      sx={{ px: isFa ? 2.75 : 2 }}
    >
      {isFa ? "خروجی گرفتن" : "Export"}
    </Button>
  );
}
