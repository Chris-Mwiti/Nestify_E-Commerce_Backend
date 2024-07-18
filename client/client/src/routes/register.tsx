import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: Register
})


function Register(){
    return(
        <div
            className='
                w-full flex items-center justify-center text-lg text-slate-200
            '
        >
            Register with us.....
        </div>
    )
}