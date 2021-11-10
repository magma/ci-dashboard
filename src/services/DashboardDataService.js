import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from "firebase/database";

const config = require("../../Firebase_config.json");
const firestoreApp = initializeApp(config);
const database = getDatabase(firestoreApp);
const dbRef = ref(database, '/');

class DashboardDataService {
  getAll() {
    return dbRef;
  }
}

export default new DashboardDataService();
