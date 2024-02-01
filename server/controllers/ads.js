import Advertise from "../models/Ads.js";

export const createAd = async (req, res) => {
  try {
    const { title, websiteLink, description, picturePath } = req.body;

    const newAd = new Advertise({
      title: title,
      websiteLink: websiteLink,
      description: description,
      picturePath: picturePath,
    });
    await newAd.save();

    const ad = await Advertise.find();
    res.status(201).json(ad);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getAds = async (req, res) => {
  try {
    const ad = await Advertise.find();
    // res.status(200).json(ad);
    // console.log(ad)

    const getRandomAds = (ad, numberOfSuggestions) => {
      const shuffledAds = ad.sort(() => 0.5 - Math.random());
      return shuffledAds.slice(0, numberOfSuggestions);
    };

    res.status(200).json(getRandomAds(ad, 1));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};