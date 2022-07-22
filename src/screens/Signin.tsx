import {useState} from 'react'
import { Alert } from 'react-native'

import auth from '@react-native-firebase/auth'
import { VStack, Heading, Icon, useTheme } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'

import Logo from '../assets/logo_primary.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export const Signin = () =>  {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  const { colors } = useTheme()

  function handleSignIn(){
    if(!email || !password){
      return Alert.alert("Entrar", "Informe e-mail e a senha")
    }

    setIsLoading(true)

    auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error)
      setIsLoading(false)

      if (error.code === 'auth/invalid-email') {
        return Alert.alert('Entrar', 'E-mail inválido.' )
      }
      if (error.code === 'auth/wrong-password') {
        return Alert.alert('Entrar', 'E-mail ou Senha inválida.' )
      }
      if (error.code === 'auth/user-not-found') {
        return Alert.alert('Entrar', 'E-mail ou Senha inválida.')
      }
      return Alert.alert("Entrar", "Não foi possivel acessar.")
    })
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo/>
      <Heading color="gray.100" fontSize="xl" mt={12} mb={6}>
        Acesse Sua Conta
      </Heading>
      <Input
        mb={2}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
        onChangeText={setEmail}
      />

      <Input
        mb={6}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button 
      title="Entrar" 
      w="full" 
      onPress={handleSignIn}
      isLoading={isLoading}
      />
    </VStack>
  )
}
