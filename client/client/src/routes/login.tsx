import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login
})

function Login(){
  return(
    <div
      className='
        w-full items-center justify-center text-foreground text-lg
      '
    >
      Login in with us..
    </div>
  )
}