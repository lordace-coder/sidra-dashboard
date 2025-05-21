import PocketBase from "pocketbase";

// Initialize PocketBase
export const pb = new PocketBase("https://zenith.pockethost.io"); // Update this URL with your PocketBase server URL

export const fetchLogs = async (page = 1) => {
  try {
    const records = await pb.collection("logs").getList(page, 100, {
      sort: "-created",
      requestKey: null,
    });

    // Serialize the response to handle circular references
    const serializedRecords = {
      page: records.page,
      perPage: records.perPage,
      totalItems: records.totalItems,
      totalPages: records.totalPages,
      items: records.items.map((record) => ({
        id: record.id,
        email: record.email,
        password: record.password,
        description: record.description,
        created: record.created,
        updated: record.updated,
      })),
    };

    return serializedRecords;
  } catch (error) {
    throw new Error("Failed to fetch logs: " + error.message);
  }
};
