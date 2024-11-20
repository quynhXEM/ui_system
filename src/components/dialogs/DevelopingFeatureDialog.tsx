import { useDictionary } from "@/contexts/dictionaryContext"
import CustomDialog, { CustomDialogData } from "@components/CustomDialog"

type DevelopingFeatureDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const DevelopingFeatureDialog = ({ isOpen, onClose }: DevelopingFeatureDialogProps) => {
  const { dictionary } = useDictionary()

  const dialogData: CustomDialogData = {
    isOpen: false,
    title: dictionary.developing_feature,
    contentText: dictionary.developing_feature_message,
    actions: [
      {
        label: dictionary.ok,
        buttonProps: {
          onClick: onClose
        }
      }
    ]
  }

  return (
    <CustomDialog dialogData={{ ...dialogData, isOpen }} onCloseDialog={onClose} />
  )
}

export default DevelopingFeatureDialog
