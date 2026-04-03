import CompleteSessionClient from './CompleteSessionClient'

export default function CompleteSessionPage() {
  const sessionPrice = parseInt(process.env.SESSION_PRICE ?? '75')
  return <CompleteSessionClient sessionPrice={sessionPrice} />
}
