import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { 
  Container, 
  Text, 
  Box, 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  FormHelperText,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';

import { Logo } from '../components';
import { firebaseClient } from '../config/firebase/client';

const validationSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
  username: yup.string().required('Preenchimento obrigatório')
})

export default function Home() {
  const { 
    values, 
    touched, 
    errors, 
    handleChange, 
    handleBlur, 
    handleSubmit,
    isSubmitting
  } = useFormik({
    onSubmit: async (values, form) => {
      try {
        const user = await firebaseClient.auth().createUserWithEmailAndPassword(values.email, values.password);
        console.log(user)
      } catch (error) {
        console.log('ERROR', error)
      }
 
    },
    validationSchema,
    initialValues: {
      email: '',
      username: '',
      password: ''
    }
  })
  return (
    <Container p={4} centerContent>
      <Logo/>
      <Box  p={4} mt={8}>
        <Text>Crie a sua agenda compartilhada</Text>
      </Box>

      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input size="lg" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur}/>
          {touched.email && <FormHelperText textColor="#e74c3c">{errors.email}</FormHelperText> }      
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Senha</FormLabel>
          <Input size="lg" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur}/>
          {touched.password && <FormHelperText textColor="#e74c3c">{errors.password}</FormHelperText> }       
        </FormControl>

        <FormControl id="username" p={4} isRequired>
          <InputGroup size="lg">
            <InputLeftAddon>clocker.work</InputLeftAddon>
            <Input type="username" value={values.username} onChange={handleChange} onBlur={handleBlur}/>
          </InputGroup>
          {touched.username && <FormHelperText textColor="#e74c3c">{errors.username}</FormHelperText> }  
        </FormControl>

        <Box p={4}>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit} 
            width="100%" 
            isLoading={isSubmitting}
          >Entrar</Button>
        </Box>
      </Box>

      <Link href="/">Já tem uma conta? Acesse!</Link>
    </Container>
  )
}
