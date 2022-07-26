import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { useNavigation } from '@react-navigation/native'
import {
  VStack,
  HStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center
} from 'native-base'
import { SignOut } from 'phosphor-react-native'
import {ChatDots} from 'phosphor-react-native'


import { dateFormat } from '../utils/firestoreDateFormat'

import Logo from '../assets/logo_secondary.svg'

import { Filter } from '../components/Filter'
import { Order, OrderProps } from '../components/Order'
import { Button } from '../components/Button'
import { Loading } from '../components/Loading'


export const Home = () => {

  const [isLoading, setIsLoading] = useState(true)
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([
    /*{
      id: '123',
      title: 'Criação de Logo',
      description:
        'Criação de Logo - SM Motos, nas cores vermelha e preto, com simbolo de moto',
      when: '18/07/2022 às 10:00',
      status: 'open'
    }*/
  ])

  const navigation = useNavigation()
  const { colors } = useTheme()

  function handleNewOrder(){
    navigation.navigate('new')
  }

  function handleOpenDetails(orderId: string){
    navigation.navigate('details', {orderId})
  }

  function handleLogout(){
    auth().signOut().catch(error => {
      console.log(error)
      return Alert.alert("Sair", "Não foi possivel sair.")

    })
  }

  useEffect(()=>{
    setIsLoading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc=>{
          const { client, title, description, status, create_at} = doc.data()

          return {
            id: doc.id,
            client,
            title,
            description,
            status,
            when: dateFormat(create_at)
          }
        })
        setOrders(data)
        setIsLoading(false)
      });
      return subscriber


  },[statusSelected])

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        pl={8}
        px={6}
      >
        <Logo />

        <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} onPress={handleLogout} px={4} />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100" textTransform="uppercase" fontSize="lg">Ordem de Serviço</Heading>

          <Text color="gray.200" fontSize="md">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter
            type="closed"
            title="finalizados"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        { 
          isLoading ? <Loading/> :        
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)}/>}
          showsVerticalScrollIndicator = {false}
          contentContainerStyle={{paddingBottom: 100}}
          ListEmptyComponent={() => (
            <Center>
              <ChatDots  color={colors.gray[300]} size={40}  />
              <Text color="gray.300" fontSize="xl" mt={2} textAlign="center">Você ainda não possui {'\n'}
              serviços {statusSelected === 'open' ? 'em andamento' : 'finalizados'}</Text>
            </Center>
          )}
          />
        }

        <Button title="Nova Ordem" onPress={handleNewOrder} mt={1} />
      </VStack>
    </VStack>
  )
}
