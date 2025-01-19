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
import { SelectMove } from '@/lib/db/schema'
import { removePendingMove } from './actions'
import { toast } from '@/hooks/use-toast'
import { useMoves } from '../dashboard-state-provider'
import { getMoves } from '../actions'

export function RemovePendingMoveDialog({
  isOpen,
  move,
  onCancel,
  title,
  description,
}: {
  isOpen: boolean
  move: SelectMove
  onCancel: () => void
  title: string
  description: string
}) {
  const { setMoves } = useMoves()
  const handleConfirm = async () => {
    const response = await removePendingMove(move)
    if (response.success) {
      toast({ description: response.message })

      //TODO: How to make this safe
      const newMoves = await getMoves()
      if (newMoves) {
        setMoves(newMoves)
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
