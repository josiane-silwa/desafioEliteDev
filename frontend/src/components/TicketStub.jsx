import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { cores } from "../theme";

/**
 * Cartão com a silhueta de um canhoto de ingresso: dois recortes
 * circulares nas laterais de uma linha tracejada, separando o corpo
 * principal (esquerda) do talão (direita, `stub`).
 *
 * Uso: <TicketStub stub={<CodigoDoIngresso />}>{conteúdo principal}</TicketStub>
 * Se `stub` não for informado, renderiza como cartão único sem corte.
 */
export default function TicketStub({ children, stub, minHeight = 150, sx }) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        display: "flex",
        borderRadius: 3,
        border: `1px solid ${cores.linhaTracejada}`,
        overflow: "hidden",
        minHeight,
        ...sx,
      }}
    >
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, minWidth: 0 }}>{children}</Box>

      {stub && (
        <>
          <Box
            aria-hidden
            sx={{
              position: "relative",
              width: 0,
              borderLeft: `2px dashed ${cores.linhaTracejada}`,
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                left: -10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "background.default",
                border: `1px solid ${cores.linhaTracejada}`,
              },
              "&::before": { top: -10 },
              "&::after": { bottom: -10 },
            }}
          />
          <Box
            sx={{
              width: { xs: 96, sm: 130 },
              flexShrink: 0,
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: cores.tinta,
              color: "#fff",
              gap: 1,
            }}
          >
            {stub}
          </Box>
        </>
      )}
    </Paper>
  );
}
