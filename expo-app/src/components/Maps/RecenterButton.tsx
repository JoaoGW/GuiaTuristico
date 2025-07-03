import { Button, ButtonIcon } from '@gluestack-ui/themed';

import { LocateFixed } from 'lucide-react-native';

interface RecenterButtonProps {
  onPress: () => void,
  styles?: Object
}

export function RecenterButton({ onPress, styles }: RecenterButtonProps) {
  return (
    <Button
      onPress={ onPress }
      bgColor='#FDFDFD'
      borderRadius={100}
      elevation={5}
      style={ styles }
      width={50}
      height={50}
    >
      <ButtonIcon as={ LocateFixed } color='black' size='xl' />
    </Button>
  );
}