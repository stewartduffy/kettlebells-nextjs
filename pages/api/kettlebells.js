const axios = require("axios").default;
const cheerio = require("cheerio");

const sitesToCheck = [
  "https://www.industrialathletic.com/4kg-cast-iron-kettlebell",
  "https://www.industrialathletic.com/12kg-cast-iron-kettlebell",
  "https://www.industrialathletic.com/16kg-cast-iron-kettlebell",
  "http://solidstrengthequipment.co.nz/4kg-kettlebell",
  "http://solidstrengthequipment.co.nz/12kg-kettlebell",
  "http://solidstrengthequipment.co.nz/16kg-kettlebell",
];

const checkUrl = (url, search) => {
  return url.search(search) > 0 ? true : false;
};

const getButtonSelector = (url) => {
  switch (true) {
    case checkUrl(url, "industrialathletic"):
      return "#form-action-addToCart";
    case checkUrl(url, "solidstrengthequipment"):
      return '.product-add-to-cart input[type="submit"]';
  }
};

const getHtml = async (url) => {
  const html = await axios.get(url);
  return {
    url,
    buttonValue: getAddToCartButton(html, url),
  };
};

function getAddToCartButton(response, url) {
  // load up cheerio
  const $ = cheerio.load(response.data);
  const buttonSelector = getButtonSelector(url);
  const buttonValue = $(buttonSelector).attr("value");
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
