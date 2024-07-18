import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shop/')({
  component: POS
})

function POS(){
  return (
    <section className='w-full h-full'>
    </section>
  )
}