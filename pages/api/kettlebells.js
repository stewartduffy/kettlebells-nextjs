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

function getStatus(response, url) {
  // load up cheerio
  const $ = cheerio.load(response.data);

  switch (true) {
    case checkUrl(url, "industrialathletic"):
      return $("#form-action-addToCart").attr("value") === "Add to Cart"
        ? "Available"
        : "Out Of Stock";
    case checkUrl(url, "solidstrengthequipment"):
      return $('.product-add-to-cart input[type="submit"]').attr("value") ===
        "Add To Cart"
        ? "Available"
        : "Out Of Stock";
  }
}

const getHtml = async (url) => {
  const html = await axios.get(url);
  return {
    url,
    status: getStatus(html, url),
  };
};

export default async (req, res) => {
  try {
    const data = await Promise.all(sitesToCheck.map(getHtml));

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
};
