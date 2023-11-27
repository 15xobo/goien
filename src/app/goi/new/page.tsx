import { createGoi } from "@/app/lib/goi"
import { redirect } from "next/navigation"

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
        <input type="text" name="text" autoFocus />
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
