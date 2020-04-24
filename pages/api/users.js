const axios = require("axios").default;
const cheerio = require("cheerio");

const sitesToCheck = [
  "https://www.industrialathletic.com/4kg-cast-iron-kettlebell",
  "https://www.industrialathletic.com/12kg-cast-iron-kettlebell",
  "https://www.industrialathletic.com/16kg-cast-iron-kettlebell",
];

const getHtml = async (url) => {
  const html = await axios.get(url);
  return {
    url,
    buttonValue: getAddToCartButton(html),
  };
};

function getAddToCartButton(response) {
  // load up cheerio
  const $ = cheerio.load(response.data);
  const buttonValue = $("#form-action-addToCart").attr("value");
  console.log(buttonValue);
  return buttonValue;
}

export default async (req, res) => {
  try {
    const data = await Promise.all(sitesToCheck.map(getHtml));

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
};
