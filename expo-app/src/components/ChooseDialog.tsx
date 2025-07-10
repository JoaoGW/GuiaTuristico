import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogFooter, 
  AlertDialogBody, 
  AlertDialogBackdrop,
  Button,
  ButtonText,
  Heading,
  Text,
  View
} from "@gluestack-ui/themed";

type DialogProps = {
  title: string,
  message: string,
  isOpen: boolean,
  setShowAlertDialog: (state: boolean) => void
}

export function ChooseDialog({ title, message, isOpen, setShowAlertDialog }: DialogProps) {
  const handleClose = () => setShowAlertDialog(false);

  return (
    <View>
      <AlertDialog
        isOpen={ isOpen }
        onClose={ handleClose }
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading fontWeight="$bold"size="lg">
              { title }
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody mt={3} mb={4}>
            <Text size="md">
              { message }
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={ handleClose }
              size="sm"
              mr={15}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button size="sm" onPress={ handleClose } bgColor="$red500">
              <ButtonText>Excluir</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}