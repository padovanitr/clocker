import { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Button, Container, Box, IconButton } from '@chakra-ui/react';
import { addDays, subDays } from 'date-fns';
import axios from 'axios';

import { useFetch } from '@refetty/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Logo, useAuth, formatDate } from './../components';

import { getToken } from '../config/firebase/client';

const getAgenda = async (when) => { 
  const token = await getToken();
  
  return axios({
    method:'get',
    url: '/api/agenda',
    params: { when },
    headers: {
      autorization: `Bearer ${token}`
    }
  })

}

const Header = ({ children }) => (
  <Box p={4} display="flex" justifyContent="space-between" alignItems="center">
    {children}
  </Box>
)

export default function Agenda () {
  const router = useRouter();
  const [auth, { logout }] = useAuth();
  const [when, setWhen] = useState(() => new Date());
  const [data, { loading, status, error }, fetch] = useFetch(getAgenda, { lazy: true });

  const addDay = () => setWhen(prevState => addDays(prevState, 1));
  const removeDay = () => setWhen(prevState => subDays(prevState, 1));

  useEffect(() => {
    !auth.user && router.push('/');
  }, [auth.user])
  
  useEffect(() => {
    fetch(when)
  }, [when])

  return (
    <Container>
      <Header>
        <Logo size={150} />
        <Button onClick={logout}>Sair</Button>
      </Header>

      <Box mt={8} display="flex" alignItems="center">
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={removeDay}/>
        <Box flex={1} textAlign="center">{ formatDate(when, 'PPPP') }</Box>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay}/>
      </Box>
    </Container>
  )
}