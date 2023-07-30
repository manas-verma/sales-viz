import Vessel from "@vesselapi/sdk";
import db from "@/db";
import { memo } from "radash";

const vesselClient = ({ userId }: { userId: string }) => {
  const makeApi = memo(async () => {
    const accessToken = await db.getAccessToken({
      userId,
    });
    return Vessel({
      apiToken: process.env.VESSEL_API_KEY,
      accessToken: accessToken ?? "",
    });
  });

  return {
    accounts: async (cursor?: string) => {
      const api = await makeApi();
      const { body } = await api.unifications.crm.accounts.list({
        cursor,
        associations: ["contacts", "deals"],
      });
      return {
        accounts: body.result.accounts,
        cursor: body.result.nextPageCursor,
      };
    },
  };
};

export default vesselClient;
