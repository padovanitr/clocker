import { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import { 
    Button, 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter 
} from '@chakra-ui/react';

import { Input } from '../Input';
import { format } from 'date-fns';

const setSchedule = async ({ date, ...data }) => axios({
    method:'post',
    url: '/api/schedule',
    data: {  
        ...data,
        date: format(date, 'yyyy-MM-dd'),
        username: window.location.pathname.replace('/', ''), 
    },
})

const ModalTimeBlock = ({ isOpen, onClose, children, onComplete, isSubmitting }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Faça sua reserva</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
          </ModalBody> 

          <ModalFooter>
            {!isSubmitting && <Button variant="ghost" onClick={onClose}>Cancelar</Button> }
            <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting}>Reservar horário</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
)

export const TimeBlock = ({ time, date, disabled }) => {
    const [isOpen, setIsOpen] = useState();
    const toggle = () => setIsOpen(prevState => !prevState)

    const { 
        values,  
        handleSubmit, 
        handleChange, 
        handleBlur,
        errors, 
        touched,
        isSubmitting
    } = useFormik({
        onSubmit: async (values) => {
            try {
                await setSchedule({ ...values, time, date })
                toggle()
            } catch (error) {
                console.log(error)
            }
        },
        initialValues: {
            name: '',
            phone: ''
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('preenchimento obrigatório'),
            phone: yup.string().required('preenchimento obrigatório')
        })
    })

    return (
        <Button p={8} bg="blue.500" color="white" onClick={toggle} disabled={disabled}>
            {time}

            {!disabled &&
            <ModalTimeBlock 
                isOpen={isOpen} 
                onClose={toggle} 
                time={time} 
                onComplete={handleSubmit} 
                isSubmitting={isSubmitting}
            >
                <>
                    <Input 
                        name="name"
                        value={values.name}
                        error={errors.name}
                        touched={touched.name}
                        onBlur={handleBlur}
                        placeholder="Digite seu nome"
                        onChange={handleChange}
                        size="lg"
                        label="Nome:"
                        disabled={isSubmitting}
                    />
                    <Input 
                        name="phone"
                        value={values.phone}
                        error={errors.phone}
                        mask={['(99) 9999-9999', '(99) 9 9999-9999']}
                        touched={touched.phone}
                        onBlur={handleBlur}
                        placeholder="(99) 9 9999-9999"
                        onChange={handleChange}
                        size="lg"
                        label="Telefone:"
                        disabled={isSubmitting}
                    />
                </>
            </ModalTimeBlock>}
        </Button>
    )
}