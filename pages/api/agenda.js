import { firebaseServer } from './../../config/firebase/server';

const db = firebaseServer.firestore();
const agenda = db.collection('agenda');

export default async (req, res) => {
    const [, token] = req.headers.autorization.split(' ');

    if (!token) {
        return res.status(401)
    }

    try {
        const { user_id } = await firebaseServer.auth().verifyIdToken(token);
        const spanshot = await agenda
            .where('userId', '==', user_id)
            .where('when', '==', req.query.when)
            .get()

        return res.status(200).json(spanshot.docs);
    } catch (error) {
        console.error("FB ERROR ", error)
        return res.status(401)
    }
} 