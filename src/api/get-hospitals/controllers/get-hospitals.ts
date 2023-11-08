/**
 * A set of functions called "actions" for `get-hospitals`
 */
const fetch = require("node-fetch");

export default {
  getHospitals: async (ctx, next) => {

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }
    
    const deg2rad = (deg) => {
      return deg * (Math.PI/180)
    }

    const getGeolocation = async (zipcode) => {
      const url = `https://api-adresse.data.gouv.fr/search/?q=${zipcode}`;
      const response = await fetch(url);
      const data = await response.json() as {features: {geometry: {coordinates: number[]}}[]};
      return data.features[0].geometry.coordinates;
    }

    let { category, longitude, latitude, zipcode } = ctx.query;
    console.log(category, longitude, latitude, zipcode)
    const rayon = 20;

    if(zipcode) {
      const geolocation = await getGeolocation(zipcode);
      latitude = geolocation[1];
      longitude = geolocation[0];
    }

    const hospitals = await strapi.entityService.findMany('api::hospital.hospital', {
      filters: {
        category: category
      },
      limit: 100
    });

    const hps = hospitals.map(hospital => {
      return {
        ...hospital, 
        distance: getDistanceFromLatLonInKm(latitude, longitude, hospital.latitude, hospital.longitude),
        name: hospital.name,
        description: hospital.description,
        services_all: [],
        newhours: {
          closedHolidays: "UNKNOWN",
          description: null,
          monday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
          tuesday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
          wednesday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
          thursday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
          friday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
          saturday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
          sunday: {
            open: true,
            timeslot: {
              end: 2359,
              start: 100
            }
          },
        },
        position: {
          location: [hospital.longitude, hospital.latitude]
        },
        entity: {
          phones: [
            {
              phoneNumber: hospital.phoneNumber
            }
          ]
        }
      }
    });

    return {hospitals: hps.filter(hp => hp.distance < rayon).sort((a, b) => a.distance - b.distance).slice(0, 10)};
  },
};
