import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { goiClient } from "@/app/lib/goi"

export default function NewGoi({ params }: { params: { name: string } }) {
  async function addGoi(formData: FormData) {
    'use server'
    const goiName = decodeURIComponent(params.name)
    const text = formData.getAll('text')[0].toString()
    await goiClient.addEntry(goiName, { word: text, sentence: '' })
    revalidatePath(`/goi/${params.name}`)
    redirect(`/goi/${params.name}`)
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
