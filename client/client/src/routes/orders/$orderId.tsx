import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/$orderId')({
  component: () => <div>Hello /orders/$orders!</div>
})