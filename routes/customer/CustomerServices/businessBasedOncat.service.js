import business from "../../../models/BusinessModal.js";


export const BusinessBasedOnCatService = async (category, latitude, longitude) => {
    if (!latitude || !longitude) {
        throw new Error("Location not found! ,retry");
    }
    if (!category) {
        throw new Error("Catergory not present");
    }


    console.log("Category => "+category);
    console.log("latitude => "+latitude);
    console.log("longitude => "+longitude);
    //mongodb aggregation for calculating the distance betn(Me ---- business)
    // $geonear pipeline for getting the business based on the 4KM Radius

    const allbusiness = await business.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: "distance",
                maxDistance: 5000,
                spherical: true,
                query: {
                    BusinessCategory: category
                }
            }
        },
        {
            $sort: {
                distance: 1
            }
        }
    ]);

    console.log("Data => " + JSON.stringify(allbusiness));

    return allbusiness;

}