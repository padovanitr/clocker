import { Button } from '@chakra-ui/react';
import firebase from '../../config/firebase';

export default function Agenda() {
    const logout = () => firebase.auth().signOut()
    return (
      <div>
          <Button onClick={logout }>Sair</Button>
      </div>
    )
}