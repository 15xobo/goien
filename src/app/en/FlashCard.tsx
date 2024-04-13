'use client'

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { EnRunEntry as EnRunEntryData } from "../lib/model"
import Typography from "@mui/material/Typography"
import { useState } from "react"

export default function FlashCard({ runEntry }: { runEntry: EnRunEntryData }) {
    const [flipped, setFlipped] = useState(false)

    const { sentence, wordStart, wordEnd } = runEntry
    const firstPart = sentence.substring(0, wordStart)
    const wordPart = sentence.substring(wordStart, wordEnd)
    const lastPart = sentence.substring(wordEnd)
    console.log(firstPart)
    console.log(wordPart)
    console.log(lastPart)


    function handleClick() {
        setFlipped(!flipped)
    }

    return (
        <Card sx={{ blockSize: '600px', inlineSize: '400px', display: 'flex', alignItems: 'center' }} onClick={handleClick}>
            {flipped ?
                <CardContent sx={{ inlineSize: '100%', textAlign: 'center' }}>
                    <Typography display='inline'>{firstPart}</Typography>
                    <Typography display='inline' color='error' sx={{ textDecoration: 'underline' }}>{wordPart}</Typography>
                    <Typography display='inline'>{lastPart}</Typography>
                </CardContent> :
                <CardContent sx={{ inlineSize: '100%', textAlign: 'center' }}>
                    <Typography display='inline'>{firstPart}</Typography>
                    <Typography display='inline' color='error' sx={{ whiteSpace: 'pre', textDecoration: 'underline' }}>{'    '.repeat(wordPart.length)}</Typography>
                    <Typography display='inline'>{lastPart}</Typography>
                </CardContent>
            }
        </Card>
    )
}
