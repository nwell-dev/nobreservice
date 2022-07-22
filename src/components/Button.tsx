import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
  title: string;
}

export function Button({title, ...rest }: Props) {
  return (
    <ButtonNativeBase
    bg="purple.700"
    h={14}
    fontSize="sm"
    rounded="sm"
    _pressed={{bg: "purple.500"}}
    {...rest}
    
    >
      
    <Heading color="white" fontSize="sm"             textTransform="uppercase"
> 
        {title}
      </Heading>
    </ButtonNativeBase>
  );
}