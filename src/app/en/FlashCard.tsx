import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { EnRunEntry as EnRunEntryData } from "../lib/model"
import Typography from "@mui/material/Typography"

const theme = responsiveFontSizes(createTheme());

export default function FlashCard({ runEntry, flipped, onClick }: {
    runEntry: EnRunEntryData,
    flipped: boolean,
    onClick: () => void,
}) {
    const { sentence, wordStart, wordEnd } = runEntry
    const firstPart = sentence.substring(0, wordStart)
    const wordPart = sentence.substring(wordStart, wordEnd)
    const lastPart = sentence.substring(wordEnd)

    return (
        <Card
            onClick={onClick}
            sx={{ width: '100%', minHeight: 400, maxWidth: 400, mt: 1, mb: 1, display: 'flex', alignItems: 'center' }}
        >
            <CardContent sx={{ inlineSize: '100%', textAlign: 'center' }}>
                <ThemeProvider theme={theme}>
                <Typography variant="h4" display='inline'>{firstPart}</Typography>
                <Typography
                    variant="h4"
                    display='inline'
                    color={flipped ? 'red' : 'primary.contrastText'}
                    sx={{ textDecoration: 'underline', textDecorationColor: 'red' }}
                >
                    {wordPart}
                </Typography>
                <Typography variant="h4" display='inline'>{lastPart}</Typography>
                </ThemeProvider>
            </CardContent>
        </Card>
    )
}
