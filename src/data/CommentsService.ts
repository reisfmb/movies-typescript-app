import { DB } from '../firebase-config'; 
import { doc, setDoc, updateDoc, getDoc } from '@firebase/firestore';

const COLLECTION_NAME = 'comments';

async function getComments(docId: string): Promise<Array<string>> {
    const docRef = doc(DB, COLLECTION_NAME, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return [];
    }

    return docSnap.data().comments || [] as Array<string>;
}

async function updateComments(docId: string, updatedComments: Array<string>): Promise<void> {
    const docRef = doc(DB, COLLECTION_NAME, docId);
    const docSnap = await getDoc(docRef);
    const data = { comments: updatedComments };

    if (docSnap.exists()) {
        await updateDoc(docRef, data);
    } else {
        await setDoc(doc(DB, COLLECTION_NAME, docId), data);
    }
}

export {
    getComments,
    updateComments
}