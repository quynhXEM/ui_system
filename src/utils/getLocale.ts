export const getLocaleByIP = async () => {
  try {
    const countryResponse = await fetch(`https://api.country.is/`);
    const countryCode = await countryResponse.json();

    return countryCode?.country === "VN" ? "vi" : "en";
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("ERROR getLocaleByIP:", error);
    }

    return "en";
  }
};
