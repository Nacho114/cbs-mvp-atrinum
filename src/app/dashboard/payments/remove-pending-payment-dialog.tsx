import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SelectPayment } from '@/lib/db/schema'
import { removePendingPayment } from './actions'
import { toast } from '@/hooks/use-toast'
import { usePayments } from '../dashboard-state-provider'
import { getPayments } from '../actions'

export function AlertDialog({
  isOpen,
  payment,
  onCancel,
  title,
  description,
}: {
  isOpen: boolean
  payment: SelectPayment
  onCancel: () => void
  title: string
  description: string
}) {
  const { setPayments } = usePayments()
  const handleConfirm = async () => {
    const response = await removePendingPayment(payment)
    if (response.success) {
      toast({ description: response.message })

      //TODO: How to make this safe
      const newPayments = await getPayments()
      if (newPayments) {
        setPayments(newPayments)
      }
    } else {
      toast({ variant: 'destructive', description: response.message })
    }
  }

  return (
    <BaseAlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </BaseAlertDialog>
  )
}
