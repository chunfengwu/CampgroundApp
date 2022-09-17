const mongoose=require('mongoose');
const Campground=require('../models/campground')
const cities=require('./cities')
const { places, descriptors }=require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const sample=array => array[Math.floor(Math.random()*array.length)];
const price=Math.floor(Math.random()*20)+10

const seedDB=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<200; i++) {
        const random1000=Math.floor(Math.random()*1000);
        const camp=new Campground({
            author: "632124bab4aef9e43b8a3b93",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dh9y1pv65/image/upload/v1663268577/CampApp/myfkdlwmv3vakujhgee3.jpg',
                    filename: 'CampApp/myfkdlwmv3vakujhgee3'
                },
                {
                    url: 'https://res.cloudinary.com/dh9y1pv65/image/upload/v1663268577/CampApp/mwu1f19ipran2xmiqxls.jpg',
                    filename: 'CampApp/mwu1f19ipran2xmiqxls'
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus placeat incidunt cum sapiente velit, dicta aliquam soluta consequuntur maiores nostrum quasi modi sit deleniti. Est eaque eveniet quae modi.",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })

