'use client'

import { EnRunEntry as EnRunEntryData, GoiEntry as GoiEntryData } from "../lib/model";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from "@mui/material/Box";
import FlashCard from "./FlashCard";
import IconButton from '@mui/material/IconButton'
import MobileStepper from '@mui/material/MobileStepper'
import Stack from "@mui/material/Stack";
import { useState } from "react";

export default function EnRun({ goiEntries }: { goiEntries: Array<GoiEntryData>, }) {
    const entries: Array<EnRunEntryData> = goiEntries.map(entry => {
        const [wordStart, wordEnd] = entry.words[Math.floor(Math.random()) * entry.words.length]
        return { sentence: entry.sentence, wordStart, wordEnd }
    })

    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <Stack sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <FlashCard runEntry={entries[currentIndex]} />
            </Box>
            <MobileStepper
                steps={entries.length}
                activeStep={currentIndex}
                variant="progress"
                position="static"
                backButton={
                    <IconButton
                        disabled={currentIndex == 0}
                        color="primary"
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                }
                nextButton={
                    <IconButton
                        disabled={currentIndex + 1 == goiEntries.length}
                        color="primary"
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                }
            />
        </Stack>
    )
}