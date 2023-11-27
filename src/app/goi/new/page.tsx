import { redirect } from "next/navigation"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { createGoi } from "@/app/lib/goi"

export default function NewGoi() {
  async function addGoi(formData: FormData) {
    'use server'
    const text = formData.getAll('text')[0].toString()
    createGoi({ text: text })
    redirect('/goi')
  }

  return (
    <div>
      <form action={addGoi}>
        <TextField type="text" name="text" autoFocus fullWidth/>
        <Button type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </div>
  )
}
