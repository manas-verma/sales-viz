import client from "@/db/firebase";

type User = {
  userId: string;
  connectionId: string | null;
  accessToken: string | null;
};

const makeDb = () => {
  const load = async (userId: string): Promise<User | null> => {
    try {
      if (!userId || typeof userId !== "string") {
        throw new Error("Invalid userId parameter");
      }

      const docRef = client.collection("users").doc(userId);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        return null;
      }

      const user = docSnapshot.data() as User;
      return user;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  };

  const save = async (user: User) => {
    try {
      await client.collection("users").doc(user.userId).set({
        connectionId: user.connectionId,
        accessToken: user.accessToken,
      });
      console.log("User data stored successfully.");
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  };

  return {
    async getAccessToken({ userId }: { userId: string }) {
      const response = await load(userId);
      return response?.accessToken ?? null;
    },
    async getConnectionId({ userId }: { userId: string }) {
      const response = await load(userId);
      return response?.connectionId ?? null;
    },
    async saveAccessToken({
      userId,
      connectionId,
      accessToken,
    }: {
      userId: string;
      connectionId: string | null;
      accessToken: string | null;
    }) {
      await save({
        accessToken,
        connectionId,
        userId,
      });
    },
  };
};

const db = makeDb();
export default db;
