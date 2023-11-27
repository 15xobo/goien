import { redirect } from "next/navigation"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { addEntry } from "@/app/lib/goi"

export default function NewGoi() {
  async function addGoi(formData: FormData) {
    'use server'
    const text = formData.getAll('text')[0].toString()
    addEntry('テスト', { word: text, sentence: '' })
    redirect(`/goi/${encodeURIComponent('テスト')}`)
  }

  return (
    <div>
      <form action={addGoi}>
        <TextField type="text" name="text" autoFocus fullWidth />
        <Button type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  )
}
