import { collection, doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db } from './config/firebase.config';

// players data
// Simplified players data without stat fields
const playersData = [
  { id: '1', name: 'Destin Logan' },
  { id: '2', name: 'Paxton Warden' },
  { id: '3', name: 'Ryan Renfro' },
  { id: '4', name: 'Jaylin Gibson' },
  { id: '5', name: 'Cale Cosme' },
  { id: '6', name: 'Anthony Sydnor' },
  { id: '7', name: 'Anthony Sayles' },
  { id: '8', name: 'Amir Whitlock' },
  { id: '9', name: 'Carson Brownfield' },
  { id: '10', name: 'Marieon Anderson' },
  { id: '11', name: 'Jabe Haith' },
  { id: '12', name: 'Rob Stroud' },
  { id: '13', name: 'Devon Vanderheydt' },
  { id: '14', name: 'Amir Gates' },
  { id: '15', name: 'Austin Kulig' },
  { id: '16', name: 'Mac Hagemaster' },
  { id: '17', name: 'Bartosz Kapustka' },
  { id: '18', name: 'Cem Kirciman' },
];


export const addPlayersToFirestore = async () => {
  const playersCollection = collection(db, 'players'); // Get Firestore collection reference

  for (const player of playersData) {
    try {
      // Reference to the document for each player
      const playerDocRef = doc(playersCollection, player.id);
      const playerDocSnapshot = await getDoc(playerDocRef);

      if (!playerDocSnapshot.exists()) {
        // Add new player if no document with this ID exists
        await setDoc(playerDocRef, player);
        console.log(`Player ${player.name} added successfully`);
      } else {
        console.log(`Player ${player.name} already exists, skipping.`);
      }
    } catch (error) {
      console.error('Error checking/adding player to Firestore:', error);
    }
  }
};