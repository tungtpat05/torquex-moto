import { KeyboardEvent, useState } from "react";
import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { Product } from "@/types/product.ts";
import { ProductSpecification } from "@/types/specDefinition.ts";

interface TabbedDetailsProps {
  product: Product;
}

const formatSpecValue = (spec: ProductSpecification): string => {
  if (spec.dataType === "select" && spec.optionValue) {
    return spec.optionValue;
  }
  if (spec.dataType === "number" && spec.valueNumber !== undefined && spec.valueNumber !== null) {
    const num = Number(spec.valueNumber);
    const formattedNum = Number.isInteger(num) ? num.toLocaleString() : String(num);
    return spec.unit ? `${formattedNum} ${spec.unit}` : formattedNum;
  }
  if (spec.value) {
    return spec.value;
  }
  return "—";
};

const TABS: { id: "specs" | "desc"; label: string }[] = [
  { id: "specs", label: "Technical Specifications" },
  { id: "desc", label: "Engineering Brief" },
];

const TabbedDetails = ({ product }: TabbedDetailsProps) => {
  const [activeTab, setActiveTab] = useState<"specs" | "desc">("specs");
  const specifications = product.specifications || [];

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIdx = currentIdx === 0 ? 1 : 0;
      setActiveTab(TABS[nextIdx].id);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 6 }}>
      {/* Semantic Telemetry Tab Bar */}
      <Box
        role="tablist"
        aria-label="Motorcycle Specifications and Description"
        sx={{
          display: "flex",
          gap: { xs: 2.5, md: 4 },
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          mb: 3.5,
        }}
      >
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <ButtonBase
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              sx={{
                pb: 2,
                px: 0.5,
                position: "relative",
                transition: "color 0.2s ease",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isActive ? "#FF6700" : "#A1A1AA",
                  "&:hover": { color: isActive ? "#FF6700" : "#FFFFFF" },
                }}
              >
                {tab.label}
              </Typography>
              {isActive && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#FF6700",
                    boxShadow: "0 0 12px rgba(255, 103, 0, 0.7)",
                  }}
                />
              )}
            </ButtonBase>
          );
        })}
      </Box>

      {/* Specifications Panel */}
      {activeTab === "specs" && (
        <Box
          id="panel-specs"
          role="tabpanel"
          aria-labelledby="tab-specs"
          sx={{
            backgroundColor: "rgba(15, 15, 20, 0.90)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderTop: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
            p: { xs: 3, md: 4 },
          }}
        >
          {specifications.length === 0 ? (
            <Typography sx={{ color: "#A1A1AA", fontStyle: "italic", fontSize: "0.9rem" }}>
              No technical specifications available for this model yet.
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
              {specifications.map((spec, index) => (
                <Grid key={spec.id || index} size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 2,
                      pb: 1.75,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#A1A1AA",
                      }}
                    >
                      {spec.displayName}
                    </Typography>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.86rem",
                        fontWeight: 800,
                        color: "#FFFFFF",
                        textAlign: "right",
                      }}
                    >
                      {formatSpecValue(spec)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Description Panel */}
      {activeTab === "desc" && (
        <Box
          id="panel-desc"
          role="tabpanel"
          aria-labelledby="tab-desc"
          sx={{
            backgroundColor: "rgba(15, 15, 20, 0.90)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderTop: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.65)",
            p: { xs: 3, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "#D4D4D8",
              lineHeight: 1.8,
              maxWidth: "78ch",
            }}
          >
            {product.description || "No detailed engineering brief available for this model yet."}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TabbedDetails;
