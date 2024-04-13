'use client'

import { EnRunEntry as EnRunEntryData, GoiEntry as GoiEntryData } from "../lib/model";

import Box from "@mui/material/Box";
import Button from '@mui/material/Button'
import FlashCard from "./FlashCard";
import MobileStepper from '@mui/material/MobileStepper'
import { useState } from "react";

export default function EnRun({ goiEntries }: { goiEntries: Array<GoiEntryData>, }) {
    const entries: Array<EnRunEntryData> = goiEntries.map(entry => {
        const [wordStart, wordEnd] = entry.words[Math.floor(Math.random()) * entry.words.length]
        return { sentence: entry.sentence, wordStart, wordEnd }
    })

    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <Box>
            <FlashCard runEntry={entries[currentIndex]} />
            <MobileStepper
                steps={entries.length}
                activeStep={currentIndex}
                variant="progress"
                position="static"
                backButton={
                    <Button
                        disabled={currentIndex == 0}
                        variant="text"
                        color="primary"
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                    >
                        back
                    </Button>
                }
                nextButton={
                    <Button
                        disabled={currentIndex + 1 == goiEntries.length}
                        variant="text"
                        color="primary"
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                    >
                        next
                    </Button>
                }
            />
        </Box>
    )
}